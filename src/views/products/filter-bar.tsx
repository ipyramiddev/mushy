import { Menu, Popover, Transition } from "@headlessui/react";
import { Filters } from "../../components/Filters";
import { AllCategories } from "../../components/AllCategories";
import { Price } from "../../components/Price";
import { ItemCondition } from "../../components/ItemCondition";
import { Location } from "../../components/Location";
import { SortBy } from "../../components/SortBy";
import { Divider } from "../../components/Divider";
import { ReactComponent as ArrowCircleRightIcon } from "../../assets/icons/arrow-circle-right.svg";

export const FilterBar = () => {
    return (
        <div className="w-full fixed top-12 md:top-20">
            <div className="bg-header-pink flex justify-between items-center h-16 w-full md:px-32">
                <div className="hidden xl:block">
                    <Popover.Group as="nav" className="lg:flex space-x-3 items-center">
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
                </div>
                <div className="block xl:hidden text-header-purple hover:text-white cursor-pointer">
                    <ArrowCircleRightIcon />
                </div>
                <div>
                    <SortBy />
                </div>
            </div>
            <Divider />
        </div>
    );
}