import { MintInfo } from "@solana/spl-token";
import { TokenInfo } from "@solana/spl-token-registry";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { useCallback, useState } from "react";
import { WAD, ZERO } from "../constants";
import { COLLECTIONS_NAME_ENUM } from "../constants/collections";
import { STRING_API_URL, VERIFY_SIGNATURE } from "../constants/urls";
import escrow from "../constants/escrow";
import { ENDPOINTS } from "../contexts/connection";
import { Collection, EscrowInfo, MetadataAttribute } from "../types";
import { TokenAccount } from "../models";
import { CollectionMetadataFilter } from "../views/collections";
import bs58 from "bs58";
import { toast } from "react-toastify";

export type KnownTokenMap = Map<string, TokenInfo>;

export const formatPriceNumber = new Intl.NumberFormat("en-US", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 8,
});

export function useLocalStorageState(key: string, defaultState?: string) {
  const [state, setState] = useState(() => {
    // NOTE: Not sure if this is ok
    const storedState = localStorage.getItem(key);
    if (storedState) {
      return JSON.parse(storedState);
    }
    return defaultState;
  });

  const setLocalStorageState = useCallback(
    (newState) => {
      const changed = state !== newState;
      if (!changed) {
        return;
      }
      setState(newState);
      if (newState === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newState));
      }
    },
    [state, key]
  );

  return [state, setLocalStorageState];
}

export const findProgramAddress = async (seeds: (Buffer | Uint8Array)[], programId: PublicKey) => {
  const key =
    "pda-" + seeds.reduce((agg, item) => agg + item.toString("hex"), "") + programId.toString();
  let cached = localStorage.getItem(key);
  if (cached) {
    const value = JSON.parse(cached);

    return [new PublicKey(value.key), parseInt(value.nonce)] as [PublicKey, number];
  }

  const result = await PublicKey.findProgramAddress(seeds, programId);

  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        key: result[0].toBase58(),
        nonce: result[1],
      })
    );
  } catch {
    // ignore
  }
  console.log();

  return [result[0], result[1]] as [PublicKey, number];
};

// shorten the checksummed version of the input address to have 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function getTokenName(
  map: KnownTokenMap,
  mint?: string | PublicKey,
  shorten = true
): string {
  const mintAddress = typeof mint === "string" ? mint : mint?.toBase58();

  if (!mintAddress) {
    return "N/A";
  }

  const knownSymbol = map.get(mintAddress)?.symbol;
  if (knownSymbol) {
    return knownSymbol;
  }

  return shorten ? `${mintAddress.substring(0, 5)}...` : mintAddress;
}

export function getTokenByName(tokenMap: KnownTokenMap, name: string) {
  let token: TokenInfo | null = null;
  for (const val of tokenMap.values()) {
    if (val.symbol === name) {
      token = val;
      break;
    }
  }
  return token;
}

export function getTokenIcon(
  map: KnownTokenMap,
  mintAddress?: string | PublicKey
): string | undefined {
  const address = typeof mintAddress === "string" ? mintAddress : mintAddress?.toBase58();
  if (!address) {
    return;
  }

  return map.get(address)?.logoURI;
}

export function isKnownMint(map: KnownTokenMap, mintAddress: string) {
  return !!map.get(mintAddress);
}

export const STABLE_COINS = new Set(["USDC", "wUSDC", "USDT"]);

export function chunks<T>(array: T[], size: number): T[][] {
  return Array.apply<number, T[], T[][]>(0, new Array(Math.ceil(array.length / size))).map(
    (_, index) => array.slice(index * size, (index + 1) * size)
  );
}

export function toLamports(account?: TokenAccount | number, mint?: MintInfo): number {
  if (!account) {
    return 0;
  }

  const amount = typeof account === "number" ? account : account.info.amount?.toNumber();

  const precision = Math.pow(10, mint?.decimals || 0);
  return Math.floor(amount * precision);
}

export function wadToLamports(amount?: BN): BN {
  return amount?.div(WAD) || ZERO;
}

export function fromLamports(
  account?: TokenAccount | number | BN,
  mint?: MintInfo,
  rate: number = 1.0
): number {
  if (!account) {
    return 0;
  }

  const amount = Math.floor(
    typeof account === "number"
      ? account
      : BN.isBN(account)
      ? account.toNumber()
      : account.info.amount.toNumber()
  );

  const precision = Math.pow(10, mint?.decimals || 0);
  return (amount / precision) * rate;
}

