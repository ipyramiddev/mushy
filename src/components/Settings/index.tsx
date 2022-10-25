import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { Fragment } from "react";
import { ENDPOINTS, useConnectionConfig } from "../../contexts/connection";
import { classNames, getEndPointName } from "../../utils";

export const Settings = () => {
  const { endpoint, setEndpoint } = useConnectionConfig();

  return (
    <Listbox value={endpoint} onChange={setEndpoint}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-normal text-white">
            Network:
          </Listbox.Label>
          <div className="mt-1 relative">
            <Listbox.Button className="bg-almost-black text-white relative w-full border border-gray-300 pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
              <span className="block truncate">
                {getEndPointName(endpoint)}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                  className="h-5 w-5 text-gray-500"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                static
                className="absolute z-10 mt-1 w-full bg-almost-black shadow-lg max-h-60 py-1 text-base ring-1 ring-white ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
              >
                {ENDPOINTS.map(({ name, endpoint }) => (
                  <Listbox.Option
                    key={endpoint}
                    className={({ active }) =>
                      classNames(
                        active ? "text-white" : "text-gray-500",
                        "cursor-default select-none relative py-2 pl-3 pr-9"
                      )
                    }
                    value={endpoint}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-gray-500",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};
