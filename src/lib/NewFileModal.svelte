<script>
    import { createEventDispatcher } from 'svelte';
    import Modal from './Modal.svelte';
    const dispatch = createEventDispatcher();
</script>

<Modal title="Create new file" on:cancel={() => dispatch('cancel')}>
    <aside class="menu">
        <ul class="menu-list">
            <li>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-missing-attribute -->
                <a on:click={() => dispatch('new', { type: '.mzn' })}
                    >Model file (.mzn)</a
                >
            </li>
            <li>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-missing-attribute -->
                <a on:click={() => dispatch('new', { type: '.dzn' })}
                    >Data file (.dzn)</a
                >
            </li>
            <li>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-missing-attribute -->
                <a on:click={() => dispatch('new', { type: '.json' })}
                    >JSON data file (.json)</a
                >
            </li>
            <li>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-missing-attribute -->
                <a on:click={() => dispatch('new', { type: '.mzc.mzn' })}
                    >Solution checker model (.mzc.mzn)</a
                >
            </li>
            <li>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-missing-attribute -->
                <a on:click={() => dispatch('new', { type: '.mpc' })}
                    >Parameter configuration file (.mpc)</a
                >
            </li>
        </ul>
    </aside>
</Modal>
