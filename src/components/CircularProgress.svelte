<script lang="ts">
  interface Props {
    color?: string;
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  }

  let { color = "black", size = "sm" }: Props = $props();
</script>

<div
  class="custom-loader"
  style="--color: {color}; height: var(--text-{size}); width: var(--text-{size});"
></div>

<style>
  .custom-loader {
    border-radius: 50%;
    border: 2px solid #0000;
    border-right-color: color-mix(in (hsl), color var(--color) 50%, white);
    position: relative;
    animation: s4 1s infinite linear;
  }
  .custom-loader:before,
  .custom-loader:after {
    content: "";
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    border: inherit;
    animation: inherit;
    animation-duration: 2s;
  }
  .custom-loader:after {
    animation-duration: 4s;
  }

  @keyframes s4 {
    100% {
      transform: rotate(1turn);
    }
  }
</style>
