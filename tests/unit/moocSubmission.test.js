import { describe, expect, test, vi } from 'vitest';
import {
    createMoocSubmission,
    isSuccessfulAuthentication,
} from '../../src/lib/moocSubmission.js';

const assignment = {
    assignmentKey: 'key',
    submissionURL: 'https://example.test/submit',
    solutionAssignments: [
        {
            id: 'required',
            name: 'Required',
            model: 'model.mzn',
            data: 'one.dzn',
            timeout: 1,
            required: true,
        },
        {
            id: 'optional',
            name: 'Optional',
            model: 'model.mzn',
            data: 'two.dzn',
            timeout: 2,
            required: false,
        },
    ],
    modelAssignments: [
        { id: 'model', name: 'Model', model: 'model.mzn', required: false },
    ],
    sendMeta: true,
};

const jsonResponse = (status, body) => ({
    status,
    json: vi.fn().mockResolvedValue(body),
});

describe('MOOC submission protocol', () => {
    test('recognises the two native authentication-success responses', () => {
        expect(isSuccessfulAuthentication({ message: 'Success' })).toBe(true);
        expect(
            isSuccessfulAuthentication({ message: 'checked but found: Set()' }),
        ).toBe(true);
        expect(isSuccessfulAuthentication({ message: 'nope' })).toBe(false);
    });

    test('authenticates, runs selected assignments sequentially, and posts complete parts', async () => {
        const fetch = vi
            .fn()
            .mockResolvedValueOnce(jsonResponse(200, { message: 'Success' }))
            .mockResolvedValueOnce(
                jsonResponse(201, { details: { learnerMessage: 'Accepted' } }),
            );
        const runAssignment = vi
            .fn()
            .mockResolvedValueOnce({ output: 'required output' })
            .mockResolvedValueOnce({ output: 'optional output' });
        const controller = createMoocSubmission({
            assignment,
            projectFiles: [{ name: 'model.mzn', contents: 'solve satisfy;' }],
            getMiniZincVersion: () => 'version 4.5.0',
            runAssignment,
            fetch,
        });

        await expect(
            controller.submit({
                submitterEmail: 'student@example.test',
                secret: 'private-token',
                solutionIds: ['optional'],
                modelIds: ['model'],
            }),
        ).resolves.toEqual({ ok: true, aborted: false, message: 'Accepted' });

        expect(runAssignment).toHaveBeenNthCalledWith(
            1,
            assignment.solutionAssignments[0],
        );
        expect(runAssignment).toHaveBeenNthCalledWith(
            2,
            assignment.solutionAssignments[1],
        );
        expect(fetch).toHaveBeenCalledTimes(2);
        expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
            assignmentKey: 'key',
            secret: 'private-token',
            submitterEmail: 'student@example.test',
            parts: {},
        });
        expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({
            assignmentKey: 'key',
            secret: 'private-token',
            submitterEmail: 'student@example.test',
            parts: {
                required: { output: 'required output' },
                optional: { output: 'optional output' },
                model: { output: 'solve satisfy;' },
            },
            metadata: {
                version: 'version 4.5.0',
                client: 'MiniZinc Playground',
            },
        });
        expect(fetch.mock.calls[0][1].headers).toEqual({
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
        });
    });

    test('does not run or submit after failed authentication', async () => {
        const fetch = vi
            .fn()
            .mockResolvedValue(jsonResponse(200, { message: 'Denied' }));
        const runAssignment = vi.fn();
        const result = await createMoocSubmission({
            assignment: { ...assignment, sendMeta: false },
            projectFiles: [],
            getMiniZincVersion: () => '',
            runAssignment,
            fetch,
        }).submit({
            submitterEmail: 'student@example.test',
            secret: 'token',
            solutionIds: [],
            modelIds: [],
        });
        expect(result).toMatchObject({ ok: false, message: 'Denied' });
        expect(runAssignment).not.toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    test('aborts an in-flight authentication without a final POST', async () => {
        let rejectFetch;
        const fetch = vi.fn(
            () =>
                new Promise((_resolve, reject) => {
                    rejectFetch = reject;
                }),
        );
        const cancelAssignmentRun = vi.fn();
        const controller = createMoocSubmission({
            assignment,
            projectFiles: [],
            getMiniZincVersion: () => '',
            runAssignment: vi.fn(),
            cancelAssignmentRun,
            fetch,
        });
        const pending = controller.submit({
            submitterEmail: 'student@example.test',
            secret: 'token',
            solutionIds: [],
            modelIds: [],
        });
        const abort = controller.abort();
        rejectFetch(
            Object.assign(new Error('aborted'), { name: 'AbortError' }),
        );
        await abort;
        await expect(pending).resolves.toEqual({
            ok: false,
            aborted: true,
            message: 'Submission aborted.',
        });
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(cancelAssignmentRun).toHaveBeenCalledOnce();
    });
});
