import { Menu, Popover, Transition } from "@headlessui/react";
import { Filters } from "../../components/Filters";
import { AllCategories } from "../../components/AllCategories";
import { Price } from "../../components/Price";
import { ItemCondition } from "../../components/ItemCondition";
import { Location } from "../../components/Location";
import { SortBy } from "../../components/SortBy";


export const FilterBar = () => {
    return (
        <div className="bg-header-pink flex justify-between items-center px-4 sm:px-6 md:justify-start md:space-x-10 mx-auto shadow-header h-60px" style={{ height: "60px" }}>
            <Popover.Group as="nav" className="hidden lg:flex space-x-3 items-center pl-10">
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
            <div className="" style={{ marginLeft: "50%" }}>
                <SortBy />
            </div>
        </div>
    )
}