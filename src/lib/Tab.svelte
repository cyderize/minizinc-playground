<script>
    import { createEventDispatcher, tick } from 'svelte';
    import Fa from 'svelte-fa/src/fa.svelte';
    import { faXmark } from '@fortawesome/free-solid-svg-icons';

    export let active = false;
    export let name = 'Untitled';
    export let suffix = '.mzn';

    const dispatch = createEventDispatcher();
    let isEditing = false;
    let editInput;
    let editValue = '';

    $: if (/[\/\\\.]/.test(editValue)) {
        editValue = editValue.replaceAll(/[\/\\\.]/g, '');
    }

    async function editName() {
        if (!active) {
            return;
        }
        isEditing = true;
        editValue = name;
        await tick();
        editInput.focus();
    }

    function editNameKeyPress(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            finishEditName();
        }
    }

    function finishEditName() {
        isEditing = false;
        if (editValue.length > 0) {
            dispatch('rename', { name: editValue, suffix });
        }
    }
</script>

<li class:is-active={active}>
    <!-- svelte-ignore a11y-missing-attribute -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <a
        class="filename-link"
        on:click={() => {
            if (!isEditing) dispatch('click');
        }}
    >
        {#if isEditing}
            <input
                size={editValue.length || name.length}
                bind:this={editInput}
                bind:value={editValue}
                on:blur={finishEditName}
                on:keypress={editNameKeyPress}
                placeholder={name}
            />{suffix}
        {:else}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <span class="filename" on:click={editName}>{name}{suffix}</span>
            {#if active}
                <span class="close-tab" on:click={() => dispatch('close')}>
                    <Fa icon={faXmark} />
                </span>
            {/if}
        {/if}
    </a>
</li>

<style>
    .is-active .filename {
        cursor: text;
    }

    .is-active .filename-link {
        cursor: default;
    }

    .close-tab {
        padding-left: 0.5rem;
        cursor: pointer;
    }
</style>
