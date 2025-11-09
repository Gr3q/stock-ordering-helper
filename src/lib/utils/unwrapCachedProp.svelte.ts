import { onMount } from "svelte";
import type { Readable } from "svelte/store";

interface Result<T> {
    value: T | null;
}

/**
 * @param value
 * @returns
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { unwrapCachedProperty } from "$lib/utils/unwrapCachedProp";
 *   import { sitesToOpenCachedProp } from "$lib/models/localStorageModel";
 *
 *   const sitesToOpen = unwrapCachedProperty(sitesToOpenCachedProp.value);
 * </script>
 */
export function unwrapCachedProperty<T>(value: Readable<Promise<T>>): Result<T> {
    const result: Result<T> = $state({ value: null });

    onMount(() => {
        const unsub = value.subscribe((e) => {
            e.then(res => {
                result.value = res;
            })
        })

        return () => {
            unsub();
        }
    })

    return result;
}