var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

const abbreviateNumber = (number: number, precision: number) => {
  let tier = (Math.log10(number) / 3) | 0;
  let scaled = number;
  let suffix = SI_SYMBOL[tier];
  if (tier !== 0) {
    let scale = Math.pow(10, tier * 3);
    scaled = number / scale;
  }

  return scaled.toFixed(precision) + suffix;
};

export const formatAmount = (val: number, precision: number = 6, abbr: boolean = true) =>
  abbr ? abbreviateNumber(val, precision) : val.toFixed(precision);

export function formatTokenAmount(
  account?: TokenAccount,
  mint?: MintInfo,
  rate: number = 1.0,
  prefix = "",
  suffix = "",
  precision = 6,
  abbr = false
): string {
  if (!account) {
    return "";
  }

  return `${[prefix]}${formatAmount(fromLamports(account, mint, rate), precision, abbr)}${suffix}`;
}

export const formatUSD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const numberFormatter = new Intl.NumberFormat("en-US", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const isSmallNumber = (val: number) => {
  return val < 0.001 && val > 0;
};

export const formatNumber = {
  format: (val?: number, useSmall?: boolean) => {
    if (!val) {
      return "--";
    }
    if (useSmall && isSmallNumber(val)) {
      return 0.001;
    }

    return numberFormatter.format(val);
  },
};

export const feeFormatter = new Intl.NumberFormat("en-US", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 9,
});

export const formatPct = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function convert(
  account?: TokenAccount | number,
  mint?: MintInfo,
  rate: number = 1.0
): number {
  if (!account) {
    return 0;
  }

  const amount = typeof account === "number" ? account : account.info.amount?.toNumber();

  const precision = Math.pow(10, mint?.decimals || 0);
  let result = (amount / precision) * rate;

  return result;
}

export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export function isValidHttpUrl(text: string) {
  let url;

  try {
    url = new URL(text);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

export function getEndPointName(endpoint: string) {
  return ENDPOINTS.find((end) => end.endpoint === endpoint)?.name;
}

export function getEscrowContract(endpoint: string, contract?: string) {
  const endpointName = getEndPointName(endpoint) as string;
  if (contract) {
    const contractName = Object.keys(escrow).filter(
      (key) => escrow[key][endpointName].escrowProgram === contract
    )[0];
    return escrow[contractName][endpointName];
  }
  return escrow["global"][endpointName];
}

export function getAllEscrowContracts(endpoint: string) {
  const endpointName = getEndPointName(endpoint) as string;
  return Object.keys(escrow).map((key: string) => {
    return escrow[key][endpointName];
  });
}

export function getEscrowFromCollectionName(endpoint: string, collectionName?: string) {
  const endpointName = getEndPointName(endpoint) as string;
  const contractName = Object.keys(escrow).filter((key) => key === collectionName)[0];
  if (contractName) {
    return escrow[contractName][endpointName];
  }
}

export function getCreatorFromCustomContract(endpoint: string, escrowProgramId: string) {
  const endpointName = getEndPointName(endpoint) as string;
  const contractName = Object.keys(escrow).filter(
    (key) => escrow[key][endpointName].escrowProgram === escrowProgramId
  )[0];
  console.log(contractName);
  if (contractName !== "global") {
    return escrow[contractName][endpointName].creator;
  }
}

export function getPriceFloor(offers: any) {
  if (offers.length) {
    const minOffer = offers.reduce(function (prev: any, curr: any) {
      return prev.price < curr.price ? prev : curr;
    });
    return minOffer.price;
  }
}

export const isSolarian = (collectionName?: string): boolean => {
  return collectionName?.toLowerCase() === COLLECTIONS_NAME_ENUM.SOLARIANS;
};

export const getTraitValueByKey = (traitKey: string, attributes: MetadataAttribute[]) =>
  attributes.find((attribute) => attribute["trait_type"] === traitKey)?.value;

export const removeDuplicates = (arr: any[]) =>
  arr.filter((i) => arr.indexOf(i) === arr.lastIndexOf(i));

export const findCollection = (collections: Collection[], collectionName: string): any => {
  if (!collectionName) return null;
  return collections.find(
    (collection: any) => collection.name.toLowerCase() === collectionName.toLowerCase()
  );
};

export const sortBy = (arr: any[], k: string) =>
  arr.concat().sort((a, b) => (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0));

export const removeNullValuesFromObject = (params: any) =>
  Object.keys(params)
    .filter((key) => !!params[key])
    .reduce(
      (queryParams, key) => ({
        ...queryParams,
        [key]: String(params[key]),
      }),
      {} as { [key: string]: string }
    );

export const mapObjectQueryParams = (params: any) => {
  return Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join("&");
};

export const kFormatter = (num: any) => {
  if (num > 999 && num < 1000000) {
    return (num / 1000).toFixed(1) + "K"; // convert to K for number from > 1000 < 1 million
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"; // convert to M for number from > 1 million
  } else if (num <= 999) {
    return num % 1 === 0 ? num : num.toFixed(2); // if value < 1000, nothing to do
  }
};

export const getFiltersFromUrl = ({
  filtersFromUrl,
  collectionFilters,
}: {
  filtersFromUrl: string;
  collectionFilters: CollectionMetadataFilter[];
}) => {
  // Decode filter string from URI
  const decodedFilters = decodeURI(filtersFromUrl);
  const filters = decodedFilters.split("&");
  const filtersToApply: { [key: string]: string } = {};
  filters.forEach((filter) => {
    const [key, value] = filter.split("=");
    filtersToApply[key] = value;
  });

  // Select only valid filters in collection
  const validFilterKeys = Object.keys(filtersToApply).filter((f) =>
    collectionFilters?.some((mdf) => mdf.name === f && mdf.values.includes(filtersToApply[f]))
  );
  const validInitialFilters = Object.keys(filtersToApply)
    .filter((key) => validFilterKeys.includes(key))
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: filtersToApply[key],
      };
    }, {});
  return validInitialFilters;
};

