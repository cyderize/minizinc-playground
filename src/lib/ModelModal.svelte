<script>
    import { createEventDispatcher } from 'svelte';
    import Modal from './Modal.svelte';
    const dispatch = createEventDispatcher();

    export let modelFiles;
    export let selectedModelFile = null;
    let selectedModel = null;

    $: init(selectedModelFile);
    function init(selectedModelFile) {
        selectedModel =
            selectedModelFile || (modelFiles.length > 0 ? modelFiles[0] : null);
    }

    function accept() {
        dispatch('accept', { modelFile: selectedModel });
    }
</script>

<Modal title="Select model to run" on:cancel={() => dispatch('cancel')}>
    <div class="select">
        <select bind:value={selectedModel}>
            {#each modelFiles as modelFile}
                <option value={modelFile}>{modelFile}</option>
            {/each}
        </select>
    </div>
    <div slot="footer">
        <button class="button is-primary" on:click={accept}> OK </button>
        <button class="button" on:click={() => dispatch('cancel')}>
            Cancel
        </button>
    </div>
</Modal>

<style>
    .select,
    select {
        width: 100%;
    }
</style>
