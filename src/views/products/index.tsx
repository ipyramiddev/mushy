import { Page } from "../../components/Page";
import { FilterBar } from "./filter-bar";
import { ProductsList } from "./products-list";

export const ProductsView = () => {
    return (
        <Page title="Products | DigitalEyes">
            <FilterBar />
            <ProductsList />
        </Page>
    );
}