import { PublicKey, Connection } from "@solana/web3.js";
import {
  getTwitterRegistry,
  getHashedName,
  getNameAccountKey,
  NameRegistryState,
  getFilteredProgramAccounts,
  NAME_PROGRAM_ID,
} from "@bonfida/spl-name-service";
import BN from "bn.js";

// Address of the SOL TLD
export const SOL_TLD_AUTHORITY = new PublicKey("58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx");

export const PROGRAM_ID = new PublicKey("jCebN34bUfdeUYJT13J1yG16XWQpt5PDx6Mse9GUqhR");

export const resolveTwitterHandle = async (
  connection: Connection,
  twitterHandle: string
): Promise<string | undefined> => {
  try {
    const registry = await getTwitterRegistry(connection, twitterHandle);
    return registry.owner.toBase58();
  } catch (err) {
    console.warn(`err`);
    return undefined;
  }
};

export const resolveDomainName = async (
  connection: Connection,
  domainName: string
): Promise<string | undefined> => {
  let hashedDomainName = await getHashedName(domainName);
  let inputDomainKey = await getNameAccountKey(hashedDomainName, undefined, SOL_TLD_AUTHORITY);
  try {
    const registry = await NameRegistryState.retrieve(connection, inputDomainKey);
    return registry.owner.toBase58();
  } catch (err) {
    console.warn(err);
    return undefined;
  }
};

export async function findOwnedNameAccountsForUser(
  connection: Connection,
  userAccount: PublicKey
): Promise<PublicKey[]> {
  const filters = [
    {
      memcmp: {
        offset: 32,
        bytes: userAccount.toBase58(),
      },
    },
  ];
  const accounts = await getFilteredProgramAccounts(connection, NAME_PROGRAM_ID, filters);
  return accounts.map((a) => a.publicKey);
}

export async function performReverseLookup(
  connection: Connection,
  nameAccount: PublicKey
): Promise<string> {
  let [centralState] = await PublicKey.findProgramAddress([PROGRAM_ID.toBuffer()], PROGRAM_ID);
  let hashedReverseLookup = await getHashedName(nameAccount.toBase58());
  let reverseLookupAccount = await getNameAccountKey(hashedReverseLookup, centralState);

  let name = await NameRegistryState.retrieve(connection, reverseLookupAccount);
  if (!name.data) {
    throw new Error("Could not retrieve name data");
  }
  let nameLength = new BN(name.data.slice(0, 4), "le").toNumber();
  return name.data.slice(4, 4 + nameLength).toString();
}

export interface DomainNames {
  name: any;
  nameKey: PublicKey;
}

export const getUserDomains = async (connection: Connection, nameAccount: PublicKey) => {
  const domains = await findOwnedNameAccountsForUser(connection, nameAccount);
  const getDomainName = async (domainAddress: any) => {
    try {
      const name = await performReverseLookup(connection, domainAddress);
      return { name: name, nameKey: domainAddress };
    } catch (err) {
      console.log(`Passing account ${domainAddress.toBase58()} - err ${err}`);
      return { name: undefined, nameKey: domainAddress };
    }
  };
  const promises = domains.map((domainAddress) => getDomainName(domainAddress));
  const domainNames = await Promise.all(promises);
  const filteredDomainArray = domainNames.filter((domain) => domain?.name);
  return filteredDomainArray?.length > 0
    ? filteredDomainArray.filter((domain) => domain?.name)
    : undefined;
};
