<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLInputAttributes } from "svelte/elements";

  interface Props {
    ref?: HTMLInputElement | null;
    variant?: "outlined";
    startAdornment?: Snippet;
    endAdornment?: Snippet;
  }

  let {
    ref = $bindable(),
    variant = "outlined",
    title,
    class: className = "",
    style,
    type = "text",
    startAdornment,
    endAdornment,
    ...rest
  }: Props & HTMLInputAttributes = $props();

  let startAdornmentWidth = $state(0);
  let endAdornmentWidth = $state(0);
  let titleWidth = $state(0);
</script>

<div class="containter">
  <div class="relative">
    {#if startAdornment}
      <div bind:clientWidth={startAdornmentWidth} class="startAdornment">
        {@render startAdornment()}
      </div>
    {/if}
    {#if endAdornment}
      <div bind:clientWidth={endAdornmentWidth} class="endAdornment">
        {@render endAdornment()}
      </div>
    {/if}
    <input
      {title}
      bind:this={ref}
      {type}
      {...rest}
      class="
                {variant}
                {className}
            "
      style="
                --startAdornmentWidth: {startAdornmentWidth}px;
                --titleWidth: {titleWidth}px;
                --endAdornmentWidth: {endAdornmentWidth}px;
                {style}
            "
    />
    {#if title}
      <p bind:clientWidth={titleWidth} class="title">
        {title}
      </p>
    {/if}
  </div>
</div>

<style lang="postcss">
  @reference "../app.css";

  :root {
    --adornment-inset: 10px;
  }

  input {
    @apply border-1 border-transparent rounded-sm transition-colors p-2 py-3;

    padding-left: calc(var(--startAdornmentWidth) + 10px + 5px);
    padding-right: calc(var(--endAdornmentWidth) + 10px + 5px);
    clip-path: polygon(
      0 0,
      10px 0,
      10px 1px,
      calc(10px + var(--titleWidth)) 1px,
      calc(10px + var(--titleWidth)) 0px,
      100% 0px,
      100% 100%,
      0 100%
    );

    &.outlined {
      @apply border-white/20;
      &:focus {
        /* @apply border-primary-light; */
        outline: none;
      }
    }
  }

  .title {
    @apply absolute top-0 text-xs px-2 font-normal;
    margin-top: calc(var(--text-xs) * -0.75);
    left: var(--adornment-inset);
  }

  .container {
    padding-top: calc(var(--text-xs) * 0.75);
  }

  .startAdornment {
    @apply absolute top-0 bottom-0 flex items-center justify-center mt-auto mb-auto;
    left: var(--adornment-inset);
  }

  .endAdornment {
    @apply absolute top-0 bottom-0 flex items-center justify-center mt-auto mb-auto text-xs;
    right: var(--adornment-inset);
  }
</style>
