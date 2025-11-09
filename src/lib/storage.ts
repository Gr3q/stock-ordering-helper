import z from "zod";
import { Site } from "./sites";
import { browser } from "$app/environment";

const sitesValidator = z.array(z.enum(Site));
const searchHistoryItemValidator = z.object({
    timestamps: z.array(z.iso.datetime()),
});

const STORAGE_DATA = {
    sites: sitesValidator,
    searchHistory: z.record(z.string(), searchHistoryItemValidator),
} as const;

type StorageData = typeof STORAGE_DATA;

export type SearchHistoryItem = z.infer<typeof searchHistoryItemValidator>;

export function saveToStorage<T extends keyof StorageData>(key: T, data: z.infer<StorageData[T]>): void {
    if (!browser) {
        return;
    }

    localStorage.setItem(key, JSON.stringify(data));
}

export function loadFromStorage<T extends keyof StorageData>(key: T): z.infer<StorageData[T]> | null {
    if (!browser) {
        return null;
    }

    const data = localStorage.getItem(key);
    try {
        const val = JSON.parse(data || "");
        const result = STORAGE_DATA[key].safeParse(val);
        if (!result.success) {
            return null;
        }

        return result.data as z.infer<StorageData[T]>;
    } catch {
        return null;
    }
}