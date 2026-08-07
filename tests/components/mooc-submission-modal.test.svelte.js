import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { expect, test, vi } from 'vitest';
import MoocSubmissionModal from '../../src/lib/MoocSubmissionModal.svelte';

const assignment = {
    assignmentKey: 'key',
    name: 'Assessment',
    moocName: 'Example Course',
    moocPasswordString: 'Submission token',
    submissionURL: 'https://example.test/submit',
    solutionAssignments: [
        {
            id: 'required-solution',
            name: 'Required solution',
            model: 'model.mzn',
            data: 'data.dzn',
            timeout: 60,
            required: true,
        },
        {
            id: 'optional-solution',
            name: 'Optional solution',
            model: 'model.mzn',
            data: 'data.dzn',
            timeout: 60,
            required: false,
        },
    ],
    modelAssignments: [
        {
            id: 'model',
            name: 'Model upload',
            model: 'model.mzn',
            required: false,
        },
    ],
    submissionTerms: 'Read every term.\nThis is the second line.',
    sendMeta: false,
};

test('collects selections and credentials only after terms are accepted', async () => {
    const onrunandsubmit = vi.fn();
    render(MoocSubmissionModal, {
        active: true,
        assignment,
        solver: { id: 'gecode', name: 'Gecode', version: ' 6.3' },
        minizincVersion: 'version 4.5.0',
        projectFiles: [
            { name: 'model.mzn', contents: 'solve satisfy;' },
            { name: 'other.mzn', contents: 'solve satisfy;' },
        ],
        onrunandsubmit,
    });

    const required = screen.getByLabelText(/Required solution/);
    expect(required).toBeChecked();
    expect(required).toBeDisabled();
    expect(
        screen.getByRole('button', { name: 'Run and submit' }),
    ).toBeDisabled();
    expect(
        screen.getByText(/open editable models are not part/),
    ).toHaveTextContent('other.mzn');
    expect(screen.getByText(/Read every term\./)).toBeInTheDocument();

    await fireEvent.input(screen.getByLabelText('Email'), {
        target: { value: 'student@example.test' },
    });
    await fireEvent.input(screen.getByLabelText('Submission token'), {
        target: { value: 'secret-value' },
    });
    await fireEvent.click(
        screen.getByLabelText(/I have read and accept the above terms/),
    );
    expect(
        screen.getByRole('button', { name: 'Run and submit' }),
    ).toBeEnabled();

    await fireEvent.click(screen.getByLabelText(/Optional solution/));
    await fireEvent.click(
        screen.getByRole('button', { name: 'Run and submit' }),
    );
    expect(onrunandsubmit).toHaveBeenCalledWith({
        submitterEmail: 'student@example.test',
        secret: 'secret-value',
        solutionIds: ['required-solution'],
        modelIds: ['model'],
    });
});

test('shows abort-only controls while a submission is active', async () => {
    const onabort = vi.fn();
    render(MoocSubmissionModal, {
        active: true,
        assignment: { ...assignment, submissionTerms: '' },
        running: true,
        progress: 50,
        status: 'Running Required solution…',
        onabort,
    });

    expect(screen.getByRole('button', { name: 'Abort' })).toBeEnabled();
    expect(
        screen.queryByRole('button', { name: 'Run and submit' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Running Required solution…')).toBeInTheDocument();
    await fireEvent.click(screen.getByRole('button', { name: 'Abort' }));
    await waitFor(() => expect(onabort).toHaveBeenCalledOnce());
});
