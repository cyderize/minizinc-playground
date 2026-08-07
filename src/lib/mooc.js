export const MOOC_FILE_NAME = '_mooc';

/** @param {string} name */
export function isMoocFile(name) {
    return name === MOOC_FILE_NAME;
}

/**
 * Resolve a descriptor reference against names already loaded into a flattened
 * Playground project.
 * @param {string} name
 * @param {Array<string | { name: string }>} projectFiles
 * @returns {string | null}
 */
export function resolveMoocFile(name, projectFiles) {
    return typeof name === 'string' &&
        projectFiles.some(
            (file) => (typeof file === 'string' ? file : file.name) === name,
        )
        ? name
        : null;
}

/** @param {unknown} value @param {string} field */
function requiredString(value, field) {
    if (typeof value !== 'string' || value.length === 0) {
        throw new Error(`${field} must be a non-empty string`);
    }
    return value;
}

/** @param {unknown} value */
function normaliseTimeout(value) {
    const parsed =
        typeof value === 'number'
            ? value
            : typeof value === 'string' && /^\d+$/.test(value)
              ? Number(value)
              : NaN;
    if (!Number.isSafeInteger(parsed) || parsed <= 0) {
        throw new Error('timeout must be a positive integer');
    }
    return parsed;
}

/**
 * Parse and validate the supported subset of a native `_mooc` descriptor.
 * @param {string} contents
 * @param {Array<string | { name: string }>} projectFiles
 * @returns {{ assignment: Record<string, any> | null, error: Error | null }}
 */
export function parseMooc(contents, projectFiles) {
    try {
        const descriptor = JSON.parse(contents);
        if (
            !descriptor ||
            typeof descriptor !== 'object' ||
            Array.isArray(descriptor)
        ) {
            throw new Error('_mooc must contain a JSON object');
        }
        if (
            !Array.isArray(descriptor.solutionAssignments) ||
            !Array.isArray(descriptor.modelAssignments)
        ) {
            throw new Error('assignment arrays are required');
        }
        const ids = new Set();
        const id = (value) => {
            const result = requiredString(value, 'assignment id');
            if (ids.has(result))
                throw new Error(`duplicate assignment id: ${result}`);
            ids.add(result);
            return result;
        };
        const reference = (value, field) => {
            const result = requiredString(value, field);
            if (!resolveMoocFile(result, projectFiles)) {
                throw new Error(
                    `referenced ${field} does not exist: ${result}`,
                );
            }
            return result;
        };
        const required = (value) => {
            if (value !== undefined && typeof value !== 'boolean') {
                throw new Error('required must be a boolean');
            }
            return value === true;
        };
        const solutionAssignments = descriptor.solutionAssignments.map(
            (item) => {
                if (!item || typeof item !== 'object' || Array.isArray(item)) {
                    throw new Error('solution assignment must be an object');
                }
                return {
                    id: id(item.id),
                    model: reference(item.model, 'model'),
                    data: reference(item.data, 'data'),
                    timeout: normaliseTimeout(item.timeout),
                    name: requiredString(item.name, 'solution assignment name'),
                    required: required(item.required),
                };
            },
        );
        const modelAssignments = descriptor.modelAssignments.map((item) => {
            if (!item || typeof item !== 'object' || Array.isArray(item)) {
                throw new Error('model assignment must be an object');
            }
            return {
                id: id(item.id),
                model: reference(item.model, 'model'),
                name: requiredString(item.name, 'model assignment name'),
                required: required(item.required),
            };
        });
        if (
            descriptor.submissionTerms !== undefined &&
            typeof descriptor.submissionTerms !== 'string'
        ) {
            throw new Error('submissionTerms must be a string');
        }
        if (
            descriptor.sendMeta !== undefined &&
            typeof descriptor.sendMeta !== 'boolean'
        ) {
            throw new Error('sendMeta must be a boolean');
        }
        return {
            assignment: {
                assignmentKey: requiredString(
                    descriptor.assignmentKey,
                    'assignmentKey',
                ),
                name: requiredString(descriptor.name, 'name'),
                moocName: requiredString(descriptor.moocName, 'moocName'),
                moocPasswordString: requiredString(
                    descriptor.moocPasswordString,
                    'moocPasswordString',
                ),
                submissionURL: requiredString(
                    descriptor.submissionURL,
                    'submissionURL',
                ),
                solutionAssignments,
                modelAssignments,
                submissionTerms: descriptor.submissionTerms || '',
                sendMeta: descriptor.sendMeta || false,
            },
            error: null,
        };
    } catch (error) {
        return {
            assignment: null,
            error: error instanceof Error ? error : new Error(String(error)),
        };
    }
}

/**
 * Rewrite native project paths before parsing them against flattened names.
 * @param {string} contents
 * @param {Map<string, string>} names
 */
export function rewriteMoocReferences(contents, names) {
    const descriptor = JSON.parse(contents);
    for (const item of descriptor.solutionAssignments || []) {
        if (typeof item?.model === 'string' && names.has(item.model))
            item.model = names.get(item.model);
        if (typeof item?.data === 'string' && names.has(item.data))
            item.data = names.get(item.data);
    }
    for (const item of descriptor.modelAssignments || []) {
        if (typeof item?.model === 'string' && names.has(item.model))
            item.model = names.get(item.model);
    }
    return JSON.stringify(descriptor);
}
