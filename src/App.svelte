<script>
    import Editor from './lib/Editor.svelte';
    import SplitPanel from './lib/SplitPanel.svelte';
    import Tabs from './lib/Tabs.svelte';
    import Fa from 'svelte-fa/src/fa.svelte';
    import { faPlay } from '@fortawesome/free-solid-svg-icons';
    import Modal from './lib/Modal.svelte';
    import { EditorState } from '@codemirror/state';
    import { MiniZincEditorExtensions as extensions } from './lang';

    const playground = '% Use this editor as a MiniZinc scratch book\n';

    let editor;
    let files = [
        {
            name: 'Playground.mzn',
            state: EditorState.create({
                extensions,
                doc: playground,
                selection: { anchor: playground.length },
            }),
        },
    ];
    let currentIndex = 0;

    let newFileRequested = false;
    let deleteFileRequested = null;

    $: state = files[currentIndex].state;

    function selectTab(index) {
        if (editor) {
            if (currentIndex < files.length) {
                files[currentIndex].state = editor.getState();
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
                state: EditorState.create({ extensions }),
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
</script>

<div class="stack">
    <div class="top">
        <nav class="navbar">
            <div class="navbar-menu">
                <div class="navbar-start">
                    <div class="navbar-item">
                        <div class="buttons">
                            <button
                                class="button is-primary"
                                title="Run the current file"
                            >
                                <span>Run</span>
                                <span class="icon">
                                    <Fa icon={faPlay} />
                                </span>
                            </button>
                            <button
                                class="button"
                                title="Compile the current file and show the resultant FlatZinc"
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
            <div class="panel" slot="panelB" />
        </SplitPanel>
    </div>
</div>

{#if newFileRequested}
    <Modal
        title="Create new file"
        isActive={newFileRequested}
        on:cancel={() => (newFileRequested = false)}
    >
        <aside class="menu">
            <ul class="menu-list">
                <li>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <a on:click={() => newFile('.mzn')}>Model file (.mzn)</a>
                </li>
                <li>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <a on:click={() => newFile('.dzn')}>Data file (.dzn)</a>
                </li>
                <li>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <a on:click={() => newFile('.json')}
                        >JSON data file (.json)</a
                    >
                </li>
                <li>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <a on:click={() => newFile('.mzc.mzn')}
                        >Solution checker model (.mzc.mzn)</a
                    >
                </li>
                <li>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <a on:click={() => newFile('.mpc')}
                        >Parameter configuration file (.mpc)</a
                    >
                </li>
            </ul>
        </aside>
    </Modal>
{/if}

{#if deleteFileRequested !== null}
    <Modal
        title="Delete file"
        isActive={deleteFileRequested !== null}
        on:cancel={() => (deleteFileRequested = null)}
    >
        <p>
            Are you sure you wish to delete <code>{files[deleteFileRequested].name}</code>?
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
