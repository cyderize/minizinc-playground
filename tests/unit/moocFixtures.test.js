import { describe, expect, test } from 'vitest';
import { parseMooc, rewriteMoocReferences } from '../../src/lib/mooc.js';

function loadDescriptor(descriptor, files) {
    const names = new Map(files.map((file) => [file, file.split('/').pop()]));
    return parseMooc(rewriteMoocReferences(JSON.stringify(descriptor), names), [
        ...names.values(),
    ]);
}

describe('supplied MOOC fixtures', () => {
    test('preserves the Coursera fixture assignments and endpoint', () => {
        const { assignment, error } = loadDescriptor(
            {
                assignmentKey: 'coursera-key',
                name: 'Seven Paces',
                moocName: 'Coursera',
                moocPasswordString: 'Assignment token',
                submissionURL:
                    'https://www.coursera.org/api/onDemandProgrammingScriptSubmissions.v1',
                solutionAssignments: ['j91je', 'cmKfu', 'sYIb3', 'rTboR'].map(
                    (id) => ({
                        id,
                        name: id,
                        model: `models/${id}.mzn`,
                        data: 'data/empty.dzn',
                        timeout: 60,
                    }),
                ),
                modelAssignments: [],
            },
            [
                'models/j91je.mzn',
                'models/cmKfu.mzn',
                'models/sYIb3.mzn',
                'models/rTboR.mzn',
                'data/empty.dzn',
            ],
        );
        expect(error).toBeNull();
        expect(assignment.submissionURL).toBe(
            'https://www.coursera.org/api/onDemandProgrammingScriptSubmissions.v1',
        );
        expect(assignment.modelAssignments).toEqual([]);
        expect(assignment.solutionAssignments.map((item) => item.id)).toEqual([
            'j91je',
            'cmKfu',
            'sYIb3',
            'rTboR',
        ]);
        expect(
            assignment.solutionAssignments.map((item) => item.timeout),
        ).toEqual([60, 60, 60, 60]);
    });

    test('flattens the MiniZinc grading fixture and discards history', () => {
        const { assignment, error } = loadDescriptor(
            {
                assignmentKey: 'grading-key',
                name: 'Test Project',
                moocName: 'Test Course',
                moocPasswordString: 'Submission token',
                submissionURL: 'https://grader.example.test',
                history: { deliberately: 'discarded' },
                solutionAssignments: [
                    {
                        id: 'one',
                        name: 'One',
                        model: 'models/test.mzn',
                        data: 'data/data1.dzn',
                        timeout: '60',
                    },
                    {
                        id: 'two',
                        name: 'Two',
                        model: 'models/test.mzn',
                        data: 'data/data2.dzn',
                        timeout: '60',
                    },
                ],
                modelAssignments: [
                    { id: 'model', name: 'Model', model: 'models/test.mzn' },
                ],
            },
            [
                'models/test.mzn',
                'models/test.mzc',
                'data/data1.dzn',
                'data/data2.dzn',
            ],
        );
        expect(error).toBeNull();
        expect(assignment.solutionAssignments).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    model: 'test.mzn',
                    data: 'data1.dzn',
                    timeout: 60,
                }),
                expect.objectContaining({
                    model: 'test.mzn',
                    data: 'data2.dzn',
                    timeout: 60,
                }),
            ]),
        );
        expect(assignment.modelAssignments[0]).toMatchObject({
            model: 'test.mzn',
        });
        expect(assignment).not.toHaveProperty('history');
    });

    test('preserves sendMeta for the pipe-routing fixture', () => {
        const { assignment, error } = loadDescriptor(
            {
                assignmentKey: 'pipe-key',
                name: 'Pipe routing',
                moocName: 'Course',
                moocPasswordString: 'Submission token',
                submissionURL: 'https://grader.example.test',
                sendMeta: true,
                solutionAssignments: Array.from({ length: 6 }, (_, index) => ({
                    id: `solution-${index + 1}`,
                    name: `Solution ${index + 1}`,
                    model: 'models/pipe_routing.mzn',
                    data: `data/pipe_routing_0${index + 1}.dzn`,
                    timeout: '60',
                })),
                modelAssignments: [
                    {
                        id: 'model',
                        name: 'Model',
                        model: 'models/pipe_routing.mzn',
                    },
                ],
            },
            [
                'models/pipe_routing.mzn',
                'models/pipe_routing.mzc',
                ...Array.from(
                    { length: 6 },
                    (_, index) => `data/pipe_routing_0${index + 1}.dzn`,
                ),
            ],
        );
        expect(error).toBeNull();
        expect(assignment.sendMeta).toBe(true);
        expect(assignment.solutionAssignments).toHaveLength(6);
        expect(assignment.modelAssignments[0]).toMatchObject({
            model: 'pipe_routing.mzn',
        });
    });
});
