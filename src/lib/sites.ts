export enum Site {
    BOOKERS = "bookers",
    THOMAS_RIDLEY = "thomas_ridley",
    BIFOOD_DIRECT = "bifood_direct"
}

export const Sites: Site[] = Object.values(Site);

export interface SiteConfig {
    name: string;
    searchUrl: string;
    searchQueryParam: string;
    additionalParams?: Record<string, string>
}

export const SiteConfigs: Record<Site, SiteConfig> = {
    [Site.BOOKERS]: {
        name: "Bookers",
        searchQueryParam: "keywords",
        searchUrl: "https://www.booker.co.uk/products/product-search"
    },
    [Site.THOMAS_RIDLEY]: {
        name: "Thomas Ridley",
        searchUrl: "https://www.thomasridley.co.uk/catalogsearch/result/",
        searchQueryParam: "q"
    },
    [Site.BIFOOD_DIRECT]: {
        name: "Bifood Direct",
        searchUrl: "https://www.bidfooddirect.co.uk/#/products/search/",
        searchQueryParam: "searchTerm",
        additionalParams: {
            category: "All",
            page: "1",
            useUrlParams: "true"
        }
    }
}