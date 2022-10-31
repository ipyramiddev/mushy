
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronRightIcon } from "@heroicons/react/solid";
import { ReactComponent as CategoryIcon } from '../../assets/icons/category.svg';
import { ReactComponent as LocationIcon } from '../../assets/icons/location.svg';

// const solutions = [
//     {
//         name: 'Insights',
//         description: 'Measure actions your users take',
//         href: '##',
//         icon: IconOne,
//     },
//     {
//         name: 'Automations',
//         description: 'Create your own targeted content',
//         href: '##',
//         icon: IconTwo,
//     },
//     {
//         name: 'Reports',
//         description: 'Keep track of your growth',
//         href: '##',
//         icon: IconThree,
//     },
// ]

export const Filters = () => {
    return (
        <div className='w-full max-w-sm'>
            <Popover className="relative">
                {({ open }) => (
                    <>
                        <Popover.Button
                            className={`${open ? '' : 'text-opacity-90'} group inline-flex items-center bg-filter-button-purple px-5 py-1 text-base font-medium text-header-purple hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 rounded-full hover:bg-filter-button-hover-purple`}
                        >
                            <span>Filters</span>
                        </Popover.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                                <Popover.Panel className="absolute left-0 z-10 mt-1 w-screen max-w-sm -translate-x-0 transform px-4 sm:px-0 lg:max-w-xs">
                                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                        {/* <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2">
                                            {solutions.map((item) => (
                                                <a
                                                    key={item.name}
                                                    href={item.href}
                                                    className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                                                >
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
                                                        <item.icon aria-hidden="true" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </a>
                                            ))}
                                        </div> */}
                                        {/* category filter */}
                                        <div className="divide-y-2 divide-purple-divide-purple">
                                            <div className='grid grid-cols-1 divide-y divide-purple-divide-purple bg-filter-button-purple p-4'>
                                                <div className="bg-filter-button-purple">
                                                    <div
                                                        className="flow-root rounded-md px-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                                                    >
                                                        <span className="flex items-center">
                                                            <span className="text-sm font-medium text-purple-100">
                                                                Category
                                                            </span>
                                                        </span>
                                                        <span className="block flex items-center justify-between text-sm text-gray-500 py-4">
                                                            <div className="flex items-center">
                                                                <CategoryIcon />
                                                                <span className="ml-2 text-header-purple font-semi-bold">All Categories</span>
                                                            </div>
                                                            <ChevronRightIcon className="w-5 text-header-purple"/>
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* price filter */}
                                                <div className="bg-filter-button-purple">
                                                    <div
                                                        className="flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                                                    >
                                                        <div className="">
                                                            <div className="text-sm font-medium text-purple-100">
                                                                Price range
                                                            </div>
                                                        </div>
                                                        <div className="text-sm font-medium text-purple-100 pb-1">
                                                            From
                                                        </div>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <input type="text" className="bg-white border border-purple-100 text-purple-900 text-sm focus:ring-purple-900 focus:border-purple-900 focus:ring-purple-900 block w-5/12 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0" required />
                                                            <input type="text" className="bg-white border border-purple-100 text-purple-900 text-sm focus:ring-purple-900 focus:border-purple-900 focus:ring-purple-900 block w-5/12 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="No limit" required />

                                                        </div>
                                                    </div>
                                                </div>
                                                {/* item condition filter */}
                                                <div className="bg-filter-button-purple">
                                                    <div
                                                        className="flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                                                    >
                                                        <span className="flex items-center">
                                                            <span className="text-sm font-medium text-purple-100">
                                                                Item Condition
                                                            </span>
                                                        </span>
                                                        <span className="block flex items-center justify-between text-sm text-gray-500 py-4">
                                                            <div className="flex items-center">
                                                                <span className="ml-10 text-header-purple font-semi-bold">Any item condition</span>
                                                            </div>
                                                            <ChevronRightIcon className="w-5 text-header-purple"/>
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* location condition filter */}
                                                <div className="bg-filter-button-purple">
                                                    <div
                                                        className="flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                                                    >
                                                        <span className="flex items-center">
                                                            <span className="text-sm font-medium text-purple-100">
                                                                Location
                                                            </span>
                                                        </span>
                                                        <span className="block flex items-center justify-between text-sm text-gray-500 py-4">
                                                            <div className="flex items-center">
                                                                <LocationIcon />
                                                                <span className="ml-2 text-header-purple font-semi-bold">UK, London</span>
                                                            </div>
                                                            <ChevronRightIcon className="w-5 text-header-purple"/>
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* time of listing  */}
                                                <div className="bg-filter-button-purple">
                                                    <div
                                                        className="flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                                                    >
                                                        <span className="flex items-center">
                                                            <span className="text-sm font-medium text-purple-100">
                                                                Time of listing
                                                            </span>
                                                        </span>
                                                        <span className="block text-sm text-gray-500 py-4">
                                                            <div className="flex items-center justify-between px-2">
                                                                <div>
                                                                    <div className="text-2xl font-normal text-purple-100 text-center">24</div>
                                                                    <div className="text-purple-100">Hours</div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-2xl font-normal text-purple-100 text-center">7</div>
                                                                    <div className="text-purple-100">Days</div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-2xl font-normal text-purple-100 text-center">30</div>
                                                                    <div className="text-purple-100">Days</div>
                                                                </div>
                                                            </div>
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* blank */}
                                                <div className="bg-filter-button-purple py-12"></div>
                                            </div>
                                            <div className="bg-filter-button-purple py-2">
                                                <div className='text-right pr-4'>
                                                    <button className="text-header-purple px-3 py-1">Cancel</button>
                                                    <button className="text-white bg-header-purple px-3 py-1 rounded-full">Apply</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
        </div>
    )
}

function IconOne() {
    return (
        <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="48" height="48" rx="8" fill="#FFEDD5" />
            <path
                d="M24 11L35.2583 17.5V30.5L24 37L12.7417 30.5V17.5L24 11Z"
                stroke="#FB923C"
                strokeWidth="2"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.7417 19.8094V28.1906L24 32.3812L31.2584 28.1906V19.8094L24 15.6188L16.7417 19.8094Z"
                stroke="#FDBA74"
                strokeWidth="2"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.7417 22.1196V25.882L24 27.7632L27.2584 25.882V22.1196L24 20.2384L20.7417 22.1196Z"
                stroke="#FDBA74"
                strokeWidth="2"
            />
        </svg>
    )
}

function IconTwo() {
    return (
        <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="48" height="48" rx="8" fill="#FFEDD5" />
            <path
                d="M28.0413 20L23.9998 13L19.9585 20M32.0828 27.0001L36.1242 34H28.0415M19.9585 34H11.8755L15.9171 27"
                stroke="#FB923C"
                strokeWidth="2"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.804 30H29.1963L24.0001 21L18.804 30Z"
                stroke="#FDBA74"
                strokeWidth="2"
            />
        </svg>
    )
}

function IconThree() {
    return (
        <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="48" height="48" rx="8" fill="#FFEDD5" />
            <rect x="13" y="32" width="2" height="4" fill="#FDBA74" />
            <rect x="17" y="28" width="2" height="8" fill="#FDBA74" />
            <rect x="21" y="24" width="2" height="12" fill="#FDBA74" />
            <rect x="25" y="20" width="2" height="16" fill="#FDBA74" />
            <rect x="29" y="16" width="2" height="20" fill="#FB923C" />
            <rect x="33" y="12" width="2" height="24" fill="#FB923C" />
        </svg>
    )
}

// export const Filters = () => {
//     return (
//         <div>
//             sd
//         </div>
//     )
// }