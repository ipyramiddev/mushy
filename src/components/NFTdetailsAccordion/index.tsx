import { useHistory, Link } from "react-router-dom";
import { useState } from "react";
import { SearchIcon, ClipboardCopyIcon, ChevronDownIcon } from "@heroicons/react/outline";
import * as ROUTES from "../../constants/routes";
import { useTooltipState, Tooltip, TooltipArrow, TooltipReference } from "reakit/Tooltip";
import { encodeFiltersToUrl } from "../../utils";
import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import dayjs from "dayjs";
import { shortenAddress } from "../../utils";
import { LAMPORTS_PER_SOL } from "../../constants";

export interface NFTDetailsAccordionProps {
  collection?: string;
  salesHistoryData?: any;
  offerData?: any;
  collDesc?: string;
}

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters {...props} />)(
  ({ theme }) => ({
    backgroundColor: "transparent",
    borderRadius: 10,
    marginTop: 5,
    padding: 0,
    boxShadow: 'none'
  })
);

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary {...props} />
))(({ theme }) => ({
  flexDirection: "row-reverse",
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({}));

const pan1LS = localStorage.getItem("accorPan1") == "pan1" ? false : "pan1";
const pan2LS = localStorage.getItem("accorPan2") == "pan2" ? false : "pan2";
const pan3LS = localStorage.getItem("accorPan3") == "pan3" ? false : "pan3";

export const NFTDetailsAccordion: React.FC<NFTDetailsAccordionProps> = ({
  collection,
  salesHistoryData,
  offerData,
  collDesc,
}) => {
  const tooltipCopy = useTooltipState();
  const [copied, setCopied] = useState<boolean>(false);
  const history = useHistory();
  const [expandedPan1, setExpandedPan1] = useState<string | false>(pan1LS);
  const [expandedPan2, setExpandedPan2] = useState<string | false>(pan2LS);
  const [expandedPan3, setExpandedPan3] = useState<string | false>(pan3LS);
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string | null;
  }>();

  const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    if (panel === "pan1") {
      setExpandedPan1(newExpanded ? panel : false);
      localStorage.setItem("accorPan1", expandedPan1.toString());
    } else if (panel === "pan2") {
      setExpandedPan2(newExpanded ? panel : false);
      localStorage.setItem("accorPan2", expandedPan2.toString());
    } else {
      setExpandedPan3(newExpanded ? panel : false);
      localStorage.setItem("accorPan3", expandedPan3.toString());
    }
  };

  return (
    <div className="mb-10">
      {offerData && (
        <Accordion expanded={expandedPan1 === "pan1"} onChange={handleChange("pan1")}>
          <AccordionSummary aria-controls="pan1d-content" id="pan1d-header">
            <div className="grid grid-cols-2 w-full">
              <div className="text-white text-lg uppercase text-left">Offers</div>
              <ChevronDownIcon
                className={
                  expandedPan1 === "pan1"
                    ? "w-5 justify-self-end self-center text-white transition-transform transform rotate-180"
                    : "w-5 justify-self-end self-center text-white transition-transform transform rotate-0"
                }
              />
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className="py-8 text-white text-md text-left opacity-50"></div>
          </AccordionDetails>
        </Accordion>
      )}

      {!!collDesc && (
        <>
          <Accordion expanded={expandedPan2 === "pan2"} onChange={handleChange("pan2")}>
            <AccordionSummary aria-controls="pan2d-content" id="pan2d-header">
              <div className="grid grid-cols-2 w-full">
                <div className="text-white text-lg uppercase text-left">About the Collection</div>
                <ChevronDownIcon
                  className={
                    expandedPan2 === "pan2"
                      ? "w-5 justify-self-end self-center text-white transition-transform transform rotate-180"
                      : "w-5 justify-self-end self-center text-white transition-transform transform rotate-0"
                  }
                />
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="pb-6 leading-loose col-span-2 text-sm text-left text-white opacity-50">
                {collDesc}
              </div>
            </AccordionDetails>
          </Accordion>
        </>
      )}

      {!!salesHistoryData && (
        <>
          {collDesc && (
            <hr className="opacity-20" />
          )}
          <Accordion expanded={expandedPan3 === "pan3"} onChange={handleChange("pan3")}>
            <AccordionSummary aria-controls="pan3d-content" id="pan3d-header">
              <div className="grid grid-cols-2 w-full">
                <div className="text-white text-lg uppercase text-left">Sales History</div>
                <ChevronDownIcon
                  className={
                    expandedPan3 === "pan3"
                      ? "w-5 justify-self-end self-center text-white transition-transform transform rotate-180"
                      : "w-5 justify-self-end self-center text-white transition-transform transform rotate-0"
                  }
                />
              </div>
            </AccordionSummary>
            <AccordionDetails>
              {salesHistoryData.length > 0 ? (
                <>
                  <div className="flex justify-between ">
                    <span className="w-2/6 text-gray-400 text-xxs uppercase">Date</span>
                    <span className="w-2/6 text-gray-400 text-xxs uppercase flex justify-center">
                      Transaction
                    </span>
                    <span className="w-2/6 text-gray-400 text-xxs uppercase flex justify-end">
                      Price
                    </span>
                  </div>
                  {salesHistoryData.map((sale: any) => (
                    <div className="text-gray-400 mt-2 text-sm leading-loose flex justify-between font-light overflow-ellipsis overflow-hidden">
                      <span className="w-2/6 text-color-main-secondary">
                        {dayjs(sale.timestamp * 1000).format("hh:mm MMMM DD")}
                      </span>
                      <span className="w-2/6 flex justify-center">
                        <Link
                          to={{
                            pathname: `https://explorer.solana.com/tx/${sale?.metadata?.signature}`,
                          }}
                          className="text-blue-500"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {shortenAddress(sale?.metadata?.signature)}
                        </Link>
                      </span>
                      <span className="w-2/6 flex justify-end text-color-main-secondary">
                        {Number(sale?.metadata?.price) / LAMPORTS_PER_SOL} SOL
                      </span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="">
                  <span className="text-gray-400 text-sm leading-loose">No data available</span>
                </div>
              )}
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </div>
  );
};
