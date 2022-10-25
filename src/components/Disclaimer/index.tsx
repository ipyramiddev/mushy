import { SpeakerphoneIcon, XIcon } from "@heroicons/react/outline";

export default function Disclaimer({ closeDisclaimer }: any) {

  return (
    <div className="fixed bottom-8 inset-x-0 pb-2 sm:pb-5 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="p-2 bg-indigo-600 rounded-md shadow-lg sm:p-3">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <span className="flex p-3">
                <SpeakerphoneIcon
                  className="h-6 w-6 text-white"
                  aria-hidden="true"
                />
              </span>
              <p className="ml-3 font-base text-white">
                <span>
                  Please note that this is our Beta launch - kindly use at your own discretion. Any NFT on the
                  marketplace that is marked as "Verifeyed" is authentic and you may trust that it came from the
                  Verifeyed collection. Any NFT without the "Verifeyed" label cannot be confirmed authentic by us. An
                  open market means that while everyone is welcome, there will be scammers too. Be safe and be careful
                  whilst purchasing un-Verifeyed works. If it seems too good to be true - it probably is
                </span>
              </p>
            </div>

            <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
              <button
                type="button"
                onClick={() => {
                  closeDisclaimer();
                }}
                className="-mr-1 flex p-2 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white"
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
