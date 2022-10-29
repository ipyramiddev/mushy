import { Menu, Popover, Transition } from "@headlessui/react";
import { CogIcon, MenuIcon, XIcon, SunIcon, UserCircleIcon } from "@heroicons/react/outline";
// @ts-ignore
import { IKImage } from "imagekitio-react";
import { Fragment, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { ReactComponent as EmptyMoon } from "../../assets/icons/empty-moon.svg";
import { ReactComponent as FullMoon } from "../../assets/icons/full-moon.svg";
import { ReactComponent as DiscordLogo } from "../../assets/logo/discord.svg";
import { ReactComponent as TwitterLogo } from "../../assets/logo/twitter.svg";
import { ReactComponent as FeedbackLogo } from "../../assets/icons/feedback.svg";
import { IMAGE_KIT_ENDPOINT_OLDURL, IMAGE_KIT_ENDPOINT_URL } from "../../constants/images";
import { GET_SOLO_USER_NO_AUTH, GET_SOLO_USER_NO_AUTH_QUERY_PARAM } from "../../constants/urls";
import * as ROUTES from "../../constants/routes";
import { useCollections } from "../../contexts/collections";
import { useWallet } from "../../contexts/wallet";
import CollectionSelect from "../CollectionSelect";
import { ConnectButton } from "../ConnectButton";
import { CurrentUserBadge } from "../CurrentUserBadge";
import { Settings } from "../Settings";
import { DE_DISCORD, DE_TWITTER } from "../../utils/DeSocials";
import { Divider } from "../Divider";
import { useLocation } from "react-router-dom";

export function AppBar() {
    const [checked, setChecked] = useState(false);

    localStorage.setItem("theme", "theme-dark");

    const setTheme = (themeName: string) => {
        localStorage.setItem("theme", themeName);
        document.documentElement.className = themeName;
    };

    useEffect(() => {
        if (localStorage.getItem("theme") === "theme-dark") {
            setChecked(true);
        }
    }, []);

    // function to toggle between light and dark theme
    const toggleTheme = () => {
        setChecked((c) => !c);
        if (localStorage.getItem("theme") === "theme-dark") {
            setTheme("theme-light");
        } else {
            setTheme("theme-dark");
        }
    };

    const history = useHistory();
    const { collections, topCollections } = useCollections();

    return (
        <Popover className="bg-header-pink sticky top-0 z-50">
            {({ open, close }) => (
                <>
                    <div className="flex justify-between items-center px-4 sm:px-6 md:justify-start md:space-x-10 mx-auto shadow-header">
                        <div className="flex justify-start md:flex-auto md:h-20 h-12 xl:ml-10">
                            <Link to={ROUTES.HOME} onClick={() => close()} className="flex items-center">
                                <IKImage
                                    urlEndpoint={IMAGE_KIT_ENDPOINT_URL}
                                    path="/logo/mushy.svg"
                                    alt="mushy logo"
                                    className="w-auto h-11 md:h-7.5"
                                />
                            </Link>
                        </div>

                        <div className="flex-auto flex justify-center">
                            <div className="text-sm md:text-base w-full lg:w-64 xl:w-80 bg-white mx-8 lg:mx-auto rounded-full border border-gray-300">
                                <CollectionSelect
                                    collections={collections}
                                    topCollections={topCollections}
                                    onClose={close}
                                    history={history}
                                    darkMode={true}
                                />
                            </div>
                        </div>

                        {/*
            <button onClick={toggleTheme}>
              <SunIcon className="w-5 h-5 text-white" />
            </button>
            */}

                        <div className="-mr-2 -my-2 lg:hidden">
                            <Popover.Button className="bg-almost-black p-2 inline-flex items-center justify-center text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                                <span className="sr-only">Open menu</span>
                                <MenuIcon className="h-6 w-6" aria-hidden="true" />
                            </Popover.Button>
                        </div>
                        <Popover.Group as="nav" className="hidden lg:flex space-x-6 items-center">
                            <Link
                                to={ROUTES.SOLO}
                                onClick={() => close()}
                                className="font-light text-white hover:text-gray-500 uppercase"
                            >
                                solo
                            </Link>
                            <Link
                                to={ROUTES.EXPLORE}
                                onClick={() => close()}
                                className="font-light text-white hover:text-gray-500 uppercase"
                            >
                                Explore
                            </Link>
                            <Link
                                to={ROUTES.WALLET}
                                onClick={() => close()}
                                className="font-light text-white hover:text-gray-500 uppercase"
                            >
                                Sell
                            </Link>
                            <Link
                                to={ROUTES.FAQ}
                                onClick={() => close()}
                                className="font-light text-white hover:text-gray-500 uppercase"
                            >
                                FAQ
                            </Link>

                            <Link
                                to={ROUTES.FAVOURITE_LIST}
                                className="font-light text-white hover:text-gray-500 uppercase"
                            >
                                Favorites
                            </Link>

                            {/* <Link
                to={ROUTES.FEEDBACK}
                className="font-light text-white hover:text-gray-500 uppercase"
              >
                <FeedbackLogo />
              </Link> */}
                        </Popover.Group>

                        <div className="hidden lg:flex items-center justify-end">
                            <WalletConnector />
                        </div>
                    </div>

                    <Transition
                        show={open}
                        as={Fragment}
                        enter="duration-200 ease-out"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="duration-100 ease-in"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Popover.Panel
                            focus
                            static
                            className="absolute top-0 inset-x-0 z-10 transition transform origin-top-right lg:hidden"
                        >
                            <div className="ring-1 ring-white ring-opacity-5 p-2 bg-almost-black divide-y-2 divide-gray-50">
                                <div className="pt-5 pb-6 px-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Link to={ROUTES.HOME} onClick={() => close()}>
                                                <IKImage
                                                    urlEndpoint={IMAGE_KIT_ENDPOINT_OLDURL}
                                                    path="/logo/digitaleyes.svg"
                                                    alt="digital eyes logo"
                                                    className="h-12 w-auto"
                                                />
                                            </Link>
                                        </div>
                                        <div className="-mr-2">
                                            <Popover.Button className="bg-almost-black border border-white p-2 inline-flex items-center justify-center text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                                                <span className="sr-only">Close menu</span>
                                                <XIcon className="h-6 w-6" aria-hidden="true" />
                                            </Popover.Button>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <nav className="grid grid-cols-1 gap-7">
                                            <Link
                                                to={ROUTES.HOME}
                                                onClick={() => close()}
                                                className="-m-3 p-3 flex items-center"
                                            >
                                                <div className="ml-3 font-light text-white uppercase hover:text-gray-500 text-xl">
                                                    Home
                                                </div>
                                            </Link>
                                            <Link
                                                to={ROUTES.SOLO}
                                                onClick={() => close()}
                                                className="-m-3 p-3 flex items-center"
                                            >
                                                <div className="ml-3 font-light text-white uppercase hover:text-gray-500 text-xl">
                                                    solo
                                                </div>
                                            </Link>

                                            <Link
                                                to={ROUTES.EXPLORE}
                                                onClick={() => close()}
                                                className="-m-3 p-3 flex items-center"
                                            >
                                                <div className="ml-3 font-light text-white uppercase hover:text-gray-500 text-xl">
                                                    Explore
                                                </div>
                                            </Link>

                                            <Link
                                                to={ROUTES.WALLET}
                                                onClick={() => close()}
                                                className="-m-3 p-3 flex items-center"
                                            >
                                                <div className="ml-3 font-light text-white uppercase hover:text-gray-500 text-xl">
                                                    Sell
                                                </div>
                                            </Link>
                                            <Link
                                                to={ROUTES.FAQ}
                                                onClick={() => close()}
                                                className="-m-3 p-3 flex items-center"
                                            >
                                                <div className="ml-3 font-light text-white uppercase hover:text-gray-500 text-xl">
                                                    FAQ
                                                </div>
                                            </Link>
                                            <Link
                                                to={ROUTES.FAVOURITE_LIST}
                                                onClick={() => close()}
                                                className="ml-3 font-light text-white uppercase hover:text-gray-500 text-xl"
                                            >
                                                Favorites
                                            </Link>
                                            <Link
                                                to={ROUTES.LAUNCHPAD}
                                                onClick={() => close()}
                                                className="ml-3 font-light text-white uppercase hover:text-gray-500 text-xl"
                                            >
                                                LAUNCHPAD
                                            </Link>
                                            {/* <Link
                        to={ROUTES.FEEDBACK}
                        className="ml-3 font-light text-white uppercase hover:text-gray-500 text-xl"
                      >
                        FEEDBACK
                      </Link> */}
                                        </nav>
                                    </div>
                                </div>
                                <div className="py-4 px-5">
                                    <div className="flex items-center justify-end">
                                        <WalletConnector />
                                    </div>

                                    <div className="mt-4 mx-10 flex justify-center space-x-12">
                                        <a
                                            href={DE_TWITTER}
                                            target="_blank"
                                            className="text-white hover:text-gray-500"
                                            rel="noreferrer"
                                        >
                                            <TwitterLogo className="h-8 w-8" />
                                        </a>
                                        <a
                                            href={DE_DISCORD}
                                            target="_blank"
                                            className="text-white hover:text-gray-500"
                                            rel="noreferrer"
                                        >
                                            <DiscordLogo className="h-8 w-8" />
                                        </a>
                                        {/* <a href="#" className="text-white hover:text-gray-500">
                      <TelegramLogo className="h-8 w-8" />
                    </a> */}
                                    </div>
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                    <Divider />
                </>
            )}
        </Popover>
    );
}

const WalletConnector = (props: any) => {
    const { connected, wallet } = useWallet();
    const history = useHistory();
    const { pathname } = useLocation();

    const goToProfile = async () => {
        const pubKey = wallet?.publicKey;
        try {
            const artistAuthed = await fetch(
                `${GET_SOLO_USER_NO_AUTH}?${GET_SOLO_USER_NO_AUTH_QUERY_PARAM}=${pubKey?.toBase58()}`
            ).then((res) => res.json());
            //@ts-ignore
            if (artistAuthed.username && artistAuthed.wallet_key == wallet?.publicKey.toBase58()) {
                history.push(`${ROUTES.SOLOPROFILE}/${artistAuthed?.username}`);
            } else {
                history.push(`${ROUTES.SOLO_SETTINGS}`);
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            {connected ? <CurrentUserBadge /> : <ConnectButton allowWalletChange={true} />}
            {(connected || process.env.NODE_ENV === "development") && (
                <Menu as="div" className="ml-3 relative inline-block text-left">
                    {({ open }) => (
                        <>
                            <div className="grid grid-cols-2 gap-2">
                                {connected && pathname.includes("solo") && (
                                    <button
                                        className="rounded-full flex items-center text-white hover:text-gray-700 focus:outline-none inline"
                                        onClick={goToProfile}
                                    >
                                        <UserCircleIcon className="h-7 w-7 opacity-90" aria-hidden="true" />
                                    </button>
                                )}
                                <Menu.Button className="rounded-full flex items-center text-white hover:text-gray-700 focus:outline-none inline">
                                    <span className="sr-only">Open options</span>
                                    <CogIcon className="h-5 w-5 opacity-80" aria-hidden="true" />
                                </Menu.Button>
                            </div>

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
                                    className="origin-top-right absolute right-0 mt-2 px-2 py-2 w-56  bg-almost-black ring-1 ring-white ring-opacity-5 focus:outline-none z-10 border border-gray-500"
                                >
                                    <div className="py-1 space-y-3">
                                        {process.env.NODE_ENV === "development" && (
                                            <Menu.Item>{({ active }) => <Settings />}</Menu.Item>
                                        )}
                                        <Menu.Item>{(props) => <DisconnectButton {...props} />}</Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </>
                    )}
                </Menu>
            )}
        </>
    );
};

const DisconnectButton = (props: any) => {
    const { connected, disconnect } = useWallet();
    if (connected) {
        return (
            <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-xs leading-4 font-light text-white bg-almost-black hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={() => {
                    props.onClick();
                    disconnect();
                }}
            >
                Disconnect
            </button>
        );
    }
    return null;
};