export const encodeFiltersToUrl = (filtersToEncode: { [key: string]: string | null }) => {
  const filters = Object.keys(filtersToEncode)
    .filter((key) => !!filtersToEncode[key])
    .map((key) => `${key}=${filtersToEncode[key]}`)
    .join("&");
  return encodeURI(filters);
};

export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: any, value: any) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

export const authApiRequest = async (
  URL: string,
  params: any,
  method: string,
  cType: string,
  wallet: any
) => {
  const authBearer = localStorage.getItem(`soloAuth${wallet?.publicKey.toString()}`)
    ? JSON.parse(localStorage.getItem(`soloAuth${wallet?.publicKey.toString()}`) as string)
        .jwt_token
    : [];
  try {
    const apiAck = await fetch(URL, {
      method: `${method}`,
      headers: {
        "content-Type": `${cType}`,
        Authorization: `Bearer ${authBearer}`,
      },
      body: JSON.stringify(params),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        if (res.status == 401) {
          toast("invalid or expired authentication \n authenticate again", {
            toastId: 401,
            position: "top-right",
            autoClose: 5000,
          });
        }

        throw {
          status: res.status,
        };
      }
    });
  } catch (e) {
    if (e.status == 401) {
      try {
        if (!wallet.publicKey) throw new Error("Wallet not connected!");

        const stringPublicKey = wallet.publicKey.toString();

        const randomString = await fetch(STRING_API_URL, {
          method: "POST",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify({ wallet_key: stringPublicKey }),
        }).then((res) => res.json());

        const signMessage = await wallet.signMessage(
          new TextEncoder().encode(randomString?.random_string)
        );

        const signature = {
          signature: bs58.encode(signMessage),
          wallet_key: wallet?.publicKey.toString(),
        };
        const JWT = await fetch(VERIFY_SIGNATURE, {
          method: "POST",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify(signature),
        }).then((res) => res.json());

        localStorage.setItem(`soloAuth${stringPublicKey}`, JSON.stringify(JWT));
        toast.info("authentication complete", {
          position: "top-right",
          autoClose: 5000,
        });

        authApiRequest(URL, params, method, cType, wallet);
      } catch (e) {
        console.log(e);
      }
    }
  }
};

const AUDIO_EXTENSIONS = new Set(["mp3", "wav", "mp3g", "aac", "aacp", "ogg", "flac"]);
export const extensionIsAudio = (extension: string | null | undefined): boolean =>
  extension !== null && extension !== undefined && AUDIO_EXTENSIONS.has(extension);
