<script>
    import Editor from './lib/Editor.svelte';
    import SplitPanel from './lib/SplitPanel.svelte';
    import Tabs from './lib/Tabs.svelte';
    import Fa from 'svelte-fa/src/fa.svelte';
    import {
        faPlay,
        faStop,
        faCog,
        faShareNodes,
        faDownload,
        faClipboard,
    } from '@fortawesome/free-solid-svg-icons';
    import Modal from './lib/Modal.svelte';
    import { EditorState } from '@codemirror/state';
    import {
        MiniZincEditorExtensions,
        JSONEditorExtensions,
        ReadonlyTextExtensions,
        DataZincEditorExtensions,
    } from './lang';
    import Output from './lib/Output.svelte';
    import NewFileModal from './lib/NewFileModal.svelte';
    import ModelModal from './lib/ModelModal.svelte';
    import ParameterModal from './lib/ParameterModal.svelte';
    import SolverConfig from './lib/SolverConfig.svelte';
    import { addErrors, lineCharToPos } from './lang/underline';
    import { onMount } from 'svelte';

    let settings = { autoClearOutput: false, sessions: {} };
    try {
        const savedSettings = localStorage.getItem('mznPlayground');
        if (savedSettings && savedSettings.length > 0) {
            settings = { ...settings, ...JSON.parse(savedSettings) };
        }
    } catch (e) {
        console.error(e);
    }
    const mznExtensions = MiniZincEditorExtensions((e) => {
        checkCode(e.view);
    });
    const playground = '% Use this editor as a MiniZinc scratch book\n';

    let editor;
    let files = [];

    let currentIndex = 0;
    let solverConfig;

    let newFileRequested = false;
    let deleteFileRequested = null;

    let needsModel = false;
    let needsData = null;
    let dataFileTab = true;

    $: state = currentFile ? currentFile.state : null;
    $: canRun = isModel || isData || isFzn;
    $: canCompile = isModel || isData;

    let output = [];
    let minizinc = null;
    $: isRunning = minizinc !== null;

    $: currentFile = currentIndex < files.length ? files[currentIndex] : null;
    $: isModel =
        currentFile &&
        currentFile.name.endsWith('.mzn') &&
        !currentFile.name.endsWith('.mzc.mzn');
    $: isData =
        currentFile &&
        (currentFile.name.endsWith('.dzn') ||
            currentFile.name.endsWith('.json'));
    $: isFzn = currentFile && currentFile.name.endsWith('.fzn');

    $: modelFiles = files
        .filter((f) => f.name.endsWith('.mzn') && !f.name.endsWith('.mzc.mzn'))
        .map((f) => f.name);
    $: dataFiles = files
        .filter((f) => f.name.endsWith('.dzn') || f.name.endsWith('.json'))
        .map((f) => f.name);

    let modelModalModel = null;
    let parameterModalDataFiles = [];
    let parameterModalParameters = {};

    const solvers = [
        { name: 'Gecode', tag: 'gecode_presolver', stdFlags: ['-a', 'n'] },
        { name: 'COIN-BC', tag: 'cbc', stdFlags: ['-i', '-p', '-s', '-v'] },
    ];
    let currentSolverIndex = 0;

    let showSolverConfig = false;
    function toggleSolverConfig() {
        showSolverConfig = !showSolverConfig;
    }

    function selectTab(index) {
        if (editor) {
            if (currentIndex < files.length) {
                currentFile.state = editor.getState();
            }
            currentIndex = index;
            editor.focus();
        }
    }

    function getExtensions(suffix) {
        if (suffix === '.json' || suffix === '.mpc') {
            return JSONEditorExtensions;
        }
        if (suffix === '.mzc') {
            return ReadonlyTextExtensions;
        }
        if (suffix === '.dzn') {
            return DataZincEditorExtensions;
        }
        return mznExtensions;
    }

    function newFile(suffix) {
        let name = `Untitled${suffix}`;
        let i = 2;
        while (files.find((f) => f.name === name)) {
            name = `Untitled-${i++}${suffix}`;
        }
        files = [
            ...files,
            {
                name,
                state: EditorState.create({
                    extensions: getExtensions(suffix),
                }),
            },
        ];
        selectTab(files.length - 1);
        newFileRequested = false;
    }

    function openFiles(toOpen) {
        let toAdd = [];
        for (const file of toOpen) {
            const dot = file.name.endsWith('.mzc.mzn')
                ? file.name.length - 8
                : file.name.lastIndexOf('.');
            const stem = file.name
                .substring(0, dot)
                .replaceAll(/[\/\\\.]/g, '');
            const suffix = file.name.substring(dot);
            let name = `${stem}${suffix}`;
            let i = 2;
            while (files.find((f) => f.name === name)) {
                name = `${stem}-${i++}${suffix}`;
            }
            toAdd.push({
                name,
                state: EditorState.create({
                    doc: file.contents,
                    extensions: getExtensions(suffix),
                }),
            });
        }
        files = [...files, ...toAdd];
        selectTab(files.length - 1);
        newFileRequested = false;
    }

    function rename(e) {
        const { index, name, suffix } = e.detail;
        let dest = name;
        let i = 2;
        while (files.some((f) => f === dest + suffix)) {
            dest = `${name}-${i++}`;
        }
        currentFile.state = editor.getState();
        files = [
            ...files.slice(0, index),
            { ...files[index], name: name + suffix },
            ...files.slice(index + 1),
        ];
    }

    function closeFile(index) {
        if (files.length === 1) {
            files = [
                {
                    name: 'Untitled.mzn',
                    state: EditorState.create({
                        extensions: mznExtensions,
                    }),
                },
            ];
        } else {
            files = [...files.slice(0, index), ...files.slice(index + 1)];
        }
        if (currentIndex >= files.length) {
            selectTab(files.length - 1);
        }
        deleteFileRequested = null;
    }

    function reorder(src, dest) {
        let newFiles;
        if (src < dest) {
            newFiles = [
                ...files.slice(0, src),
                ...files.slice(src + 1, dest + 1),
                files[src],
                ...files.slice(dest + 1),
            ];
        } else {
            newFiles = [
                ...files.slice(0, dest),
                files[src],
                ...files.slice(dest, src),
                ...files.slice(src + 1),
            ];
        }
        const newIndex = newFiles.indexOf(currentFile);
        files = newFiles;
        currentIndex = newIndex;
    }

    let getModelResolve = null;
    async function getModel(addChecker) {
        currentFile.state = editor.getState();
        let modelFile = isModel ? currentFile : null;
        if (!modelFile) {
            if (modelFiles.length === 0) {
                // No models to run
                return false;
            } else if (modelFiles.length === 1) {
                // Only one model, so use it
                modelFile = files.find((f) => f.name === modelFiles[0]);
            } else {
                try {
                    const result = await new Promise((resolve, _reject) => {
                        getModelResolve = resolve;
                        needsModel = true;
                    });
                    if (!result) {
                        // Cancelled
                        return false;
                    }
                    modelFile = files.find((f) => f.name === result.modelFile);
                } finally {
                    needsModel = false;
                }
            }
        }

        const model = new window.MiniZinc.Model();
        const fileList = [modelFile.name];
        if (addChecker) {
            const modelFileName = modelFile.name.substring(
                0,
                modelFile.name.length - 4
            );
            const checker = files.find(
                (f) =>
                    f.name === `${modelFileName}.mzc` ||
                    f.name === `${modelFileName}.mzc.mzn`
            );
            if (checker) {
                fileList.push(checker.name);
            }
        }
        if (modelFile !== currentFile) {
            fileList.push(currentFile.name);
        }
        for (const file of files) {
            model.addFile(
                file.name,
                file.state.doc.toString(),
                fileList.indexOf(file.name) !== -1
            );
        }
        try {
            const { input } = await model.interface(
                solverConfig.getCompilationConfiguration(
                    solvers[currentSolverIndex].tag
                )
            );
            if (Object.keys(input).length > 0) {
                const params = {};
                for (const key in input) {
                    params[key] = parameterModalParameters[key];
                }
                parameterModalParameters = params;
                if (
                    isData &&
                    parameterModalDataFiles.indexOf(currentFile.name) === -1
                ) {
                    // Ensure the currently running file is selected
                    parameterModalDataFiles = [
                        ...parameterModalDataFiles,
                        currentFile.name,
                    ];
                }
                try {
                    const result = await new Promise((resolve, _reject) => {
                        getModelResolve = resolve;
                        needsData = true;
                    });
                    if (!result) {
                        // Cancelled
                        return false;
                    }
                    if (result.parameters) {
                        let dzn = '';
                        for (const key in result.parameters) {
                            if (result.parameters[key].trim().length > 0) {
                                dzn += `${key} = ${result.parameters[key]};\n`;
                            }
                        }
                        model.addDznString(dzn);
                        dataFileTab = false;
                        parameterModalParameters = result.parameters;
                    } else {
                        for (const file of result.dataFiles) {
                            if (fileList.indexOf(file) === -1) {
                                model.toRun.push(file);
                                fileList.push(file);
                            }
                        }
                        dataFileTab = true;
                        parameterModalDataFiles = result.dataFiles;
                    }
                } finally {
                    needsData = false;
                }
            }
        } catch (e) {
            // Ignore and just run
            console.error(e);
        }
        return { model, fileList };
    }

    async function run() {
        const mznModel = await getModel(true);
        if (!mznModel) {
            // Cancelled
            return;
        }
        const { model, fileList } = mznModel;
        const startTime = Date.now();
        if (settings.autoClearOutput) {
            output = [];
        }
        output = [
            ...output,
            {
                files: fileList,
                output: [],
            },
        ];
        minizinc = model.solve(
            solverConfig.getSolvingConfiguration(
                solvers[currentSolverIndex].tag
            ),
            false
        );
        minizinc.on('error', addOutput);
        minizinc.on('warning', addOutput);
        minizinc.on('solution', addOutput);
        minizinc.on('status', addOutput);
        minizinc.on('statistics', addOutput);
        minizinc.on('trace', addOutput);
        minizinc.on('statistics', addOutput);
        minizinc.on('comment', addOutput);
        minizinc.on('time', addOutput);
        minizinc.on('checker', addOutput);
        minizinc.on('stderr', addOutput);
        try {
            await minizinc;
            addOutput({
                type: 'exit',
                code: 0,
                runTime: Date.now() - startTime,
            });
        } catch (e) {
            addOutput({
                type: 'exit',
                code: e.code,
                runTime: Date.now() - startTime,
            });
        }
        minizinc = null;
    }

    async function compile() {
        const mznModel = await getModel(true);
        if (!mznModel) {
            // Cancelled
            return;
        }
        const { model, fileList } = mznModel;
        const name = fileList[0];
        const startTime = Date.now();
        if (settings.autoClearOutput) {
            output = [];
        }
        output = [
            ...output,
            {
                files: fileList,
                isCompile: true,
                output: [],
            },
        ];
        minizinc = model.compile(
            solverConfig.getCompilationConfiguration(
                solvers[currentSolverIndex].tag
            )
        );
        minizinc.on('error', addOutput);
        minizinc.on('warning', addOutput);
        minizinc.on('statistics', addOutput);
        minizinc.on('trace', addOutput);
        minizinc.on('statistics', addOutput);
        minizinc.on('stderr', addOutput);
        try {
            const fzn = await minizinc;
            files = [
                ...files,
                {
                    name: `${name.substring(0, name.indexOf('.'))}.fzn`,
                    state: EditorState.create({
                        extensions: mznExtensions,
                        doc: fzn,
                    }),
                },
            ];
            selectTab(files.length - 1);
            addOutput({
                type: 'exit',
                code: 0,
                runTime: Date.now() - startTime,
            });
        } catch (e) {
            addOutput({
                type: 'exit',
                code: e.code,
                runTime: Date.now() - startTime,
            });
        }
        minizinc = null;
    }

    function stop() {
        addOutput({ type: 'cancel' });
        minizinc.cancel();
    }

    async function addOutput(value) {
        output[output.length - 1].output.push(value);
        output = output; // Force update
    }

    function projectAsJson() {
        if (currentFile) {
            currentFile.state = editor.getState();
        }
        return {
            files: files.map((f) => ({
                name: f.name,
                contents: f.state.doc.toString(),
            })),
            tab: currentIndex,
            solver: currentSolverIndex,
            solverConfig: solverConfig.save(),
        };
    }

    let generatingProject = false;
    async function downloadProject() {
        generatingProject = true;
        try {
            const JSZip = (await import('jszip')).default;
            const FileSaver = (await import('file-saver')).default;
            const project = projectAsJson();
            const names = files.map((f) => f.name);
            const solverId = {
                gecode_presolver: 'org.gecode.gecode',
                cbc: 'org.minizinc.mip.coin-bc',
            }[solvers[project.solver].tag];
            const zip = new JSZip();
            for (const file of project.files) {
                zip.file(file.name, file.contents);
            }
            zip.file(
                'Project.mzp',
                JSON.stringify({
                    version: 105,
                    projectFiles: names,
                    openFiles: names,
                    openTab: project.tab,
                    selectedBuiltinConfigId: solverId,
                    selectedBuiltinConfigVersion: 'default',
                })
            );
            const blob = await zip.generateAsync({ type: 'blob' });
            FileSaver.saveAs(blob, 'Project.zip');
        } catch (e) {
            console.error(e);
        } finally {
            generatingProject = false;
        }
    }

    let currentSession;
    function newSession() {
        const MAX_SESSIONS = 5;
        if (Object.keys(settings.sessions).length >= MAX_SESSIONS) {
            const sessions = Object.keys(settings.sessions).map((key) => ({
                key,
                value: settings.sessions[key],
            }));
            sessions.sort((a, b) => b.value.timestamp - a.value.timestamp);
            settings.sessions = sessions
                .slice(0, MAX_SESSIONS - 1)
                .reduce((acc, x) => ({ ...acc, [x.key]: x.value }), {});
        }
        const genId = () =>
            String.fromCharCode.apply(
                null,
                Array(6)
                    .fill(0)
                    .map(() => 65 + Math.floor(Math.random() * 58))
            );
        let id = genId();
        while (id in settings.sessions) {
            id = genId();
        }
        return id;
    }

    function hashChange() {
        if (window.location.hash.startsWith('#project=')) {
            try {
                const json = decodeURIComponent(
                    window.location.hash.substring(9)
                );
                const result = JSON.parse(json);
                files = [];
                openFiles(result.files);
                currentIndex = result.tab;
                currentSolverIndex = result.solver;
                if (result.solverConfig) {
                    solverConfig.load(result.solverConfig);
                }
                currentSession = newSession();
                window.location.hash = `#session=${currentSession}`;
                return;
            } catch (e) {
                console.error(e);
            }
        }

        if (!window.location.hash.startsWith('#session=')) {
            // Start new session
            window.location.hash = `#session=${newSession()}`;
            return;
        }

        const id = window.location.hash.substring(9);
        if (
            id !== currentSession &&
            settings.sessions &&
            settings.sessions[id]
        ) {
            if (files.length > 0) {
                if (currentFile) {
                    currentFile.state = editor.getState();
                }
                const project = projectAsJson();
                settings.sessions[currentSession] = project;
            }
            try {
                files = [];
                openFiles(settings.sessions[id].files);
                currentIndex = settings.sessions[id].tab;
                currentSolverIndex = settings.sessions[id].solver;
                if (settings.sessions[id].solverConfig) {
                    solverConfig.load(settings.sessions[id].solverConfig);
                }
                currentSession = id;
            } catch (e) {
                console.error(e);
            }
        }

        if (files.length === 0) {
            files = [
                {
                    name: 'Playground.mzn',
                    state: EditorState.create({
                        extensions: mznExtensions,
                        doc: playground,
                        selection: { anchor: playground.length },
                    }),
                },
            ];
        }
        currentSession = id;
    }

    onMount(() => hashChange());

    function beforeUnload() {
        if (currentFile) {
            currentFile.state = editor.getState();
        }
        const project = projectAsJson();
        settings.sessions[currentSession] = {
            ...project,
            timestamp: Date.now(),
        };
        localStorage.setItem('mznPlayground', JSON.stringify(settings));
    }

    let shareUrlInput;
    let shareUrl = null;
    let copiedShareUrl = false;
    function getShareUrl() {
        const project = projectAsJson();
        const url = new URL(window.location.href);
        url.hash = `#project=${encodeURIComponent(JSON.stringify(project))}`;
        copiedShareUrl = false;
        return url.toString();
    }

    function copyShareUrl() {
        shareUrlInput.select();
        shareUrlInput.setSelectionRange(0, shareUrl.length);
        navigator.clipboard.writeText(shareUrl);
        copiedShareUrl = true;
    }

    let prevText = null;
    async function checkCode(view) {
        if (!currentFile || !currentFile.name.endsWith('.mzn')) {
            return;
        }
        try {
            const text = view.state.doc.toString();
            if (text === prevText) {
                return;
            }
            prevText = text;
            const model = new window.MiniZinc.Model();
            for (const file of files) {
                model.addFile(file.name, file.state.doc.toString(), false);
            }
            const name = model.addString(text);
            const errors = await model.check(
                solverConfig.getCompilationConfiguration(
                    solvers[currentSolverIndex].tag
                )
            );
            addErrors(
                text,
                errors.filter((e) => e.location.filename === name),
                view
            );
        } catch (e) {
            console.error(e);
        }
    }

    function gotoLocation(loc) {
        const i = files.findIndex((f) => f.name === loc.filename);
        if (i !== -1) {
            selectTab(i);
            const text = files[i].state.doc.toString();
            const pos = lineCharToPos(loc.firstLine, loc.firstColumn, text);
            editor.focus();
            editor.setCursor(pos);
        }
    }
