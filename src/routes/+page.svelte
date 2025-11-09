<script lang="ts">
  import {
    deleteHistoryTerm,
    saveHistoryTerm,
    saveSitesToOpen,
    searchHistoryCachedProp,
    sitesToOpenCachedProp,
  } from "$lib/models/localStorageModel";
  import { SiteConfigs, Sites } from "$lib/sites";
  import type { SearchHistoryItem } from "$lib/storage";
  import { unwrapCachedProperty } from "$lib/utils/unwrapCachedProp.svelte";
  import Button from "../components/Button.svelte";
  import IconButton from "../components/IconButton.svelte";
  import Site from "../components/site.svelte";
  import TextField from "../components/TextField.svelte";
  import Icon from "@iconify/svelte";
  import { flip } from "svelte/animate";

  function constructUrl(url: string, params: Record<string, string>): string {
    return `${url}?${new URLSearchParams(params).toString()}`;
  }

  let searchInput = $state("");
  const sitesToOpen = unwrapCachedProperty(sitesToOpenCachedProp.value);
  const sitesToOpenValue = $derived(structuredClone(sitesToOpen.value));

  const searchHistoryResult = unwrapCachedProperty(
    searchHistoryCachedProp.value
  );

  function sortHistory(history: Record<string, SearchHistoryItem> | null) {
    console.log("Sorting history:", history);
    if (!history) {
      return [];
    }

    const entries = Object.entries(history).sort(
      ([_, aValue], [__, bValue]) => {
        const aLast =
          aValue.timestamps.length > 0
            ? aValue.timestamps[aValue.timestamps.length - 1]
            : undefined;
        const bLast =
          bValue.timestamps.length > 0
            ? bValue.timestamps[bValue.timestamps.length - 1]
            : undefined;

        if (aLast === undefined && bLast === undefined) {
          return 0;
        }

        // newest first
        if (aLast === undefined) {
          return 1;
        }

        if (bLast === undefined) {
          return -1;
        }

        return bLast > aLast ? 1 : -1;
      }
    );
    return entries;
  }
  const searchHistory = $derived(sortHistory(searchHistoryResult.value));

  function open(text: string) {
    saveHistoryTerm(text);

    for (const site of Sites) {
      if (!sitesToOpenValue?.has(site)) {
        continue;
      }

      const siteInfo = SiteConfigs[site];
      const url = constructUrl(siteInfo.searchUrl, {
        ...siteInfo.additionalParams,
        ...(text ? { [siteInfo.searchQueryParam]: text } : {}),
      });
      window.open(url.toString(), "_blank");
    }
  }
</script>

<div
  class="flex flex-col w-lvw h-lvh p-4 bg-gray-900 text-gray-50 overflow-hidden items-center"
>
  <h1>Stock search</h1>
  <div class="flex gap-24 relative flex-1 overflow-hidden">
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
            open(searchInput);
          }}>Open selected</Button
        >
      </div>
      {#each Sites as site (site)}
        <Site
          {site}
          search={searchInput}
          checked={sitesToOpenValue ? sitesToOpenValue.has(site) : null}
          onChecked={(checked) => {
            if (!sitesToOpenValue) {
              return;
            }

            if (checked) {
              sitesToOpenValue.add(site);
            } else {
              sitesToOpenValue.delete(site);
            }

            saveSitesToOpen(sitesToOpenValue);
          }}
        />
      {/each}
    </form>
    <div class="flex flex-col flex-1">
      <h2>Search History</h2>
      <!-- TODO: add sort type and save it to local storage -->
      <div class="flex-1 relative overflow-hidden">
        <div class="overflow-auto h-full">
          {#await searchHistory then searchHistory}
            <ul class="flex flex-col">
              {#each searchHistory as [term, info] (term)}
                <li animate:flip={{ duration: 400 }}>
                  <div class="flex gap-2 items-center">
                    <button
                      class="history-item flex flex-col items-start"
                      onclick={() => open(term)}
                    >
                      <p class="history-term">{term}</p>
                      <p class="history-count">
                        {info.timestamps.length} times
                      </p>
                    </button>

                    <IconButton
                      onclick={() => {
                        deleteHistoryTerm(term);
                      }}
                      ><Icon font-size="large" icon="mdi:delete" /></IconButton
                    >
                  </div>
                </li>
              {/each}
            </ul>
          {/await}
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  @reference "../app.css";

  .history-item {
    @apply transition-all rounded cursor-pointer p-2 w-full text-left;
    min-width: 250px;
    &:hover {
      @apply bg-gray-400/10;
    }

    .history-term {
      @apply font-bold uppercase;
    }

    .history-count {
      @apply text-sm text-gray-400;
    }
  }
</style>
