<script lang="ts">
  import { ripple } from "svelte-ripple-action";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { fi } from "zod/locales";

  interface Props {
    variant?: "filled" | "text";
  }

  let {
    children,
    variant = "filled",
    ...rest
  }: Props & HTMLButtonAttributes = $props();
</script>

<button
  use:ripple
  {...rest}
  class="button"
  class:filled={variant === "filled"}
  class:text={variant === "text"}
>
  {@render children?.()}
</button>

<style lang="postcss">
  .button {
    @apply transition-all;
    padding: 0.5rem 1rem;
    border: none;
    cursor: pointer;
    border-radius: 0.5rem;

    /* on attr disabled */
    &:disabled {
      cursor: not-allowed;
    }
  }

  .filled {
    background-color: #4a90e2;

    &:hover {
      background-color: #357abd;
    }

    &:disabled {
      background-color: #ccc;

      &:hover {
        background-color: #ccc;
      }
    }
  }

  .text {
    color: #4a90e2;
    font-weight: bold;
    text-transform: uppercase;
    padding: 0;

    &:hover {
      color: #357abd;
    }

    &:disabled {
      color: #ccc;

      &:hover {
        color: #ccc;
      }
    }
  }
</style>
