<script>
    import Modal from './Modal.svelte';

    /**
     * @typedef {Object} Props
     * @property {boolean} [active]
     * @property {Record<string, any> | null} assignment
     * @property {{ id: string, name?: string, version?: string } | null} [solver]
     * @property {string} [minizincVersion]
     * @property {Array<Record<string, any>>} [projectFiles]
     * @property {boolean} [running]
     * @property {number} [progress]
     * @property {string} [status]
     * @property {(payload: Record<string, any>) => void} [onrunandsubmit]
     * @property {() => void} [onabort]
     * @property {() => void} [onclose]
     */
    /** @type {Props} */
    let {
        active = false,
        assignment,
        solver = null,
        minizincVersion = '',
        projectFiles = [],
        running = false,
        progress = 0,
        status = '',
        onrunandsubmit,
        onabort,
        onclose,
    } = $props();

    let email = $state('');
    let secret = $state('');
    let termsAccepted = $state(false);
    let selectedSolutionIds = $state([]);
    let selectedModelIds = $state([]);
    let initializedAssignment = null;

    function reset() {
        email = '';
        secret = '';
        termsAccepted = false;
        selectedSolutionIds =
            assignment?.solutionAssignments.map((item) => item.id) || [];
        selectedModelIds =
            assignment?.modelAssignments.map((item) => item.id) || [];
    }

    /** Allow the embed protocol to populate in-memory credentials later. */
    export function setCredentials({
        submitterEmail = '',
        secret: nextSecret = '',
    }) {
        email = submitterEmail;
        secret = nextSecret;
    }

    export function resetForm() {
        reset();
    }

    $effect(() => {
        if (assignment !== initializedAssignment) {
            initializedAssignment = assignment;
            reset();
        }
    });

    let termsRequired = $derived(Boolean(assignment?.submissionTerms));
    let canSubmit = $derived(
        !running &&
            email.trim().length > 0 &&
            secret.length > 0 &&
            (!termsRequired || termsAccepted),
    );
    let assignmentModelNames = $derived(
        new Set([
            ...(assignment?.solutionAssignments || []).map(
                (item) => item.model,
            ),
            ...(assignment?.modelAssignments || []).map((item) => item.model),
        ]),
    );
    let nonSubmissionModels = $derived(
        projectFiles.filter(
            (file) =>
                !file.hidden &&
                !file.readOnly &&
                file.name.endsWith('.mzn') &&
                !file.name.endsWith('.mzc.mzn') &&
                !assignmentModelNames.has(file.name),
        ),
    );

    function submit() {
        if (!canSubmit || !assignment) return;
        onrunandsubmit?.({
            submitterEmail: email.trim(),
            secret,
            solutionIds: selectedSolutionIds,
            modelIds: selectedModelIds,
        });
    }

    function close() {
        if (running) {
            if (!globalThis.confirm?.('Abort this submission?')) return;
            onabort?.();
            return;
        }
        onclose?.();
    }
</script>

<Modal
    {active}
    title={`Submit to ${assignment?.moocName || 'MOOC'}`}
    oncancel={close}
    onsubmit={submit}
>
    {#if assignment}
        <fieldset disabled={running}>
            <div class="field">
                <p class="label">Assignment</p>
                <p>{assignment.name}</p>
            </div>

            <div class="assignment-lists">
                <div class="field">
                    <p class="label">Solution assignments</p>
                    {#if assignment.solutionAssignments.length === 0}
                        <p>None</p>
                    {:else}
                        {#each assignment.solutionAssignments as item}
                            <label class="checkbox assignment-item">
                                <input
                                    type="checkbox"
                                    value={item.id}
                                    bind:group={selectedSolutionIds}
                                    disabled={item.required}
                                />
                                {item.name}{item.required ? ' (required)' : ''}
                            </label>
                        {/each}
                    {/if}
                </div>
                <div class="field">
                    <p class="label">Model assignments</p>
                    {#if assignment.modelAssignments.length === 0}
                        <p>None</p>
                    {:else}
                        {#each assignment.modelAssignments as item}
                            <label class="checkbox assignment-item">
                                <input
                                    type="checkbox"
                                    value={item.id}
                                    bind:group={selectedModelIds}
                                    disabled={item.required}
                                />
                                {item.name}{item.required ? ' (required)' : ''}
                            </label>
                        {/each}
                    {/if}
                </div>
            </div>

            <div class="field">
                <label class="label" for="submission-email">Email</label>
                <div class="control">
                    <input
                        id="submission-email"
                        class="input"
                        type="email"
                        bind:value={email}
                    />
                </div>
            </div>
            <div class="field">
                <label class="label" for="submission-secret"
                    >{assignment.moocPasswordString}</label
                >
                <div class="control">
                    <input
                        id="submission-secret"
                        class="input"
                        type="password"
                        bind:value={secret}
                    />
                </div>
            </div>

            {#if termsRequired}
                <div class="field terms">
                    <p class="label">Terms of submission</p>
                    <pre>{assignment.submissionTerms}</pre>
                    <label class="checkbox">
                        <input type="checkbox" bind:checked={termsAccepted} />
                        I have read and accept the above terms and conditions
                    </label>
                </div>
            {/if}
        </fieldset>

        <div class="field solver-info">
            <p class="label">Submission environment</p>
            <p>
                Solver: {solver
                    ? `${solver.name || solver.id}${solver.version || ''}`
                    : 'Unavailable'}
            </p>
            <p>MiniZinc: {minizincVersion || 'Loading…'}</p>
        </div>

        {#if nonSubmissionModels.length > 0}
            <article class="message is-warning">
                <div class="message-body">
                    These open editable models are not part of this submission:
                    {nonSubmissionModels.map((file) => file.name).join(', ')}.
                </div>
            </article>
        {/if}

        <div class="submission-progress" aria-live="polite">
            <progress class="progress is-primary" value={progress} max="100"
                >{progress}%</progress
            >
            <p>
                {status ||
                    (running ? 'Preparing submission…' : 'Ready to submit.')}
            </p>
        </div>
    {/if}

    {#snippet footer()}
        <div class="buttons">
            {#if running}
                <button
                    type="button"
                    class="button is-danger"
                    onclick={() => onabort?.()}>Abort</button
                >
            {:else}
                <button
                    type="submit"
                    class="button is-primary"
                    disabled={!canSubmit}>Run and submit</button
                >
                <button type="button" class="button" onclick={close}
                    >Cancel</button
                >
            {/if}
        </div>
    {/snippet}
</Modal>

<style>
    .assignment-lists {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
        gap: 1rem;
    }
    .assignment-item {
        display: block;
        margin-bottom: 0.4rem;
    }
    .terms pre {
        white-space: pre-wrap;
        max-height: 12rem;
        overflow: auto;
        margin-bottom: 0.75rem;
    }
    .solver-info p {
        margin: 0;
    }
    .submission-progress {
        margin-top: 1rem;
    }
</style>
