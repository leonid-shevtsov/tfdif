<script lang="ts">
  import Relative from "./Relative.svelte";
  import { type ResourceMap } from "./lib/buildResourceMap";
  import { prettyID } from "./lib/cleanID";

  export let resourceMap: ResourceMap;
  export let selectedNode: string;
  let throughMode: boolean = false;
</script>

<h3>{prettyID(selectedNode)}</h3>

<button on:click={() => (selectedNode = "")}>Reset</button>
<label
  ><input type="checkbox" bind:checked={throughMode} /> Ignore intermediary resources
  (var, locals, outputs, modules)</label
>

<h4>Dependencies</h4>

{#if resourceMap.map[selectedNode].dependencies}
  <ul>
    {#each resourceMap.map[selectedNode].dependencies as dep}
      <Relative
        {resourceMap}
        bind:selectedNode
        {dep}
        direction="dependencies"
        {throughMode}
      />
    {/each}
  </ul>
{:else}
  <p>No dependencies</p>
{/if}

<h4>Dependents</h4>

{#if resourceMap.map[selectedNode].dependents}
  <ul>
    {#each resourceMap.map[selectedNode].dependents as dep}
      <Relative
        {resourceMap}
        bind:selectedNode
        {dep}
        direction="dependents"
        {throughMode}
      />
    {/each}
  </ul>
{:else}
  <p>No dependents</p>
{/if}
