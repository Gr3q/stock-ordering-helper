<script lang="ts">
  import { SiteConfigs, Sites } from "$lib/sites";
  import Site from "../components/site.svelte";

  let searchInput = $state("mozzarella");
  let search = $state<string | null>(null);

  $effect(() => console.log(searchInput, search))
</script>

<div class="w-lvw h-lvh">
  <div class="flex row">
    <input
      type="text"
      value={searchInput}
      oninput={(e) => {
        if (!(e.target instanceof HTMLInputElement)) {
          return;
        }

        searchInput = e.target.value;
      }}
      placeholder="mozzarella"
    />
    <button
      onclick={() => {
        search = searchInput;
      }}>Search</button
    >
  </div>

  <div class="grid grid-cols-2 w-full h-full">
      {#each Sites as site (site)}
        <Site {search} {site} />
      {/each}
  </div>
</div>
