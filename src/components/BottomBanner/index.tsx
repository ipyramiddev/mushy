/* This example requires Tailwind CSS v2.0+ */

import { XIcon } from "@heroicons/react/outline";

export default function BottomBanner({ setDisplayCopyBanner }: any) {
  return (
    <div className="fixed bottom-0 inset-x-0 pb-2 sm:pb-5 z-10">
      <div className="max-w-lg mx-auto px-2 sm:px-6 lg:px-8">
        <div className="p-2 rounded-lg bg-blue-500 shadow-lg sm:p-3">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <p className="ml-3 font-medium text-white truncate">
                <span className="inline">Offer link has been copied to clipboard.</span>
              </p>
            </div>
            <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
              <button
                type="button"
                onClick={() => {
                  setDisplayCopyBanner(false);
                }}
                className="-mr-1 flex p-2 rounded-md hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <span className="sr-only">Dismiss</span>
                <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
