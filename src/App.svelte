<script>
    import { onDestroy, onMount, tick } from 'svelte';
    import Playground from './lib/Playground.svelte';
    import MoocSubmissionModal from './lib/MoocSubmissionModal.svelte';
    import RecentProjectsModal from './lib/RecentProjectsModal.svelte';
    import { loadFromUrl } from './lib/loadFromUrl';
    import Fa from 'svelte-fa';
    import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
    import { initialiseSettings, settings } from './stores';
    import {
        DEFAULT_EMBED_OPTIONS,
        normaliseEmbedOptions,
        normaliseProject,
        parseEmbedConfig,
    } from './lib/embedConfig';
    import { createEmbedProtocol } from './lib/embedProtocol';
    import { parseMooc } from './lib/mooc.js';
    import { createMoocSubmission } from './lib/moocSubmission.js';

    let playground = $state();
    const embedConfig = parseEmbedConfig(window.location.hash);
    const embedded = embedConfig !== null;
    let embedOptions = $state(
        embedded ? { ...DEFAULT_EMBED_OPTIONS, ...embedConfig.options } : {},
    );
    initialiseSettings({ persistence: !embedded });
    /** @param {Record<string, any>} options */
    function updateEmbedOptions(options) {
        const nextOptions = normaliseEmbedOptions(options);
        embedOptions = { ...embedOptions, ...nextOptions };
        settings.update((current) => ({
            ...current,
            ...(nextOptions.autoClearOutput === undefined
                ? {}
                : { autoClearOutput: nextOptions.autoClearOutput }),
            ...(nextOptions.splitterDirection === undefined
                ? {}
                : { splitterDirection: nextOptions.splitterDirection }),
            ...(nextOptions.splitterSize === undefined
                ? {}
                : { splitterSize: nextOptions.splitterSize }),
        }));
        return normaliseEmbedOptions(embedOptions);
    }
    if (embedded) {
        updateEmbedOptions(embedConfig.options);
    }

    let project = $state(null);
    let timestamp = null;
    let openRecent = $state(false);
    let solvers = $state([]);
    let embedProtocol = null;
    let assignment = $state(null);
    let assignmentContents = null;
    let submissionModal = $state();
    let submissionModalActive = $state(false);
    let submissionRunning = $state(false);
    let submissionProgress = $state(0);
    let submissionStatus = $state('');
    let submissionProjectFiles = $state([]);
    let submissionSolver = $state(null);
    let submissionController = null;
    let submissionPromise = null;
    let playgroundBusy = $state(false);

    /** @param {Record<string, any>} snapshot */
    function updateAssignment(snapshot) {
        const contents = snapshot.files?.find(
            (file) => file.name === '_mooc',
        )?.contents;
        if (contents === assignmentContents) return;
        assignmentContents = contents || null;
        submissionModalActive = false;
        if (!contents) {
            assignment = null;
            return;
        }
        const parsed = parseMooc(contents, snapshot.files);
        if (parsed.error) {
            globalThis.alert?.('Failed to load _mooc file');
            assignment = null;
            return;
        }
        assignment = parsed.assignment;
    }

    function openSubmissionModal() {
        if (!assignment || playgroundBusy || submissionRunning) return;
        submissionProjectFiles = playground.getProjectFiles();
        submissionSolver = playground.getCurrentSolver();
        submissionProgress = 0;
        submissionStatus = '';
        submissionModalActive = true;
    }

    async function submitMooc(credentials) {
        if (!assignment || submissionRunning) return;
        submissionProjectFiles = playground.getProjectFiles();
        submissionSolver = playground.getCurrentSolver();
        submissionRunning = true;
        submissionProgress = 0;
        submissionStatus = 'Preparing submission…';
        submissionController = createMoocSubmission({
            assignment,
            projectFiles: submissionProjectFiles,
            getMiniZincVersion: () => playground.getMiniZincVersion(),
            runAssignment: (item) => playground.runAssignment(item),
            cancelAssignmentRun: () => playground.cancelAssignmentRun(),
            onprogress: ({ progress, status }) => {
                submissionProgress = progress;
                submissionStatus = status;
            },
        });
        submissionPromise = submissionController.submit(credentials);
        const result = await submissionPromise;
        submissionRunning = false;
        submissionController = null;
        submissionPromise = null;
        submissionStatus = result.message;
    }

    async function abortSubmission() {
        if (submissionController) await submissionController.abort();
    }

    /** @param {() => any} operation */
    async function afterSubmission(operation) {
        if (submissionRunning) {
            await abortSubmission();
            await submissionPromise;
        }
        return operation();
    }

    async function setSubmissionCredentials({ submitterEmail, secret }) {
        if (!assignment) throw new Error('No valid MOOC assignment is loaded');
        if (typeof submitterEmail !== 'string' || typeof secret !== 'string') {
            throw new Error('Submission credentials must be strings');
        }
        await tick();
        submissionModal?.setCredentials({ submitterEmail, secret });
        return {};
    }
    /** @param {any[]} solvers @param {any} $settings */
    function getRecentProjects(solvers, $settings) {
        if (embedded || !playground || !$settings) {
            return [];
        }
        return Object.entries($settings.sessions)
            .map(([key, value]) => {
                const solver = solvers.find((s) => s.id === value.solverId);
                return {
                    key,
                    files: value.files,
                    timestamp: value.timestamp,
                    solver: solver ? solver.name : '<unknown solver>',
                };
            })
            .filter((p) => p.key !== sessionStorage.mznPlaygroundSession)
            .sort((a, b) => b.timestamp - a.timestamp);
    }

    const defaultModel = '% Use this editor as a MiniZinc scratch book\n';

    const alphabet =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    function newSession() {
        const genId = () =>
            Array(6)
                .fill(0)
                .map(
                    () => alphabet[Math.floor(Math.random() * alphabet.length)],
                )
                .join('');
        let id = genId();
        while (id in $settings.sessions) {
            id = genId();
        }
        return id;
    }

    /** @param {Record<string, any>} p */
    function migrateProject(p) {
        if (!p.solverId) {
            // For backwards compatibility with initial version
            if (p.solver === 0) {
                p.solverId = 'org.minizinc.gecode_presolver';
            } else if (p.solver === 1) {
                p.solverId = 'org.minizinc.mip.coin-bc';
            }
        }
        return p;
    }

    let ignoreHashChange = false;
    async function hashChange() {
        if (embedded) {
            return;
        }
        const hash = window.location.hash;
        if (hash.length > 0) {
            ignoreHashChange = true;
            window.history.replaceState(
                undefined,
                undefined,
                window.location.pathname + window.location.search,
            );
            ignoreHashChange = false;
        }
        if (ignoreHashChange) {
            return;
        }

        if (hash.startsWith('#project=')) {
            try {
                const json = decodeURIComponent(hash.substring(9));
                openProject(newSession(), {
                    ...JSON.parse(json),
                    timestamp: Date.now(),
                });
                return;
            } catch (e) {
                console.error(e);
            }
        }

        if (hash.startsWith('#code=')) {
            try {
                const contents = decodeURIComponent(hash.substring(6));
                openProject(newSession(), {
                    files: [
                        {
                            name: 'Playground.mzn',
                            contents,
                            anchor: contents.length,
                        },
                    ],
                    timestamp: Date.now(),
                });
                return;
            } catch (e) {
                console.error(e);
            }
        }

        if (hash.startsWith('#url=')) {
            try {
                const url = decodeURIComponent(hash.substring(5));
                openProject(newSession(), await loadFromUrl(url));
                return;
            } catch (e) {
                console.error(e);
            }
        }

        if (
            sessionStorage.mznPlaygroundSession &&
            $settings.sessions[sessionStorage.mznPlaygroundSession]
        ) {
            openProject(
                sessionStorage.mznPlaygroundSession,
                $settings.sessions[sessionStorage.mznPlaygroundSession],
            );
            return;
        }

        if (!project || project.files.length === 0) {
            openProject(newSession(), {
                files: [
                    {
                        name: 'Playground.mzn',
                        contents: defaultModel,
                        anchor: defaultModel.length,
                    },
                ],
                timestamp: Date.now(),
            });
        }
    }

    async function startEmbeddedPlayground() {
        if (embedConfig.url) {
            project = await loadFromUrl(embedConfig.url);
        } else if (embedConfig.project) {
            project = embedConfig.project;
        } else {
            project = {
                files: [
                    {
                        name: 'Playground.mzn',
                        contents: defaultModel,
                        anchor: defaultModel.length,
                    },
                ],
            };
        }
        await tick();
        await playground.whenProjectLoaded();
        embedProtocol = createEmbedProtocol({
            hostWindow: window,
            operations: {
                loadProject: async (nextProject) => {
                    return afterSubmission(async () => {
                        project = normaliseProject(nextProject);
                        await tick();
                        await playground.whenProjectLoaded();
                        return { project: playground.getProject() };
                    });
                },
                getProject: () =>
                    afterSubmission(() => playground.getProject()),
                run: () => afterSubmission(() => playground.run()),
                stop: () => afterSubmission(() => playground.stop()),
                compile: () => afterSubmission(() => playground.compile()),
                clearOutput: () =>
                    afterSubmission(() => playground.clearOutput()),
                setSubmissionCredentials: (credentials) =>
                    afterSubmission(() =>
                        setSubmissionCredentials(credentials),
                    ),
                setOptions: (options) =>
                    afterSubmission(() => {
                        if (
                            options.project !== undefined ||
                            options.url !== undefined
                        ) {
                            throw new Error(
                                'set-options cannot change project or url',
                            );
                        }
                        return updateEmbedOptions(options);
                    }),
            },
            getReadyPayload: () => ({
                minizincVersion: playground.getMiniZincVersion(),
            }),
        });
        embedProtocol.start();
        embedProtocol.announceReady();
    }

    onMount(() => {
        if (embedded) {
            startEmbeddedPlayground();
        } else {
            hashChange();
        }
    });
    onDestroy(() => embedProtocol?.destroy());

    function saveProject() {
        if (embedded) {
            return;
        }
        if (sessionStorage.mznPlaygroundSession && playground.hasFiles()) {
            try {
                const project = playground.getProject();

                if (
                    !(
                        sessionStorage.mznPlaygroundSession in
                        $settings.sessions
                    ) &&
                    playground.isDefaultSolver() &&
                    playground.isDefaultSolverConfig() &&
                    project.files.length === 1 &&
                    project.files[0].name === 'Playground.mzn' &&
                    project.files[0].contents === defaultModel
                ) {
                    // No need to save
                    return;
                }

                timestamp = Date.now();
                $settings.sessions[sessionStorage.mznPlaygroundSession] = {
                    ...project,
                    timestamp,
                };
            } catch (e) {
                console.error(e);
            }
        }
    }

    /** @param {string} key @param {Record<string, any>} proj */
    function openProject(key, proj) {
        saveProject();
        try {
            const toLoad = migrateProject(proj);
            sessionStorage.mznPlaygroundSession = key;
            project = toLoad;
            timestamp = proj.timestamp;
        } catch (e) {
            console.error(e);
        }
        openRecent = false;
        recentProjects = getRecentProjects(solvers, $settings);
    }

    /** @param {any} $settings */
    function forkOnExternalChange($settings) {
        if (
            timestamp !== null &&
            sessionStorage.mznPlaygroundSession in $settings.sessions &&
            $settings.sessions[sessionStorage.mznPlaygroundSession].timestamp >
                timestamp
        ) {
            sessionStorage.mznPlaygroundSession = newSession();
            recentProjects = getRecentProjects(solvers, $settings);
        }
    }
    let recentProjects = $derived(getRecentProjects(solvers, $settings));
    $effect(() => {
        if (!embedded) {
            forkOnExternalChange($settings);
        }
    });

    /** @param {string} type @param {any} payload */
    function notifyEmbed(type, payload) {
        embedProtocol?.notify(type, payload);
    }
