import { CollectionMetadataFilter } from "../../../views/collections";

export interface CollectionFiltersProps {
    showActiveFilters: boolean;
    selectedFilters: {[key: string]: string | null};
    addSelectedFilter: (
        filterName: string,
        selectedFilter: {
            value: any;
            label: string;
        }) => void;
    filtersFromMetadata: CollectionMetadataFilter[];
    resetFilters: (event: React.MouseEvent<HTMLButtonElement>) => void;
    toggleActiveFilters: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
