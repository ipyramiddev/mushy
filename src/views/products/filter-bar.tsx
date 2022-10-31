import { Menu, Popover, Transition } from "@headlessui/react";
import { Filters } from "../../components/Filters";
import { AllCategories } from "../../components/AllCategories";
import { Price } from "../../components/Price";
import { ItemCondition } from "../../components/ItemCondition";
import { Location } from "../../components/Location";
import { SortBy } from "../../components/SortBy";


export const FilterBar = () => {
    return (
        <div className="bg-header-pink flex justify-between items-center h-16 w-full">
            <Popover.Group as="nav" className="hidden lg:flex space-x-3 items-center p-10">
                <div className="font-light">
                    <Filters />
                </div>
                <div className="font-light">
                    <AllCategories />
                </div>
                <div className="font-light">
                    <Price />
                </div>
                <div className="font-light text-white hover:text-gray-500 uppercase">
                    <ItemCondition />
                </div>
                <div className="font-light text-white hover:text-gray-500 uppercase">
                    <Location />
                </div>
            </Popover.Group>
            <div className="p-10">
                <SortBy />
            </div>
        </div>
    )
}