import { ConnectButton } from "../../components/ConnectButton";

export const ConnectMessage = () => {
  return (
    <div className="flex flex-col justify-center space-y-4 my-8 items-center pt-10">
      <span className="text-xl font-medium text-white sm:tracking-tight">
        Connect your wallet to see your NFTs
      </span>
      <div>
        <ConnectButton />
      </div>
    </div>
  );
};
