import { ReactComponent as FaqA } from "../../assets/icons/faq-a.svg";
import { ReactComponent as FaqQ } from "../../assets/icons/faq-q.svg";
import React from "react";

import { Page } from "../../components/Page";
const Tabs = () => {
  const [openTab, setOpenTab] = React.useState(1);
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full">
          <ul className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row" role="tablist">
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 1 ? "text-white bg-black" : "text-black-600 bg-white")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(1);
                }}
                data-toggle="tab"
                href="#link1"
                role="tablist"
              >
                Buyers/Sellers
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 2 ? "text-white bg-black" : "text-black-600 bg-white")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(2);
                }}
                data-toggle="tab"
                href="#link2"
                role="tablist"
              >
                Creators
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 3 ? "text-white bg-black" : "text-black-600 bg-white")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(3);
                }}
                data-toggle="tab"
                href="#link3"
                role="tablist"
              >
                Categories
              </a>
            </li>
          </ul>
          <div className="relative flex flex-col min-w-0 w-full mb-6 shadow-lg rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                  <ul className=" border rounded">
                    <li className="border-gray-200 border-solid border-b xl:p-8 lg:p-8 md:p-8 sm:p-8 p-4">
                      <span className="flex items-center">
                        <FaqQ className="mr-2" />
                        <p className="text-main-secondary text-xl sm:text-2xl xl:w-10/12 w-full">
                          What fees are included in the price of a listed NFT?
                        </p>
                      </span>
                      <span className="flex items-center">
                        <FaqA className="mr-2" />
                        <p className="xl:w-10/12 lg:w-10/12 w-full text-gray-500 text-base leading-8">
                          There are two additional fees paid for by the Buyer of the NFT. The
                          royalty % fee is set by the creator at the time of minting and the service
                          fee of 2.5% is collected by DigitalEyes.
                        </p>
                      </span>
                    </li>
                    <li className="border-gray-200 border-solid border-b xl:p-8 lg:p-8 md:p-8 sm:p-8 p-4 rounded">
                      <span className="flex items-center">
                        <FaqQ className="mr-2" />
                        <p className="text-main-secondary text-xl sm:text-2xl xl:w-10/12 w-full">
                          What is the gas fee on SOL?{" "}
                        </p>
                      </span>
                      <span className="flex">
                        <FaqA className="mr-2" />
                        <p className="xl:w-10/12 lg:w-10/12 w-full text-gray-500 text-base leading-8">
                          The transaction fee on SOL is minimal. However, we encourage users to have
                          at least 0.01 in their wallet to ensure that their transaction can go
                          through.
                        </p>
                      </span>
                    </li>
                    <li className="border-gray-200 border-solid border-b xl:p-8 lg:p-8 md:p-8 sm:p-8 p-4 rounded">
                      <span className="flex items-center">
                        <FaqQ className="mr-2" />
                        <p className="text-main-secondary text-xl sm:text-2xl xl:w-10/12 w-full">
                          What is the price floor?
                        </p>
                      </span>
                      <span className="flex items-center">
                        <FaqA className="mr-2" />
                        <p className="xl:w-10/12 lg:w-10/12 w-full text-gray-500 text-base leading-8">
                          The price floor is the lowest priced NFTs that is currently available for
                          sale of a particular collection.{" "}
                        </p>
                      </span>
                    </li>
                    <li className="border-gray-200 border-solid border-b xl:p-8 lg:p-8 md:p-8 sm:p-8 p-4 rounded">
                      <span className="flex items-center">
                        <FaqQ className="mr-2" />
                        <p className="text-main-secondary text-xl sm:text-2xl xl:w-10/12 w-full">
                          Where can I view my NFTs?
                        </p>
                      </span>
                      <span className="flex items-center">
                        <FaqA className="mr-2" />
                        <p className="xl:w-10/12 lg:w-10/12 w-full text-gray-500 text-base leading-8">
                          You may connect your wallet that is currently supported by our platform
                          (e.g. Phantom) and go to the “Sell” page to see your existing NFTs.
                          Alternatively, you may also open up your Wallets like Phantom and Soflare,
                          and go to its collectibles tab to see your existing NFTs you own in that
                          wallet.
                        </p>{" "}
                      </span>
                    </li>
                    <li className="border-gray-200 border-solid border-b xl:p-8 lg:p-8 md:p-8 sm:p-8 p-4 rounded">
                      <span className="flex items-center">
                        <FaqQ className="mr-2" />
                        <p className="text-main-secondary text-xl sm:text-2xl xl:w-10/12 w-full">
                          How do people view my listings?
                        </p>
                      </span>
                      <span className="flex items-center">
                        <FaqA className="mr-2" />
                        <p className="xl:w-10/12 lg:w-10/12 w-full text-gray-500 text-base leading-8">
                          If you listed a verifeyed collection it will show up in that collection’s
                          page. If you are listing a non-verifeyed NFT, it will appear in the{" "}
                          <a
                            target="_blank"
                            href="https://digitaleyes.market/collections/Unverifeyed"
                            rel="noreferrer"
                          >
                            “Unverifeyed” collection.
                          </a>{" "}
                          You may share the link of your listing to prospective buyers as well.
                        </p>
                      </span>
                    </li>
                    <li className="border-gray-200 border-solid border-b xl:p-8 lg:p-8 md:p-8 sm:p-8 p-4 rounded">
                      <span className="flex items-center">
                        <FaqQ className="mr-2" />
                        <p className="text-main-secondary text-xl sm:text-2xl xl:w-10/12 w-full">
                          I listed an NFT and it is not reflecting yet?
                        </p>
                      </span>
                      <span className="flex items-center">
                        <FaqA className="mr-2" />
                        <p className="xl:w-10/12 lg:w-10/12 w-full text-gray-500 text-base leading-8">
                          There might be potential delays in your NFT reflecting on the collection
                          page during the alpha launch phase. However, the team has implemented
                          measures to mitigate the occurrence of such. Note that your NFT is safe
                          and you may also check your wallet for “Listed NFTs”.{" "}
                        </p>{" "}
                      </span>
                    </li>
                    <li className="border-gray-200 border-solid border-b xl:p-8 lg:p-8 md:p-8 sm:p-8 p-4 rounded">
                      <span className="flex items-center">
                        <FaqQ className="mr-2" />
                        <p className="text-main-secondary text-xl sm:text-2xl xl:w-10/12 w-full">
                          How long will it take to get my SOL once my sale happens?
                        </p>
                      </span>
                      <span className="flex items-center">
                        <FaqA className="mr-2" />
                        <p className="xl:w-10/12 lg:w-10/12 w-full text-gray-500 text-base leading-8">
                          The transaction is immediate and you may verify them on the blockchain
                          (e.g. Solscan/ Solana Explorer){" "}
                        </p>{" "}
                      </span>
                    </li>

                    <li className="border-gray-200 border-solid border-b xl:p-8 lg:p-8 md:p-8 sm:p-8 p-4 rounded">
                      <span className="flex items-center">
                        <FaqQ className="mr-2" />
                        <p className="text-main-secondary text-xl sm:text-2xl xl:w-10/12 w-full">
                          Are my NFTs safe when listed on DigitalEyes?
                        </p>
                      </span>
                      <span className="flex items-center">
                        <FaqA className="mr-2" />
                        <p className="xl:w-10/12 lg:w-10/12 w-full text-gray-500 text-base leading-8">
                          DigitalEyes is backed by a{" "}
                          <a
                            target="_blank"
                            href="https://solarians.click/static/docs/zokyo-audit-210708.pdf"
                            rel="noreferrer"
                          >
                            secure audited contract Audit by Zokyo
                          </a>
                        </p>
                      </span>
                    </li>
                    <li className="border-gray-200 border-solid border-b xl:p-8 lg:p-8 md:p-8 sm:p-8 p-4 rounded">
                      <span className="flex items-center">
                        <FaqQ className="mr-2" />
                        <p className="text-main-secondary text-xl sm:text-2xl xl:w-10/12 w-full">
                          During the Alpha, will I be able to list any NFT?
                        </p>
                      </span>
                      <span className="flex items-center">
                        <FaqA className="mr-2" />
                        <p className="xl:w-10/12 lg:w-10/12 w-full text-gray-500 text-base leading-8">
                          Yes, you will be able to list what is in your wallet. We accept only
                          meteplex standard.
                        </p>
                      </span>
                    </li>
                  </ul>
                </div>
                <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                  <ul className=" border rounded">
                    <li className="border-gray-200 border-solid border-b xl:p-8 lg:p-8 md:p-8 sm:p-8 p-4 rounded">
                      <span className="flex items-center">
                        <FaqQ className="mr-2" />
                        <p className="text-main-secondary text-xl sm:text-2xl xl:w-10/12 w-full">
                          What does "Verifeyed" mean? What are “Verifeyed” collections?
                        </p>
                      </span>
                      <span className="flex items-center">
                        <FaqA className="mr-2" />
                        <p className="xl:w-10/12 w-full text-gray-500 text-base leading-8">
                          The “Verifeyed” label means that the NFTs listed within that collection
                          have been authenticated against the official mint hash list provided by
                          the NFT project’s team. It does not mean that we endorse or curate these
                          projects, and buyer discretion is advised at all times.
                        </p>
                      </span>
                    </li>
                    <li className="border-gray-200 border-solid border-b xl:p-8 lg:p-8 md:p-8 sm:p-8 p-4">
                      <span className="flex items-center">
                        <FaqQ className="mr-2" />
                        <p className="text-main-secondary text-xl sm:text-2xl xl:w-10/12 w-full">
                          What is a Featured Collection?
                        </p>
                      </span>
                      <span className="flex items-center">
                        <FaqA className="mr-2" />
                        <p className="xl:w-10/12 w-full text-gray-500 text-base leading-8">
                          Our Featured Collection displays new/upcoming NFT projects for our buyers
                          to explore. Although this provides these collections with more visibility,
                          users should note that we do not endorse or curate these projects, and
                          buyer discretion is advised at all times - users are reminded to always
                          conduct their due diligence before making any purchase decisions.
                        </p>
                      </span>
                    </li>
                    <li className="border-gray-200 border-solid border-b xl:p-8 lg:p-8 md:p-8 sm:p-8 p-4">
                      <span className="flex items-center">
                        <FaqQ className="mr-2" />
                        <p className="text-main-secondary text-xl sm:text-2xl xl:w-10/12 w-full">
                          What are “Top DigitalEyes Verifeyed Collections”?
                        </p>
                      </span>
                      <span className="flex items-center">
                        <FaqA className="mr-2" />
                        <p className="xl:w-10/12 lg:w-10/12 w-full text-gray-500 text-base leading-8">
                          These are the top Verifeyed Collections listed on DigitalEyes based on our
                          internal sales criteria framework.
                        </p>
                      </span>
                    </li>
                  </ul>
                </div>
                <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                  <ul className=" border rounded">
                    <li className="border-gray-200 border-solid border-b xl:p-8 lg:p-8 md:p-8 sm:p-8 p-4 rounded">
                      <span className="flex items-center">
                        <FaqQ className="mr-2" />
                        <p className="text-main-secondary text-xl sm:text-2xl xl:w-10/12 w-full">
                          How do I get my NFT collection verifeyed?{" "}
                        </p>
                      </span>
                      <span className="flex items-center">
                        <FaqA className="mr-2" />
                        <p className="xl:w-10/12 w-full text-gray-500 text-base leading-8">
                          Please see #✅-to-get-verifeyed
                        </p>
                      </span>
                    </li>
                    <li className="border-gray-200 border-solid border-b xl:p-8 lg:p-8 md:p-8 sm:p-8 p-4">
                      <span className="flex items-center">
                        <FaqQ className="mr-2" />
                        <p className="text-main-secondary text-xl sm:text-2xl xl:w-10/12 w-full">
                          How do I request for marketing partnerships and collaborations (Giveaways,
                          Collaborations, Partnerships, Featured Listings)?{" "}
                        </p>
                      </span>
                      <span className="flex items-center">
                        <FaqA className="mr-2" />
                        <p className="xl:w-10/12 w-full text-gray-500 text-base leading-8">
                          Please email the details of your request/proposal to
                          hello@digitaleyes.market
                        </p>
                      </span>
                    </li>
                    <li className="border-gray-200 border-solid border-b xl:p-8 lg:p-8 md:p-8 sm:p-8 p-4">
                      <span className="flex items-center">
                        <FaqQ className="mr-2" />
                        <p className="text-main-secondary text-xl sm:text-2xl xl:w-10/12 w-full">
                          Can I list artwork that may be considered NSFW?
                        </p>
                      </span>
                      <span className="flex items-center">
                        <FaqA className="mr-2" />
                        <p className="xl:w-10/12 lg:w-10/12 w-full text-gray-500 text-base leading-8">
                          Yes - there will be a disclaimer shown when users enter the collection.
                        </p>
                      </span>
                    </li>
                    <li className="border-gray-200 border-solid border-b xl:p-8 lg:p-8 md:p-8 sm:p-8 p-4 rounded">
                      <span className="flex items-center">
                        <FaqQ className="mr-2" />
                        <p className="text-main-secondary text-xl sm:text-2xl xl:w-10/12 w-full">
                          Can I list derivative artwork that may have been built off other existing
                          projects?
                        </p>
                      </span>
                      <span className="flex">
                        <FaqA className="mr-2" />
                        <p className="xl:w-10/12 lg:w-10/12 w-full text-gray-500 text-base leading-8">
                          Yes - there will be a disclaimer shown when users enter the collection.
                        </p>
                      </span>
                    </li>
                    <li className="border-gray-200 border-solid border-b xl:p-8 lg:p-8 md:p-8 sm:p-8 p-4 rounded">
                      <span className="flex items-center">
                        <FaqQ className="mr-2" />
                        <p className="text-main-secondary text-xl sm:text-2xl xl:w-10/12 w-full">
                          What is the mint authority?
                        </p>
                      </span>
                      <span className="flex items-center">
                        <FaqA className="mr-2" />
                        <p className="xl:w-10/12 lg:w-10/12 w-full text-gray-500 text-base leading-8">
                          This is the wallet used by the creator to create the collection and
                          distribute mints.
                        </p>
                      </span>
                    </li>
                    <li className="border-gray-200 border-solid border-b xl:p-8 lg:p-8 md:p-8 sm:p-8 p-4 rounded">
                      <span className="flex items-center">
                        <FaqQ className="mr-2" />
                        <p className="text-main-secondary text-xl sm:text-2xl xl:w-10/12 w-full">
                          How can I access my mint hash list for my minted NFTs?
                        </p>
                      </span>
                      <span className="flex items-center">
                        <FaqA className="mr-2" />
                        <p className="xl:w-10/12 lg:w-10/12 w-full text-gray-500 text-base leading-8">
                          You may connect the Candy Machine ID to{" "}
                          <a target="_blank" href="https://tools.abstratica.art/" rel="noreferrer">
                            Abstractica tools
                          </a>{" "}
                          to retrieve your full mint hash list.
                        </p>
                      </span>
                    </li>
                    <li className="border-gray-200 border-solid border-b xl:p-8 lg:p-8 md:p-8 sm:p-8 p-4 rounded">
                      <span className="flex items-center">
                        <FaqQ className="mr-2" />
                        <p className="text-main-secondary text-xl sm:text-2xl xl:w-10/12 w-full">
                          What is a mint list?
                        </p>
                      </span>
                      <span className="flex items-center">
                        <FaqA className="mr-2" />
                        <p className="xl:w-10/12 lg:w-10/12 w-full text-gray-500 text-base leading-8">
                          Everytime you mint a NFT it creates a unique mint hash. This piece of data
                          plus mint authority ensures authenticity.
                        </p>
                      </span>
                    </li>
                    <li className="border-gray-200 border-solid border-b xl:p-8 lg:p-8 md:p-8 sm:p-8 p-4 rounded">
                      <span className="flex items-center">
                        <FaqQ className="mr-2" />
                        <p className="text-main-secondary text-xl sm:text-2xl xl:w-10/12 w-full">
                          What format do you prefer for the mint list?
                        </p>
                      </span>
                      <span className="flex items-center">
                        <FaqA className="mr-2" />
                        <p className="xl:w-10/12 lg:w-10/12 w-full text-gray-500 text-base leading-8">
                          JSON - so you don't have to keep providing a CSV everytime you mint
                          something new.
                        </p>
                      </span>
                    </li>
                    <li className="border-gray-200 border-solid border-b xl:p-8 lg:p-8 md:p-8 sm:p-8 p-4 rounded">
                      <span className="flex items-center">
                        <FaqQ className="mr-2" />
                        <p className="text-main-secondary text-xl sm:text-2xl xl:w-10/12 w-full">
                          How do I update my assets (e.g. logo, mintlist, etc.)?
                        </p>
                      </span>
                      <span className="flex items-center">
                        <FaqA className="mr-2" />
                        <p className="xl:w-10/12 lg:w-10/12 w-full text-gray-500 text-base leading-8">
                          You may request our moderators to give you the “Launch Partner” Discord
                          role, which will grant you access to our Launch Partner channels - you may
                          then request for updates in #asset-update-request.{" "}
                        </p>
                      </span>
                    </li>
                    <li className="border-gray-200 border-solid border-b xl:p-8 lg:p-8 md:p-8 sm:p-8 p-4 rounded">
                      <span className="flex items-center">
                        <FaqQ className="mr-2" />
                        <p className="text-main-secondary text-xl sm:text-2xl xl:w-10/12 w-full">
                          Where do I go for technical support (for creators only)?
                        </p>
                      </span>
                      <span className="flex items-center">
                        <FaqA className="mr-2" />
                        <p className="xl:w-10/12 lg:w-10/12 w-full text-gray-500 text-base leading-8">
                          #creators-tech-support <br />
                          For more enquiries and support, please feel free to reach out to our
                          friendly team members in our{" "}
                          <a target="_blank" href="https://discord.gg/Fj2y6VWaqB" rel="noreferrer">
                            official Discord Group
                          </a>{" "}
                        </p>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const LaunchpadView = () => {
  return (
    <Page title="FAQ | DigitalEyes">
      <Tabs />;
    </Page>
  );
};
