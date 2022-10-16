<script>
    import { EditorView } from '@codemirror/view';
    import { onMount } from 'svelte';

    export let state;

    let div;
    let view;

    onMount(() => {
        view = new EditorView({
            parent: div,
        });
        view.focus();
    });

    $: if (view && state) {
        view.setState(state);
    }

    export function getState() {
        if (view) {
            return view.state;
        }
        return null;
    }

    export function focus() {
        view.focus();
    }
</script>

<div bind:this={div} />

<style>
    div {
        height: 100%;
        overflow: auto;
    }
</style>
