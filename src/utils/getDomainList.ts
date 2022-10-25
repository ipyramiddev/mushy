import { DomainNames } from "./name-service";

export const getDomainList = (domainNames: (DomainNames | undefined)[] | undefined) => {
  return domainNames?.map((domain, idx) =>
    domainNames[idx]?.name && idx + 1 < domainNames?.length
      ? `${domain?.name.toUpperCase()}.SOL, `
      : `${domain?.name.toUpperCase()}.SOL`
  );
};
