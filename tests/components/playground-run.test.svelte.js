import { render, waitFor } from '@testing-library/svelte';
import { afterEach, expect, test } from 'vitest';
import Playground from '../../src/lib/Playground.svelte';
import {
    getLastModel,
    getLastOperation,
    resetMock,
} from '../mocks/minizinc.js';

afterEach(() => resetMock());

test('runs the current model with its files', async () => {
    const { component } = render(Playground, {
        project: null,
        autoFocus: false,
        hideOutputOnStartup: false,
    });

    await component.loadProject({
        files: [
            { name: 'model.mzn', contents: 'solve satisfy;' },
            { name: 'data.dzn', contents: 'n = 1;', hidden: true },
        ],
        solverId: 'org.minizinc.gecode_presolver',
    });

    const run = component.run();
    await waitFor(() => expect(getLastOperation()).toBeTruthy());

    expect(getLastModel().files).toEqual([
        { name: 'model.mzn', contents: 'solve satisfy;', include: true },
        { name: 'data.dzn', contents: 'n = 1;', include: false },
    ]);
    expect(getLastOperation().options).toMatchObject({
        jsonOutput: false,
        options: { solver: 'org.minizinc.gecode_presolver' },
    });

    getLastOperation().emit('solution', {
        type: 'solution',
        output: { x: 1 },
        sections: [],
    });
    getLastOperation().resolve();
    await run;
});

test('runs a submission assignment with an isolated timeout and serialised output', async () => {
    const { component } = render(Playground, {
        project: null,
        autoFocus: false,
        hideOutputOnStartup: false,
    });
    await component.loadProject({
        files: [
            { name: 'model.mzn', contents: 'solve satisfy;' },
            { name: 'data.dzn', contents: 'n = 1;', hidden: true },
            { name: 'model.mzc', contents: 'checker;', hidden: true },
            { name: '_mooc', contents: '{"private":true}', hidden: true },
            {
                name: 'include.mzn',
                contents: 'predicate p = true;',
                hidden: true,
            },
        ],
        solverId: 'org.minizinc.gecode_presolver',
        solverConfig: { enableTimeLimit: true, timeLimit: 3 },
    });

    const run = component.runAssignment({
        model: 'model.mzn',
        data: 'data.dzn',
        timeout: 60,
    });
    await waitFor(() => expect(getLastOperation()).toBeTruthy());

    expect(getLastModel().files).toEqual([
        { name: 'model.mzn', contents: 'solve satisfy;', include: true },
        { name: 'data.dzn', contents: 'n = 1;', include: true },
        { name: 'model.mzc', contents: 'checker;', include: true },
        {
            name: 'include.mzn',
            contents: 'predicate p = true;',
            include: false,
        },
    ]);
    expect(getLastOperation().options.options).toMatchObject({
        solver: 'org.minizinc.gecode_presolver',
        'time-limit': 60000,
        'output-mode': 'checker',
    });

    getLastOperation().emit('solution', {
        output: { dzn: 'x = 1;\n' },
    });
    getLastOperation().emit('status', { status: 'OPTIMAL_SOLUTION' });
    getLastOperation().emit('checker', { result: 'accepted' });
    getLastOperation().resolve();

    await expect(run).resolves.toEqual({
        output: 'x = 1;\n----------\n==========\n',
        status: 'OPTIMAL_SOLUTION',
        checkerOutput: [{ result: 'accepted' }],
        error: null,
    });
    expect(component.getProject().solverConfig.timeLimit).toBe(3);
});

test('cancels an active submission assignment run', async () => {
    const { component } = render(Playground, {
        project: null,
        autoFocus: false,
    });
    await component.loadProject({
        files: [
            { name: 'model.mzn', contents: 'solve satisfy;' },
            { name: 'data.dzn', contents: '', hidden: true },
        ],
        solverId: 'org.minizinc.gecode_presolver',
    });

    const run = component.runAssignment({
        model: 'model.mzn',
        data: 'data.dzn',
        timeout: 1,
    });
    await waitFor(() => expect(getLastOperation()).toBeTruthy());
    component.cancelAssignmentRun();

    await expect(run).resolves.toMatchObject({ error: 'cancelled' });
});