</script>

<svelte:document
    onvisibilitychange={() => {
        if (document.hidden) {
            saveProject();
        }
    }}
/>
<svelte:window onbeforeunload={saveProject} onhashchange={hashChange} />

<div class="playground-app">
    <Playground
        bind:this={playground}
        {project}
        theme={embedOptions.theme}
        showVersionSwitcher={embedOptions.showVersionSwitcher}
        showSolverDropdown={embedOptions.showSolverDropdown}
        showShareButton={embedOptions.showShareButton}
        showDownloadButton={embedOptions.showDownloadButton}
        showExternalPlaygroundButton={embedOptions.showExternalPlaygroundButton}
        showTabs={embedOptions.showTabs}
        canEditTabs={embedOptions.canEditTabs && !submissionRunning}
        interactionLocked={submissionRunning}
        compilationEnabled={embedOptions.compilationEnabled}
        canEditSolverSettings={embedOptions.canEditSolverSettings &&
            !submissionRunning}
        enabledSolvers={embedOptions.enabledSolvers}
        canSwitchOrientation={embedOptions.canSwitchOrientation}
        hideOutputOnStartup={embedOptions.hideOutputOnStartup}
        autoFocus={embedOptions.autoFocus}
        showClearOutput={embedOptions.showClearOutput}
        showAutoClearOutput={embedOptions.showAutoClearOutput}
        showOutputSectionToggles={embedOptions.showOutputSectionToggles}
        showOutputRightControls={embedOptions.showOutputRightControls}
        showCheckerOutput={embedOptions.showCheckerOutput}
        bind:autoClearOutput={$settings.autoClearOutput}
        bind:splitterDirection={$settings.splitterDirection}
        bind:splitterSize={$settings.splitterSize}
        onsolversChanged={(payload) => {
            solvers = payload.solvers;
            notifyEmbed('solvers-changed', payload);
        }}
        onbusyChanged={({ busy }) => (playgroundBusy = busy)}
        onprojectChanged={(payload) => {
            updateAssignment(payload.project);
            notifyEmbed('project-changed', payload);
        }}
        onrunStarted={(payload) => notifyEmbed('run-started', payload)}
        onoutput={(payload) => notifyEmbed('minizinc', payload)}
        onrunFinished={(payload) => notifyEmbed('run-finished', payload)}
        onrunError={(payload) => notifyEmbed('run-error', payload)}
    >
        {#snippet navbarAfterSolverSelector({ isMobile })}
            {#if assignment}
                {#if isMobile}
                    <!-- svelte-ignore a11y_invalid_attribute -->
                    <a
                        class="navbar-item mobile-menu-item"
                        class:is-disabled={playgroundBusy ||
                            submissionRunning ||
                            submissionModalActive}
                        href="javascript:void(0);"
                        onclick={openSubmissionModal}
                    >
                        Submit to {assignment.moocName}
                    </a>
                {:else}
                    <div class="navbar-item">
                        <div class="field">
                            <div class="control">
                                <button
                                    class="button"
                                    disabled={playgroundBusy ||
                                        submissionRunning ||
                                        submissionModalActive}
                                    onclick={openSubmissionModal}
                                >
                                    Submit to {assignment.moocName}
                                </button>
                            </div>
                        </div>
                    </div>
                {/if}
            {/if}
        {/snippet}
        {#if !embedded}
            {#snippet navbarBeforeShareButtons({ isMobile })}
                {#if isMobile}
                    <!-- svelte-ignore a11y_invalid_attribute -->
                    <a
                        class="navbar-item mobile-menu-item"
                        href="javascript:void(0);"
                        onclick={() => (openRecent = true)}
                    >
                        <span class="icon">
                            <Fa icon={faClockRotateLeft} />
                        </span>
                        <span>Open recent project</span>
                    </a>
                {:else}
                    <div class="navbar-item">
                        <div class="field">
                            <div class="control">
                                <button
                                    class="button"
                                    title="Open recent project"
                                    onclick={() => (openRecent = true)}
                                >
                                    <span class="icon">
                                        <Fa icon={faClockRotateLeft} />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                {/if}
            {/snippet}
            <RecentProjectsModal
                projects={recentProjects}
                active={openRecent}
                oncancel={() => (openRecent = false)}
                onaccept={({ project }) =>
                    openProject(project.key, $settings.sessions[project.key])}
            />
        {/if}
        {#if assignment}
            <MoocSubmissionModal
                bind:this={submissionModal}
                active={submissionModalActive}
                {assignment}
                solver={submissionSolver}
                minizincVersion={playground?.getMiniZincVersion() || ''}
                projectFiles={submissionProjectFiles}
                running={submissionRunning}
                progress={submissionProgress}
                status={submissionStatus}
                onrunandsubmit={submitMooc}
                onabort={abortSubmission}
                onclose={() => (submissionModalActive = false)}
            />
        {/if}
    </Playground>
</div>

<style>
    .playground-app {
        height: 100vh;
    }
</style>
