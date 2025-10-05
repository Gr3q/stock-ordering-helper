<script lang="ts">
  import { SiteConfigs, type Site } from "$lib/sites";

  function constructUrl(url: string, params: Record<string, string>): string {
    return `${url}?${new URLSearchParams(params).toString()}`;
  }

  interface Props {
    site: Site;
    search: string | null;
  }

  let { site, search }: Props = $props();

  const siteInfo = $derived(SiteConfigs[site]);

  const url = $derived.by(() => {
    return constructUrl(siteInfo.searchUrl, {
      ...siteInfo.additionalParams,
      ...(search ? { [siteInfo.searchQueryParam]: search } : {}),
    });
  });
</script>

{#if search}
  <iframe
    style:background="white"
    class="frame"
    src={url.toString()}
    title={siteInfo.name}
  ></iframe>
{/if}

<style lang="scss">
  .frame {
    width: 100%;
    height: 100%;
  }
</style>
