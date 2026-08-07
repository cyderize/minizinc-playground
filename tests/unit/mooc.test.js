import { describe, expect, test } from 'vitest';
import { parseMooc, rewriteMoocReferences } from '../../src/lib/mooc.js';

const descriptor = {
    assignmentKey: 'key',
    name: 'Assignment',
    moocName: 'Course',
    moocPasswordString: 'Token',
    submissionURL: 'https://example.test/submit',
    solutionAssignments: [
        {
            id: 'solution',
            name: 'Solution',
            model: 'model.mzn',
            data: 'data.dzn',
            timeout: '60',
        },
    ],
    modelAssignments: [{ id: 'model', name: 'Model', model: 'model.mzn' }],
    history: { ignored: true },
};

describe('parseMooc', () => {
    test('normalises supported fields and drops unsupported fields', () => {
        const { assignment, error } = parseMooc(JSON.stringify(descriptor), [
            'model.mzn',
            'data.dzn',
        ]);
        expect(error).toBeNull();
        expect(assignment).toEqual({
            assignmentKey: 'key',
            name: 'Assignment',
            moocName: 'Course',
            moocPasswordString: 'Token',
            submissionURL: 'https://example.test/submit',
            solutionAssignments: [
                {
                    id: 'solution',
                    name: 'Solution',
                    model: 'model.mzn',
                    data: 'data.dzn',
                    timeout: 60,
                    required: false,
                },
            ],
            modelAssignments: [
                {
                    id: 'model',
                    name: 'Model',
                    model: 'model.mzn',
                    required: false,
                },
            ],
            submissionTerms: '',
            sendMeta: false,
        });
    });

    test.each([0, -1, '0', '1.5', 1.5])(
        'rejects invalid timeout %o',
        (value) => {
            const invalid = structuredClone(descriptor);
            invalid.solutionAssignments[0].timeout = value;
            expect(
                parseMooc(JSON.stringify(invalid), ['model.mzn', 'data.dzn'])
                    .error,
            ).toBeTruthy();
        },
    );

    test('rejects unresolved references and duplicate IDs', () => {
        expect(
            parseMooc(JSON.stringify(descriptor), ['model.mzn']).error,
        ).toBeTruthy();
        const duplicate = structuredClone(descriptor);
        duplicate.modelAssignments[0].id = 'solution';
        expect(
            parseMooc(JSON.stringify(duplicate), ['model.mzn', 'data.dzn'])
                .error,
        ).toBeTruthy();
    });

    test('rewrites native paths before validation', () => {
        const native = structuredClone(descriptor);
        native.solutionAssignments[0].model = 'models/model.mzn';
        native.solutionAssignments[0].data = 'data/data.dzn';
        native.modelAssignments[0].model = 'models/model.mzn';
        const rewritten = rewriteMoocReferences(
            JSON.stringify(native),
            new Map([
                ['models/model.mzn', 'model.mzn'],
                ['data/data.dzn', 'data.dzn'],
            ]),
        );
        expect(
            parseMooc(rewritten, ['model.mzn', 'data.dzn']).error,
        ).toBeNull();
    });
});
