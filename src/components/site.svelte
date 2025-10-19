<script lang="ts">
  import { SiteConfigs, type Site } from "$lib/sites";

  function constructUrl(url: string, params: Record<string, string>): string {
    return `${url}?${new URLSearchParams(params).toString()}`;
  }

  interface Props {
    site: Site;
    search: string | null;
    checked: boolean;
    onChecked?: (open: boolean) => void;
  }

  let { site, search, checked, onChecked }: Props = $props();

  const siteInfo = $derived(SiteConfigs[site]);

  const url = $derived.by(() => {
    return constructUrl(siteInfo.searchUrl, {
      ...siteInfo.additionalParams,
      ...(search ? { [siteInfo.searchQueryParam]: search } : {}),
    });
  });
</script>

<div class="mt-4">
  <input
    type="checkbox"
    id={site}
    onchange={(e) => {
      const checked = (e.target as HTMLInputElement).checked;
      onChecked?.(checked);
    }}
    checked={checked}
  />
  <strong>{SiteConfigs[site].name}:</strong>
  {#if search}
    <a
      class="text-blue-400 underline"
      href={url}
      target="_blank">Search for "{search}"</a
    >
  {:else}
    <span>No search term entered.</span>
  {/if}
</div>
