import { array, enum as _enum, type infer as _infer } from "zod";
import { Site } from "./sites";
import { browser } from "$app/environment";

const sitesValidator = array(_enum(Site));

const STORAGE_DATA = {
    sites: sitesValidator,
} as const;

type StorageData = typeof STORAGE_DATA;

export function saveToStorage<T extends keyof StorageData>(key: T, data: _infer<StorageData[T]>): void {
    if (!browser) {
        return;
    }

    localStorage.setItem(key, JSON.stringify(data));
}

export function loadFromStorage<T extends keyof StorageData>(key: T): _infer<StorageData[T]> | null {
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
        return result.data;
    } catch {
        return null;
    }
}
