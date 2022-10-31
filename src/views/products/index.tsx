import { Page } from "../../components/Page";
import { FilterBar } from "./filter-bar";
import { ProductsList } from "./products-list";
import {Divider} from "../../components/Divider";

export const ProductsView = () => {
    return (
        <Page title="Products | DigitalEyes">
            <FilterBar />
            <Divider />
            <ProductsList />
        </Page>
    );
}