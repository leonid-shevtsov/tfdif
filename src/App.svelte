<script lang="ts">
  import ClipboardJS from "clipboard";
  import { parse } from "ts-graphviz/ast";
  import Digger from "./Digger.svelte";
  import type { ResourceMap } from "./lib/buildResourceMap";
  import buildResourceMap from "./lib/buildResourceMap";

  let files: FileList;
  let resourceMap: ResourceMap;

  $: if (files && files.length > 0) {
    files[0]
      .text()
      .then((text) => (resourceMap = buildResourceMap(parse(text))));
  }

  const clipboard = new ClipboardJS(".btn-copy-resource");
</script>

<main>
  <h1>⛏️ Terraform Dig</h1>

  <h2>Step 1: generate graph:</h2>

  <pre>
    terraform graph > graph.dot
  </pre>

  <label>
    <h2>Step 2: upload your graph:</h2>
    <input type="file" placeholder="graph.dot" bind:files />
    <p><em>The file is processed in your browser only - never uploaded.</em></p>
  </label>

  <h2>Step 3: dig it!</h2>

  {#if resourceMap}
    <Digger {resourceMap} />
  {/if}

  <hr />
  <p>
    Made by <a href="https://leonid.shevtsov.me">Leonid Shevtsov</a>. Code at
    <a href="https://github.com/leonid-shevtsov/tfdig">GitHub</a>.
  </p>
</main>

<style>
  main {
    max-width: 60em;
    margin: 0 auto;
    font-family: sans-serif;
  }

  hr {
    margin-top: 10em;
  }
</style>
