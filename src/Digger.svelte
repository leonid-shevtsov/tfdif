<script lang="ts">
  import NodeRelatives from "./NodeRelatives.svelte";
  import { type ResourceMap } from "./lib/buildResourceMap";
  import { prettyID } from "./lib/cleanID";

  export let resourceMap: ResourceMap;

  let filter: string = "";
  let useRegexp: boolean = false;

  let matchingResources: string[];

  $: if (filter.length > 2) {
    if (useRegexp) {
      const filterRegex = new RegExp(filter);
      matchingResources = resourceMap.resources.filter((r) =>
        filterRegex.test(r)
      );
    } else {
      matchingResources = resourceMap.resources.filter(
        (r) => r.indexOf(filter) >= 0
      );
    }
  } else {
    matchingResources = resourceMap.resources;
  }

  let selectedNode: string;
</script>

{#if selectedNode}
  <NodeRelatives {resourceMap} bind:selectedNode />
{:else}
  <input
    class="filter"
    type="text"
    bind:value={filter}
    placeholder="Find resource with regex..."
  />

  <label><input type="checkbox" bind:value={useRegexp} /> Use regexp</label>

  {#if filter.length > 2}
    <p>Matching: {matchingResources.length} / {resourceMap.resources.length}</p>
  {:else}
    <p>Total resources: {resourceMap.resources.length}</p>
  {/if}

  <ul>
    {#each matchingResources as r}
      <li>
        <button class="nodeLink" on:click={() => (selectedNode = r)}
          >{prettyID(r)}</button
        >
      </li>
    {/each}
  </ul>
{/if}

<style>
  input.filter {
    width: 40em;
  }

  :global(button.nodeLink) {
    background: none !important;
    border: none;
    padding: 0 !important;
    /*optional*/
    font-family: inherit;
    font-size: 1em;
    color: blue;
    text-decoration: none;
    cursor: pointer;
  }
</style>
