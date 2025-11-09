<script lang="ts">
  import { browser } from "$app/environment";
  import { SiteConfigs, Sites, Site as SiteEnum } from "$lib/sites";
  import { loadFromStorage, saveToStorage } from "$lib/storage";
  import Button from "../components/Button.svelte";
  import IconButton from "../components/IconButton.svelte";
  import Site from "../components/site.svelte";
  import TextField from "../components/TextField.svelte";
  import Icon from "@iconify/svelte";

  function constructUrl(url: string, params: Record<string, string>): string {
    return `${url}?${new URLSearchParams(params).toString()}`;
  }

  let searchInput = $state("");
  let search = $state<string | null>(null);
  let sitesToOpen = $state<Set<SiteEnum> | null>(
    browser ? new Set(loadFromStorage("sites") ?? Sites) : null
  );
</script>

<div class="w-lvw h-lvh p-2 bg-gray-900 text-gray-50">
  <h1>Stock search</h1>
  <form
    onsubmit={(e) => {
      e.preventDefault();
    }}
  >
    <div class="flex row gap-2">
      {#snippet clearButton()}
        <IconButton
          style="z-index: 10;"
          disabled={searchInput.trim() === ""}
          type="reset"
          onclick={() => {
            searchInput = "";
          }}><Icon icon="mdi:close" /></IconButton
        >
      {/snippet}
      <TextField
        class="input"
        type="text"
        value={searchInput}
        oninput={(e) => {
          if (!(e.target instanceof HTMLInputElement)) {
            return;
          }

          searchInput = e.target.value;
        }}
        placeholder="mozzarella"
        endAdornment={clearButton}
      />
      <Button
        type="submit"
        disabled={searchInput.trim() === ""}
        onclick={() => {
          search = searchInput;
          for (const site of Sites) {
            if (!sitesToOpen?.has(site)) {
              continue;
            }

            const siteInfo = SiteConfigs[site];
            const url = constructUrl(siteInfo.searchUrl, {
              ...siteInfo.additionalParams,
              ...(search ? { [siteInfo.searchQueryParam]: search } : {}),
            });
            window.open(url.toString(), "_blank");
          }
        }}>Open selected</Button
      >
    </div>
    {#each Sites as site (site)}
      <Site
        {site}
        search={searchInput}
        checked={sitesToOpen ? sitesToOpen.has(site) : null}
        onChecked={(checked) => {
          if (!sitesToOpen) {
            return;
          }

          if (checked) {
            sitesToOpen.add(site);
          } else {
            sitesToOpen.delete(site);
          }

          saveToStorage("sites", [...sitesToOpen]);
        }}
      />
    {/each}
  </form>
</div>
