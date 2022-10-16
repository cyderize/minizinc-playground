<script>
    import { createEventDispatcher } from 'svelte';
    import Tab from './Tab.svelte';
    import Fa from 'svelte-fa/src/fa.svelte';
    import { faPlus } from '@fortawesome/free-solid-svg-icons';

    export let files = ['Playground.mzn'];
    export let currentIndex = 0;
    export let canAddFiles = true;

    const dispatch = createEventDispatcher();

    function onClick(index) {
        dispatch('selectTab', { index });
    }

    function onRename(event, index) {
        dispatch('rename', {
            index,
            ...event.detail,
        });
    }

    function onClose(index) {
        dispatch('close', { index });
    }

    $: names = files.map((f) => f.substring(0, f.indexOf('.')));
    $: suffixes = files.map((f) => f.substring(f.indexOf('.')));
</script>

<div class="tabs is-boxed">
    <ul>
        {#each files as file, i}
            <Tab
                name={names[i]}
                suffix={suffixes[i]}
                active={currentIndex === i}
                on:click={() => onClick(i)}
                on:rename={(e) => onRename(e, i)}
                on:close={(e) => onClose(i)}
            />
        {/each}

        {#if canAddFiles}
            <li>
                <!-- svelte-ignore a11y-missing-attribute -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <a title="Add new file" on:click={() => dispatch('newFile')}>
                    <span class="icon add-icon">
                        <Fa icon={faPlus} />
                    </span>
                </a>
            </li>
        {/if}
    </ul>
</div>

<style>
    .tabs {
        margin-bottom: 0;
    }
    .add-icon {
        margin: 0 !important;
    }
</style>
