<script>
    import { faMapSigns } from '@fortawesome/free-solid-svg-icons';
    import { tick } from 'svelte';

    export let output;
    let outputElement;

    $: update(output);

    const statusMap = {
        ALL_SOLUTIONS: '==========',
        OPTIMAL_SOLUTION: '==========',
        UNSATISFIABLE: '=====UNSATISFIABLE=====',
        UNSAT_OR_UNBOUNDED: '=====UNSATorUNBOUNDED=====',
        UNBOUNDED: '=====UNBOUNDED=====',
        UNKNOWN: '=====UNKNOWN=====',
        ERROR: '=====ERROR=====',
    };

    async function update(o) {
        if (!outputElement) {
            return;
        }
        await tick();
        outputElement.scrollTo(0, outputElement.scrollHeight);
    }

    function formatRuntime(time) {
        const hours = Math.floor(time / 3600000);
        const minutes = Math.floor((time % 3600000) / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        const msec = Math.floor(time % 1000);
        let elapsed = '';
        if (hours > 0) {
            elapsed += `${hours}h `;
        }
        if (hours > 0 || minutes > 0) {
            elapsed += `${minutes}m `;
        }
        if (hours > 0 || minutes > 0 || seconds > 0) {
            elapsed += `${seconds}s `;
        }
        if (hours == 0 && minutes == 0) {
            if (seconds > 0) {
                elapsed += ' ';
            }
            elapsed += `${msec}msec`;
        }
        return elapsed.trimEnd();
    }
</script>

<div class="output-window">
    {#each output as run}
        <details open>
            <summary>
                {#if run.isCompile}
                    Compiling
                {:else}
                    Running
                {/if}
                {run.files.join(', ')}
            </summary>
            <div class="messages">
                {#each run.output as msg}
                    {#if msg.type === 'solution'}
                        {#each msg.sections as section}
                            {#if section !== 'raw'}
                                <pre>{msg.output[section]}</pre>
                            {/if}
                        {/each}
                        <pre>----------</pre>
                        <br />
                    {:else if msg.type === 'statistics'}
                        {#each Object.keys(msg.statistics) as stat}
                            <pre><span class="mzn-stat">%%%mzn-stat:</span
                                > {stat}={msg.statistics[stat]}</pre>
                            <br />
                        {/each}
                        <pre><span class="mzn-stat">%%%mzn-stat-end</span></pre>
                        <br />
                    {:else if msg.type === 'cancel'}
                        <pre class="mzn-runtime">Stopped.</pre>
                        <br />
                    {:else if msg.type === 'exit'}
                        {#if msg.code}
                            <pre
                                class="mzn-error">Process finished with non-zero exit code {msg.code}.</pre>
                            <br />
                        {/if}
                        <pre class="mzn-runtime">Finished in {formatRuntime(
                                msg.runTime
                            )}.</pre>
                    {/if}
                {/each}
            </div>
        </details>
    {/each}
</div>

<style>
    .output-window {
        height: 100%;
        overflow: auto;
        padding: 0.5rem;
    }

    details {
        margin-bottom: 0.5rem;
    }

    .messages {
        padding-left: 0.5rem;
        line-height: 1.25;
    }

    pre {
        padding: 0;
        background: none;
        display: inline;
    }

    .mzn-stat,
    .mzn-runtime {
        color: blue;
    }

    .mzn-error {
        color: red;
    }
</style>
