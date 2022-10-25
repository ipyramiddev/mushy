import { CollectionMetadataFilter } from "../../../views/collections";

export interface CollectionActionsProps {
	isCollectionWithOffers: boolean;
    filtersFromMetadata?: CollectionMetadataFilter[];
    toggleActiveFilters?: (event: React.MouseEvent<HTMLButtonElement>) => void
    sorting: string;
    setSorting: (active: string) => void;
    isLoading: boolean;
    count?: number;
}
