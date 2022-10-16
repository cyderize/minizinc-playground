<script>
    import { createEventDispatcher } from 'svelte';

    export let title;
    export let isActive = false;
    const dispatch = createEventDispatcher();

    function cancel() {
        dispatch('cancel');
    }
</script>

<div class="modal" class:is-active={isActive}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="modal-background" on:click={cancel} />
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">{title}</p>
            <button class="delete" aria-label="close" on:click={cancel} />
        </header>
        <section class="modal-card-body">
            <slot />
        </section>
        <footer class="modal-card-foot">
            <slot name="footer">
                <button class="button" on:click={cancel}>Cancel</button>
            </slot>
        </footer>
    </div>
</div>
