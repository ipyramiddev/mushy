import React, { useEffect, useState, useMemo } from "react";
import { useWallet } from "../../contexts/wallet";
// import { useAnchorWallet } from "@solana/wallet-adapter-react";
import Countdown from "react-countdown";
import { CircularProgress, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import * as anchor from "@project-serum/anchor";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintOneToken,
  shortenAddress,
} from "../../candy-machine";

export interface MintButtonProps {
  candyMachineId: anchor.web3.PublicKey;
  config: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  treasury: anchor.web3.PublicKey;
  txTimeout: number;
}

const MintButton = (props: MintButtonProps) => {
  const { wallet } = useWallet();
  const [isSoldOut, setIsSoldOut] = useState(false); // true when items remaining is zero
  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT
  const [itemsRemaining, setItemsRemaining] = useState(0);
  const [itemsRedeemed, setItemsRedeemed] = useState(0);
  const [itemsAvailable, setItemsAvailable] = useState(0);
  const [percentComplete, setPercentComplete] = useState(0);
  const [startDate, setStartDate] = useState(new Date(props.startDate));
  const isLive = useMemo(() => startDate <= new Date(), [startDate]);

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  // const wallet = useAnchorWallet();
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();

  const refreshCandyMachineState = () => {
    (async () => {
      if (!wallet) return;

      const { candyMachine, goLiveDate, itemsAvailable, itemsRemaining, itemsRedeemed } =
        await getCandyMachineState(
          wallet as unknown as anchor.Wallet,
          props.candyMachineId,
          props.connection
        );
      setPercentComplete((itemsRedeemed / itemsAvailable) * 100);
      setItemsRedeemed(itemsRedeemed);
      setItemsRemaining(itemsRemaining);
      setItemsAvailable(itemsAvailable);
      setIsSoldOut(itemsRemaining === 0);
      setStartDate(goLiveDate);
      setCandyMachine(candyMachine);
    })();
  };

  const onMint = async () => {
    try {
      setIsMinting(true);
      if (wallet && candyMachine?.program) {
        const mintTxId = await mintOneToken(
          candyMachine,
          props.config,
          wallet.publicKey!,
          props.treasury
        );

        const status = await awaitTransactionSignatureConfirmation(
          mintTxId,
          props.txTimeout,
          props.connection,
          "singleGossip",
          false
        );

        if (!status?.err) {
          setAlertState({
            open: true,
            message: "Congratulations! Mint succeeded!",
            severity: "success",
          });
        } else {
          setAlertState({
            open: true,
            message: "Mint failed! Please try again!",
            severity: "error",
          });
        }
      }
    } catch (error: any) {
      // TODO: blech:
      let message = error.msg || "Minting failed! Please try again!";
      if (!error.msg) {
        if (error.message.indexOf("0x138")) {
        } else if (error.message.indexOf("0x137")) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135")) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          setIsSoldOut(true);
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setIsMinting(false);
      refreshCandyMachineState();
    }
  };

  useEffect(refreshCandyMachineState, [wallet, props.candyMachineId, props.connection]);

  return (
    <div className="w-full">
      <div>
        {!wallet || !wallet!.publicKey ? (
          <p> Connect your Wallet </p>
        ) : (
          <React.Fragment>
            <button
              id="addToCartButton"
              className="btn"
              onClick={onMint}
              disabled={isSoldOut || isMinting || !isLive}
            >
              {isSoldOut ? (
                "SOLD OUT"
              ) : isLive ? (
                isMinting ? (
                  <CircularProgress />
                ) : (
                  "MINT"
                )
              ) : (
                <Countdown
                  date={startDate}
                  onComplete={() => refreshCandyMachineState()}
                  renderer={renderCounter}
                />
              )}
            </button>{" "}
          </React.Fragment>
        )}
      </div>
      {!!wallet && (
        <div className="relative pt-1 mt-5 w-full">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                {isLive && !isSoldOut ? "Mint in Progress" : "Not Active"}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-purple-600">
                {itemsRedeemed} MINTED
              </span>
            </div>
          </div>
          <div
            className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200"
            style={{ width: percentComplete + "%" }}
          >
            <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"></div>
          </div>
        </div>
      )}

      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error" | undefined;
}

const renderCounter = ({ days, hours, minutes, seconds, completed }: any) => {
  return (
    <div>
      {hours + (days || 0) * 24} hours, {minutes} minutes, {seconds} seconds
    </div>
  );
};

export default MintButton;
