import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import React from "react";
import { useNativeAccount } from "../../contexts/accounts";
import { useWallet } from "../../contexts/wallet";
import { getDomainList } from "../../utils/getDomainList";
import { formatNumber, shortenAddress } from "../../utils/utils";

export const CurrentUserBadge = (props: {}) => {
  const { wallet } = useWallet();
  const { account } = useNativeAccount();

  if (!wallet?.publicKey) {
    return null;
  }

  // should use SOL ◎ ?

  return (
    <div className="font-medium space-x-2 text-white">
      <span>
        {formatNumber.format((account?.lamports || 0) / LAMPORTS_PER_SOL)} ◎
      </span>
      <span className="wallet-key">
        {wallet?.domainNames
          ? getDomainList(wallet?.domainNames)
          : shortenAddress(`${wallet.publicKey}`)}
      </span>
    </div>
  );
};
