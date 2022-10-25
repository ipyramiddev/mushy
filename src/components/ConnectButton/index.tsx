import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Fragment } from "react";
import { LABELS } from "../../constants";
import { useWallet } from "../../contexts/wallet";
import { classNames } from "../../utils/utils";

export interface ConnectButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  allowWalletChange?: boolean;
  size?: "lg";
}

export const ConnectButton = (props: ConnectButtonProps) => {
  const { connected, connect, select, provider } = useWallet();
  const { onClick, children, disabled, allowWalletChange } = props;

  // only show if wallet selected or user connected

  if (!provider || !allowWalletChange) {
    return (
      <button
        type="button"
        className={classNames(
          "btn focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 duration-150 ease-in"
        )}
        onClick={connected ? onClick : connect}
        disabled={connected && disabled}
      >
        {connected ? children : LABELS.CONNECT_LABEL}
      </button>
    );
  }

  return (
    <span className="relative z-0 inline-flex ">
      <button
        type="button"
        onClick={connected ? onClick : connect}
        disabled={connected && disabled}
        className="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-gray-900  hover:bg-gray-800 rounded-l text-xs font-light text-white uppercase focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 whitespace-nowrap"
      >
        {LABELS.CONNECT_LABEL}
      </button>
      <Menu as="span" className="-ml-px relative block">
        {({ open }) => (
          <>
            <Menu.Button className="relative inline-flex items-center px-2 py-2 border border-gray-700 bg-gray-900  hover:bg-gray-800 rounded-r text-sm font-light text-white focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500">
              <span className="sr-only">Open options</span>
              <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
            </Menu.Button>
            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="origin-top-right absolute right-0 mt-2 -mr-1 w-44 bg-almost-black ring-1 ring-white ring-opacity-5 focus:outline-none"
              >
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={select}
                        className={classNames(
                          active ? "text-gray-500" : "text-white",
                          "block px-4 py-2 text-xs font-light text-left w-full uppercase"
                        )}
                      >
                        Change Wallet
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </span>
  );
};