</script>

<svelte:window on:beforeunload={beforeUnload} on:hashchange={hashChange} />

<div class="stack">
    <div class="top">
        <nav class="navbar">
            <div class="navbar-menu is-active">
                <div class="navbar-start">
                    <div class="navbar-item">
                        <div class="field has-addons">
                            <div class="control">
                                {#if isRunning}
                                    <button
                                        class="button is-danger"
                                        title="Cancel solving"
                                        on:click={stop}
                                    >
                                        <span>Stop</span>
                                        <span class="icon">
                                            <Fa icon={faStop} />
                                        </span>
                                    </button>
                                {:else}
                                    <button
                                        class="button is-primary"
                                        title="Run the current file"
                                        on:click={run}
                                        disabled={!canRun}
                                    >
                                        <span>Run</span>
                                        <span class="icon">
                                            <Fa icon={faPlay} />
                                        </span>
                                    </button>
                                {/if}
                            </div>
                            <div class="control">
                                <button
                                    class="button"
                                    title="Compile the current file and show the resultant FlatZinc"
                                    on:click={compile}
                                    disabled={isRunning || !canCompile}
                                >
                                    <span>Compile</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="navbar-item">
                        <div class="field has-addons">
                            <div class="control">
                                <button class="button is-static">
                                    Solver:
                                </button>
                            </div>
                            <div class="control is-expanded">
                                <div class="select is-fullwidth">
                                    <select bind:value={currentSolverIndex}>
                                        {#each solvers as solver, i}
                                            <option value={i}>
                                                {solver.name}
                                            </option>
                                        {/each}
                                    </select>
                                </div>
                            </div>

                            <div class="control">
                                <button
                                    class="button is-primary"
                                    on:click={toggleSolverConfig}
                                >
                                    <span class="icon">
                                        <Fa icon={faCog} />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="navbar-end">
                    <div class="navbar-item">
                        <div class="field has-addons">
                            <div class="control">
                                <button
                                    class="button is-primary"
                                    title="Share"
                                    on:click={() => (shareUrl = getShareUrl())}
                                >
                                    <span class="icon">
                                        <Fa icon={faShareNodes} />
                                    </span>
                                </button>
                            </div>
                            <div class="control">
                                <button
                                    class="button"
                                    title="Download project"
                                    on:click={() => downloadProject()}
                                    disabled={generatingProject}
                                >
                                    <span class="icon">
                                        <Fa icon={faDownload} />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </div>
    <div class="grow main-panel">
        <div class="left">
            <SplitPanel direction="vertical" split={75}>
                <div class="panel stack" slot="panelA">
                    <div class="top">
                        <Tabs
                            files={files.map((f) => f.name)}
                            {currentIndex}
                            on:selectTab={(e) => selectTab(e.detail.index)}
                            on:reorder={(e) =>
                                reorder(e.detail.src, e.detail.dest)}
                            on:newFile={() => (newFileRequested = true)}
                            on:rename={rename}
                            on:close={(e) =>
                                (deleteFileRequested = e.detail.index)}
                        />
                    </div>
                    <div class="grow">
                        {#if state}
                            <Editor {state} bind:this={editor} />
                        {/if}
                    </div>
                </div>
                <div class="panel" slot="panelB">
                    <Output
                        {output}
                        on:clear={() => (output = [])}
                        on:goto={(e) => gotoLocation(e.detail.location)}
                        bind:autoClearOutput={settings.autoClearOutput}
                    />
                </div>
            </SplitPanel>
        </div>
        <SolverConfig
            active={showSolverConfig}
            bind:this={solverConfig}
            stdFlags={solvers[currentSolverIndex].stdFlags}
            on:close={() => (showSolverConfig = false)}
        />
    </div>
</div>

<NewFileModal
    active={newFileRequested}
    on:cancel={() => (newFileRequested = false)}
    on:new={(e) => newFile(e.detail.type)}
    on:open={(e) => openFiles(e.detail.files)}
/>

<Modal
    active={deleteFileRequested !== null}
    title="Delete file"
    on:cancel={() => (deleteFileRequested = null)}
>
    <p>
        Are you sure you wish to delete <code
            >{files[deleteFileRequested].name}</code
        >?
    </p>
    <p>This cannot be undone.</p>
    <div slot="footer">
        <button
            class="button is-danger"
            on:click={() => closeFile(deleteFileRequested)}
        >
            Delete
        </button>
        <button class="button" on:click={() => (deleteFileRequested = null)}
            >Cancel</button
        >
    </div>
</Modal>

<ModelModal
    active={needsModel}
    {modelFiles}
    selectedModelFile={modelModalModel}
    on:accept={(e) => getModelResolve(e.detail)}
    on:cancel={() => getModelResolve(false)}
/>

<ParameterModal
    active={needsData}
    {dataFiles}
    selectedDataFiles={parameterModalDataFiles}
    dataTab={dataFileTab}
    parameters={parameterModalParameters}
    on:accept={(e) => getModelResolve(e.detail)}
    on:cancel={() => getModelResolve(false)}
/>

<Modal
    active={shareUrl}
    title="Share this project"
    on:cancel={() => (shareUrl = null)}
>
    <div class="field has-addons">
        <p class="control is-expanded">
            <input
                bind:this={shareUrlInput}
                class="input"
                type="text"
                value={shareUrl}
                on:click={() => shareUrlInput.select()}
                readonly
            />
        </p>
        <p class="control">
            <button
                class="button"
                class:is-primary={!copiedShareUrl}
                class:is-success={copiedShareUrl}
                on:click={copyShareUrl}
            >
                <span class="icon"><Fa icon={faClipboard} /></span>
            </button>
        </p>
    </div>
    <div slot="footer">
        <button class="button is-primary" on:click={() => (shareUrl = null)}>
            Done
        </button>
    </div>
</Modal>

<style>
    .stack {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .stack > .grow {
        flex: 1 1 auto;
        overflow: hidden;
    }
    .main-panel {
        display: flex;
    }
    .main-panel > * {
        height: 100%;
        overflow: hidden;
    }
    .main-panel > .left {
        flex: 1 1 auto;
    }
    .stack > .top {
        flex: 0 0 auto;
    }
    .panel {
        height: 100%;
    }
</style>
