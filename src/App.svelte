<script>
    import Editor from './lib/Editor.svelte';
    import SplitPanel from './lib/SplitPanel.svelte';
    import Tabs from './lib/Tabs.svelte';
    import Fa from 'svelte-fa/src/fa.svelte';
    import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
    import Modal from './lib/Modal.svelte';
    import { EditorState } from '@codemirror/state';
    import { MiniZincEditorExtensions, JSONEditorExtensions } from './lang';
    import Output from './lib/Output.svelte';
    import NewFileModal from './lib/NewFileModal.svelte';
    import ModelModal from './lib/ModelModal.svelte';
    import ParameterModal from './lib/ParameterModal.svelte';

    const playground = '% Use this editor as a MiniZinc scratch book\n';

    let editor;
    let files = [
        {
            name: 'Playground.mzn',
            state: EditorState.create({
                extensions: MiniZincEditorExtensions,
                doc: playground,
                selection: { anchor: playground.length },
            }),
        },
    ];
    let currentIndex = 0;

    let newFileRequested = false;
    let deleteFileRequested = null;

    let needsModel = false;
    let needsData = null;
    let dataFileTab = true;

    $: state = currentFile.state;
    $: canRun = isModel || isData || isFzn;
    $: canCompile = isModel || isData;

    let output = [];
    let minizinc = null;
    $: isRunning = minizinc !== null;

    $: currentFile = files[currentIndex];
    $: isModel =
        currentFile.name.endsWith('.mzn') &&
        !currentFile.name.endsWith('.mzc.mzn');
    $: isData =
        currentFile.name.endsWith('.dzn') || currentFile.name.endsWith('.json');
    $: isFzn = currentFile.name.endsWith('.fzn');

    $: modelFiles = files
        .filter((f) => f.name.endsWith('.mzn') && !f.name.endsWith('.mzc.mzn'))
        .map((f) => f.name);
    $: dataFiles = files
        .filter((f) => f.name.endsWith('.dzn') || f.name.endsWith('.json'))
        .map((f) => f.name);

    let modelModalModel = null;
    let parameterModalDataFiles = [];
    let parameterModalParameters = {};

    const options = { solver: 'gecode_presolver' };

    function selectTab(index) {
        if (editor) {
            if (currentIndex < files.length) {
                currentFile.state = editor.getState();
            }
            currentIndex = index;
            editor.focus();
        }
    }

    function newFile(suffix) {
        let name = `Untitled${suffix}`;
        if (files.find((f) => f.name === name)) {
            let i = 2;
            while (files.find((f) => f.name === `Untitled-${i}${suffix}`)) {
                i++;
            }
            name = `Untitled-${i}${suffix}`;
        }
        files = [
            ...files,
            {
                name,
                state: EditorState.create({
                    extensions:
                        name.endsWith('.json') || name.endsWith('.mpc')
                            ? JSONEditorExtensions
                            : MiniZincEditorExtensions,
                }),
            },
        ];
        selectTab(files.length - 1);
        newFileRequested = false;
    }

    function rename(e) {
        const { index, name, suffix } = e.detail;
        if (files.some((f, i) => i !== index && f === name + suffix)) {
            return;
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
            files = [{ name: 'Untitled.mzn', state: EditorState.create() }];
        } else {
            files = [...files.slice(0, index), ...files.slice(index + 1)];
        }
        if (currentIndex >= files.length) {
            selectTab(files.length - 1);
        }
        deleteFileRequested = null;
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
        const modelFileName = modelFile.name.substring(
            0,
            modelFile.name.length - 4
        );

        const model = new window.MiniZinc.Model();
        model.toRun.push(modelFile.name); // Ensure this is first

        for (const file of files) {
            const use =
                file === modelFile ||
                file === currentFile ||
                (addChecker
                    ? file.name === `${modelFileName}.mzc` ||
                      file.name === `${modelFileName}.mzc.mzn`
                    : false);
            model.addFile(file.name, file.state.doc.sliceString(0), use);
        }
        try {
            const { input } = await model.interface(options);
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
                            if (model.toRun.indexOf(file) === -1) {
                                model.toRun.push(file);
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
        return model;
    }

    async function run() {
        const model = await getModel(true);
        if (!model) {
            return;
        }
        const startTime = Date.now();
        output = [
            ...output,
            {
                files: [...model.toRun],
                output: [],
            },
        ];
        minizinc = model.solve(options, false);
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
        const model = await getModel(false);
        if (!model) {
            return;
        }
        const name = model.toRun.find((f) => f.endsWith('.mzn'));
        const startTime = Date.now();
        output = [
            ...output,
            {
                files: [...model.toRun],
                isCompile: true,
                output: [],
            },
        ];
        minizinc = model.compile(options);
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
                        extensions: MiniZincEditorExtensions,
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
</script>

<div class="stack">
    <div class="top">
        <nav class="navbar">
            <div class="navbar-menu">
                <div class="navbar-start">
                    <div class="navbar-item">
                        <div class="buttons">
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

                <div class="navbar-end">
                    <div class="navbar-item">
                        <div class="buttons">
                            <button class="button is-primary">Share</button>
                            <button class="button">Download project</button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </div>
    <div class="grow">
        <SplitPanel direction="vertical" split={75}>
            <div class="panel stack" slot="panelA">
                <div class="top">
                    <Tabs
                        files={files.map((f) => f.name)}
                        {currentIndex}
                        on:selectTab={(e) => selectTab(e.detail.index)}
                        on:newFile={() => (newFileRequested = true)}
                        on:rename={rename}
                        on:close={(e) => (deleteFileRequested = e.detail.index)}
                    />
                </div>
                <div class="grow">
                    <Editor {state} bind:this={editor} />
                </div>
            </div>
            <div class="panel" slot="panelB">
                <Output {output} />
            </div>
        </SplitPanel>
    </div>
</div>

{#if newFileRequested}
    <NewFileModal
        on:cancel={() => (newFileRequested = false)}
        on:new={(e) => newFile(e.detail.type)}
    />
{/if}

{#if deleteFileRequested !== null}
    <Modal title="Delete file" on:cancel={() => (deleteFileRequested = null)}>
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
{/if}

{#if needsModel}
    <ModelModal
        {modelFiles}
        selectedModelFile={modelModalModel}
        on:accept={(e) => getModelResolve(e.detail)}
        on:cancel={() => getModelResolve(false)}
    />
{/if}

{#if needsData}
    <ParameterModal
        {dataFiles}
        selectedDataFiles={parameterModalDataFiles}
        dataTab={dataFileTab}
        parameters={parameterModalParameters}
        on:accept={(e) => getModelResolve(e.detail)}
        on:cancel={() => getModelResolve(false)}
    />
{/if}

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
    .stack > .top {
        flex: 0 0 auto;
    }
    .panel {
        height: 100%;
    }
</style>
