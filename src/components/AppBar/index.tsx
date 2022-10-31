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
import { ReactComponent as WalletIcon } from "../../assets/icons/wallet.svg";
import { ReactComponent as CirclePlusIcon } from "../../assets/icons/circle-plus.svg";


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
        <Popover className="bg-header-pink fixed top-0 z-50 w-full">
            {({ open, close }) => (
                <>
                    <div className="w-full md:px-32 flex items-center">
                        {/* <div className="w-full flex justify-between items-center px-4 sm:px-6 md:justify-start md:space-x-10 mx-auto shadow-header"> */}
                        <div className="flex justify-start md:flex-auto md:h-20 h-12">
                            <Link to={ROUTES.HOME} onClick={() => close()} className="flex items-center">
                                <IKImage
                                    urlEndpoint={IMAGE_KIT_ENDPOINT_URL}
                                    path="/logo/mushy.svg"
                                    alt="mushy logo"
                                    className="w-auto h-11 md:h-7.5"
                                />
                            </Link>
                        </div>

                        <div className="hidden lg:flex items-center justify-end">
                            <div className="text-sm md:text-base w-full lg:w-64 xl:w-80 bg-white mx-8 lg:mx-auto rounded-full border border-gray-300 md:mr-8">
                                <CollectionSelect
                                    collections={collections}
                                    topCollections={topCollections}
                                    onClose={close}
                                    history={history}
                                    darkMode={true}
                                />
                            </div>
                            {/* <WalletConnector /> */}
                            <div className="md:mr-4">
                                <ConnectWallet />
                            </div>
                        </div>
                        <div>
                            <AddProduct />
                        </div>
                    </div>
                    <Divider />
                </>
            )}
        </Popover>
    );
}

const ConnectWallet = () => {
    return (
        <button
            type="button" 
            className= "bg-transparent hover:bg-header-purple text-header-purple font-semibold hover:text-white py-2 px-4 border border-header-purple hover:border-transparent rounded-full flex items-center"
        >
            <span><WalletIcon className="mr-1 h-5 w-5" /></span>
            <span>Connect Wallet</span>
        </button>
    );
}

const AddProduct = () => {
    return (
        <button
            type="button" 
            className= "hover:bg-white bg-gradient-to-r from-purple-200 to-purple-gradient-2 text-header-purple font-semibold hover:text-white py-2 px-4 border border-header-purple hover:border-transparent rounded-full flex items-center"
        >
            <span className="hover:text-header-purple"><CirclePlusIcon className="mr-1" /></span>
            <span className="font-thin text-white hover:text-header-purple">List a Product</span>
        </button>
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
