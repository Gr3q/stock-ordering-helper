import { browser } from "$app/environment";
import type { Site } from "$lib/sites";
import { loadFromStorage, saveToStorage, type SearchHistoryItem } from "$lib/storage";
import { CachedProp } from "$lib/utils/cachedProp";

export const sitesToOpenCachedProp = new CachedProp<Set<Site> | null>(async () => {
    const storedSites = loadFromStorage("sites");
    return storedSites ? new Set(storedSites) : null;
});

export const searchHistory = new CachedProp<Record<string, SearchHistoryItem> | null>(async () => {
    const storedHistory = loadFromStorage("searchHistory");
    return storedHistory;
});

export function saveHistoryTerm(term: string): void {
    if (!browser) {
        return;
    }

    const history = loadFromStorage("searchHistory") || {};
    const now = new Date();

    if (history[term]) {
        history[term].timestamps.push(now);
    } else {
        history[term] = { timestamps: [now] };
    }

    saveToStorage("searchHistory", history);
    searchHistory.setValue(history);
}

export function saveSitesToOpen(sites: Set<Site>): void {
    if (!browser) {
        return;
    }

    const sitesArray = Array.from(sites);
    saveToStorage("sites", sitesArray);
    sitesToOpenCachedProp.setValue(sites);
}