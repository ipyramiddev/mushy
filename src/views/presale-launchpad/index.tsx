import { Page } from "../../components/Page";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as anchor from "@project-serum/anchor";
import MintButton from "../mint-button";

export const PresaleView = () => {
  const treasury = new anchor.web3.PublicKey(process.env.REACT_APP_TREASURY_ADDRESS!);

  const config = new anchor.web3.PublicKey(process.env.REACT_APP_PRESALE_CANDY_MACHINE_CONFIG!);

  const candyMachineId = new anchor.web3.PublicKey(process.env.REACT_APP_PRESALE_CANDY_MACHINE_ID!);

  const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST!;
  const connection = new anchor.web3.Connection(rpcHost);

  const startDateSeed = parseInt(process.env.REACT_APP_PRESALE_CANDY_START_DATE!, 10);

  const txTimeout = 30000;
  const soldierImgs = ["army-card-1.png", "army-card-2.png", "army-card-3.png"];
  let settings = {
    dots: false,
    className: "army-img",
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    centerMode: true,
    fade: true,
  };
  return (
    <Page>
      <div className="px-4 sm:px-6 lg:px-8 text-2xl md:text-4xl uppercase font-black py-6 md:py-10 mx-auto text-center">
        The Army Presale X DE Launchpad
      </div>
      <div>
        <div className="flex md:hidden justify-center items-center flex-wrap mb-4 -mt-2 px-4 sm:px-6 lg:px-8">
          <div className="uppercase">The Army</div>
        </div>
        <div className="relative flex justify-center bg-red">
          <img
            src="/assets/launchpad/army-banner.png"
            alt="the army"
            className="h-full w-full object-cover object-center opacity-40 absolute"
          />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full shadow-md p-5 overflow-hidden">
            <ul className="hidden md:grid gap-8 grid-cols-3 pb-16">
              {soldierImgs.length > 0 &&
                soldierImgs.map((img, index) => (
                  <li className="col-span-1 flex flex-col shadow-md bg-color-main-primary cursor-pointer overflow-hidden max-w-max mx-auto md:mx-0">
                    <div className="relative">
                      <img
                        className="card-img w-max-none flex-auto object-cover"
                        src={`/assets/launchpad/${img}`}
                        alt="img of a soldier from the Army"
                      />
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="xl:max-w-7xl mx-4 sm:mx-6 xl:mx-auto border border-color-border shadow-md -mt-4 lg:-mt-16 p-5 relative bg-color-main-primary">
          <div className="hidden md:flex justify-between flex-wrap mb-4">
            <div className="uppercase text-2xl sm:text-4xl mb-4">The Army</div>
          </div>

          <div className="font-bold pt-2 mb-4">
            The Army is a Decentralized Autonomous Organization managed by an RPG decision-making
            model. ‍ The Factions and their Soldiers will compete to succeed and to take control of
            the Treasury funds. ‍ The purpose of the DAO is to manage the funds in order to create
            profit for all its members.
          </div>

          <div className="text-center pt-5 pb-5">
            <Link
              to={{ pathname: "https://www.thearmy.io/" }}
              target="_blank"
              type="button"
              className="appearance-none disabled:opacity-50 duration-150 ease-in border border-color-border px-2 md:px-4 py-2 bg-almost-black text-xs sm:text-sm font-medium text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 uppercase md:mx-auto w-full sm:w-96"
            >
              Visit the Website
            </Link>
          </div>
        </div>
        <div className="pt-20 pb-10 grid justify-center">
          <section className="flex flex-col md:flex-row py-20 px-10 bg-white rounded-md shadow-lg max-w-6xl	 md:max-w-8xl">
            <div className="">
              <Slider {...settings}>
                <div>
                  <img src="/assets/launchpad/transparent-army-1.png" />
                </div>
                <div>
                  <img src="/assets/launchpad/transparent-army-2.png" />
                </div>
                <div>
                  <img src="/assets/launchpad/transparent-army-3.png" />
                </div>
                <div>
                  <img src="/assets/launchpad/transparent-army-4.png" />
                </div>
                <div>
                  <img src="/assets/launchpad/transparent-army-5.png" />
                </div>
                <div>
                  <img src="/assets/launchpad/transparent-army-6.png" />
                </div>
              </Slider>
            </div>
            <div className="text-indigo-800 text-3xl">
              <small className="uppercase text-xl">DigitalEyes presents</small>
              <h3 className="uppercase text-5xl text-black font-medium pb-10">The Army Pre-Sale</h3>
              <h3 className="text-4xl font-semibold mb-7">0.69 SOL</h3>
              <small className="text-black">
                6900 Soldiers across 5 factions, fighting to take control of the Treasury funds,
                which one will you mint? The question is, why not all so YOU can control your own
                fate.
              </small>{" "}
              <br /> <br />
              <small className="text-black text-4xl">24th October, 8PM UTC.</small>
              <div className="flex gap-0.5 mt-10">
                <MintButton
                  candyMachineId={candyMachineId}
                  config={config}
                  connection={connection}
                  startDate={startDateSeed}
                  treasury={treasury}
                  txTimeout={txTimeout}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </Page>
  );
};
