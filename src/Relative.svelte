<script lang="ts">
  import {
    throughRegexp,
    type ResourceMap,
    moduleRegexp,
  } from "./lib/buildResourceMap";
  import { prettyID } from "./lib/cleanID";
  import grepString from "./lib/grepString";

  export let throughMode: boolean;
  export let resourceMap: ResourceMap;
  export let selectedNode: string;
  export let dep: string;
  export let direction: "dependencies" | "dependents";

  let isThrough = throughRegexp.test(dep);
  let isModule = moduleRegexp.test(dep);
</script>

{#if throughMode && isThrough && resourceMap.map[dep][direction].length > 0}
  {#each resourceMap.map[dep][direction] as nestedDep}
    <svelte:self
      {resourceMap}
      {throughMode}
      bind:selectedNode
      dep={nestedDep}
      {direction}
    />
  {/each}
{:else if !throughMode || !isModule}
  <li>
    <button class="nodeLink" on:click={() => (selectedNode = dep)}
      >{prettyID(dep)}</button
    >

    {#if !isThrough}
      <button
        class="nodeLink btn-copy-resource"
        data-clipboard-text={grepString(dep)}>📋</button
      >
    {/if}
  </li>
{/if}
