const CLIENT_NAME = 'MiniZinc Playground';

/** @param {unknown} value */
function safeError(value) {
    return value instanceof Error ? value.message : String(value);
}

/** @param {any} body */
export function isSuccessfulAuthentication(body) {
    return (
        typeof body?.message === 'string' &&
        (body.message.endsWith('but found: Set()') ||
            body.message.endsWith('Success'))
    );
}

/** @param {any} body */
export function responseMessage(body) {
    return [body?.details?.learnerMessage, body?.message]
        .filter((message) => typeof message === 'string' && message.length > 0)
        .join('\n');
}

/**
 * Construct a cancellable MOOC submission controller. Credentials are accepted
 * only by `submit` and are never retained on this object.
 *
 * @param {{
 *   assignment: Record<string, any>,
 *   projectFiles: Array<{ name: string, contents: string }>,
 *   getMiniZincVersion: () => string,
 *   runAssignment: (assignment: Record<string, any>) => Promise<{ output: string }>,
 *   cancelAssignmentRun?: () => void,
 *   fetch?: typeof fetch,
 *   onprogress?: (value: { progress: number, status: string }) => void,
 * }} options
 */
export function createMoocSubmission(options) {
    const fetchFn = options.fetch || globalThis.fetch;
    let abortController = null;
    let abortRequested = false;
    let active = Promise.resolve();

    function report(progress, status) {
        options.onprogress?.({ progress, status });
    }

    /** @param {Record<string, any>} payload */
    async function post(payload) {
        const response = await fetchFn(options.assignment.submissionURL, {
            method: 'POST',
            headers: {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            signal: abortController.signal,
        });
        return response;
    }

    async function execute({ submitterEmail, secret, solutionIds, modelIds }) {
        if (!submitterEmail?.trim() || !secret) {
            return {
                ok: false,
                aborted: false,
                message: 'Email and submission token are required.',
            };
        }
        abortRequested = false;
        abortController = new AbortController();
        const basePayload = {
            assignmentKey: options.assignment.assignmentKey,
            secret,
            submitterEmail: submitterEmail.trim(),
        };
        try {
            report(5, 'Authenticating…');
            const authentication = await post({ ...basePayload, parts: {} });
            if (abortRequested)
                return {
                    ok: false,
                    aborted: true,
                    message: 'Submission aborted.',
                };
            if (authentication.status >= 400) {
                return {
                    ok: false,
                    aborted: false,
                    message: `Authentication failed (HTTP ${authentication.status}).`,
                };
            }
            let authenticationBody;
            try {
                authenticationBody = await authentication.json();
            } catch (_error) {
                return {
                    ok: false,
                    aborted: false,
                    message: 'Authentication failed: invalid server response.',
                };
            }
            if (abortRequested) {
                return {
                    ok: false,
                    aborted: true,
                    message: 'Submission aborted.',
                };
            }
            if (!isSuccessfulAuthentication(authenticationBody)) {
                return {
                    ok: false,
                    aborted: false,
                    message:
                        responseMessage(authenticationBody) ||
                        'Authentication failed.',
                };
            }

            const selectedSolutions =
                options.assignment.solutionAssignments.filter(
                    (item) => item.required || solutionIds.includes(item.id),
                );
            const selectedModels = options.assignment.modelAssignments.filter(
                (item) => item.required || modelIds.includes(item.id),
            );
            const parts = Object.fromEntries(
                [
                    ...options.assignment.solutionAssignments,
                    ...options.assignment.modelAssignments,
                ].map((item) => [item.id, {}]),
            );
            for (const item of selectedModels) {
                const file = options.projectFiles.find(
                    (candidate) => candidate.name === item.model,
                );
                if (file) parts[item.id] = { output: file.contents };
            }

            for (let index = 0; index < selectedSolutions.length; index++) {
                if (abortRequested)
                    return {
                        ok: false,
                        aborted: true,
                        message: 'Submission aborted.',
                    };
                const item = selectedSolutions[index];
                report(
                    15 +
                        Math.round(
                            (70 * index) /
                                Math.max(1, selectedSolutions.length),
                        ),
                    `Running ${item.name}…`,
                );
                const result = await options.runAssignment(item);
                parts[item.id] = { output: result.output || '' };
            }
            if (abortRequested)
                return {
                    ok: false,
                    aborted: true,
                    message: 'Submission aborted.',
                };

            report(90, 'Submitting…');
            const payload = {
                ...basePayload,
                parts,
                ...(options.assignment.sendMeta
                    ? {
                          metadata: {
                              version: options.getMiniZincVersion(),
                              client: CLIENT_NAME,
                          },
                      }
                    : {}),
            };
            const response = await post(payload);
            if (abortRequested)
                return {
                    ok: false,
                    aborted: true,
                    message: 'Submission aborted.',
                };
            if (response.status >= 400) {
                return {
                    ok: false,
                    aborted: false,
                    message: `Submission failed (HTTP ${response.status}).`,
                };
            }
            let body = null;
            try {
                body = await response.json();
            } catch (_error) {
                // A successful Coursera response may have no JSON body.
            }
            report(100, responseMessage(body) || 'Submission complete.');
            return {
                ok: true,
                aborted: false,
                message: responseMessage(body) || 'Submission complete.',
            };
        } catch (error) {
            if (abortRequested || error?.name === 'AbortError') {
                return {
                    ok: false,
                    aborted: true,
                    message: 'Submission aborted.',
                };
            }
            return {
                ok: false,
                aborted: false,
                message: `Submission failed: ${safeError(error)}`,
            };
        } finally {
            abortController = null;
        }
    }

    return {
        submit(args) {
            active = execute(args);
            return active;
        },
        async abort() {
            abortRequested = true;
            abortController?.abort();
            options.cancelAssignmentRun?.();
            await active;
        },
        whenSettled() {
            return active;
        },
    };
}
