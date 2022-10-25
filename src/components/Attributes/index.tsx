import { useHistory, Link } from "react-router-dom";
import { useState } from "react";
import {
  SearchIcon,
  ClipboardCopyIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/outline";
import * as ROUTES from "../../constants/routes";
import { useTooltipState, Tooltip, TooltipArrow, TooltipReference } from "reakit/Tooltip";
import { encodeFiltersToUrl } from "../../utils";
import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";

export interface AttributesProps {
  data: any;
  mint: string;
  collection?: string;
}

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters {...props} />)(
  ({ theme }) => ({
    backgroundColor: "transparent",
    borderRadius: 10,
    boxShadow: "none",
    padding: 0,
    marginTop: 5,
  })
);

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary {...props} />
))(({ theme }) => ({
  flexDirection: "row-reverse",
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({}));

const accorAttLS = localStorage.getItem("accorPanel1") == "panel1" ? false : "panel1";
const accorMintLS = localStorage.getItem("accorPanel2") == "panel2" ? false : "panel2";

export const Attributes: React.FC<AttributesProps> = ({ data, mint, collection }) => {
  const tooltipCopy = useTooltipState();
  const [copied, setCopied] = useState<boolean>(false);
  const history = useHistory();
  const [expandedPanel1, setExpandedPanel1] = useState<string | false>(accorAttLS);
  const [expandedPanel2, setExpandedPanel2] = useState<string | false>(accorMintLS);

  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string | null;
  }>();

  const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    if (panel === "panel1") {
      setExpandedPanel1(newExpanded ? panel : false);
      localStorage.setItem("accorPanel1", expandedPanel1.toString());
    } else {
      setExpandedPanel2(newExpanded ? panel : false);
      localStorage.setItem("accorPanel2", expandedPanel2.toString());
    }
  };

  const addSelectedFilter = (
    filterName: string,
    selectedFilter: {
      value: any;
      label: string;
    }
  ) => {
    // @ts-ignore
    if (selectedFilters?.[filterName]) {
      delete selectedFilters[filterName];
      setSelectedFilters({
        ...selectedFilters,
      });
      console.log(selectedFilters);
    } else {
      if (!!selectedFilter) {
        setSelectedFilters({
          ...selectedFilters,
          [filterName]: selectedFilter.value,
        });
      } else {
        setSelectedFilters({
          ...selectedFilters,
          [filterName]: null,
        });
      }
    }
  };

  const copyLink = () => {
    setCopied(true);
    navigator.clipboard.writeText(`${mint}`);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const getOffersByAttributes = () => {
    if (selectedFilters && Object.keys(selectedFilters).length > 0) {
      const encodedFilters = encodeFiltersToUrl(selectedFilters);
      history.push(`${ROUTES.COLLECTIONS}/${collection}?${encodedFilters}`);
    }
  };

  return (
    <div>
      {data && (
        <Accordion expanded={expandedPanel1 === "panel1"} onChange={handleChange("panel1")}>
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <div className="grid grid-cols-2 w-full">
              <div className="text-white text-lg uppercase text-left">Attributes</div>
              <ChevronDownIcon
                className={
                  expandedPanel1 === "panel1"
                    ? "w-5 justify-self-end self-center text-white transition-transform transform rotate-180"
                    : "w-5 justify-self-end self-center text-white transition-transform transform rotate-0"
                }
              />
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              {( data.length > 0 &&
                data.map((trait: any, index: number) => {
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        addSelectedFilter(trait.trait_type, trait);
                      }}
                      className={
                        !!selectedFilters?.[trait.trait_type]
                          ? "flex justify-between w-full shadow-xl mb-1 bg-color-main-gray-lighter rounded-lg border-2 border-color-main-gray-medium hover:bg-color-main-gray-medium"
                          : "flex justify-between w-full shadow-xl mb-1 bg-transparent opacity-70 rounded-lg border-2 border-color-main-gray-medium hover:bg-color-main-gray-medium"
                      }
                    >
                      <div className="text-sm p-3 text-left whitespace-nowrap text-gray-400">
                        {trait.trait_type}
                      </div>
                      <div className="text-sm p-3 text-right w-full text-white truncate ...">
                        {trait.value}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
            {data.length > 0 ? (
              <div className="grid grid-cols-1 justify-items-center gap-4 py-2 rounded-lg">
                <button
                  onClick={() => {
                    getOffersByAttributes();
                  }}
                  className="btn inline-flex w-full items-center text-sm font-base p-2 font-normal"
                  disabled={
                    !!selectedFilters && Object.keys(selectedFilters).length > 0 ? false : true
                  }
                >
                  <SearchIcon className="p-1 w-8 mr-2" />
                  <span>
                    {!!selectedFilters && Object.keys(selectedFilters).length > 0
                      ? "Search with Selected Attributes"
                      : "Select Attributes to Search"}
                  </span>
                </button>
              </div>
            ) : (
              data.trait_type ? (
                <button
                  className="flex justify-between w-full shadow-xl mb-1 bg-transparent opacity-70 rounded-lg border-2 border-color-main-gray-medium hover:bg-color-main-gray-medium"
                >
                  <div className="text-sm p-3 text-left whitespace-nowrap text-gray-400">
                    {data.trait_type}
                  </div>
                  <div className="text-sm p-3 text-right w-full text-white truncate ...">
                    {data.value}
                  </div>
                </button>
              ) : (
              <div className="text-white text-xs text-left opacity-60">
                No attributes to display
              </div>
              )
            )}
          </AccordionDetails>
        </Accordion>
      )}
      <hr className="opacity-20" />
      <Accordion expanded={expandedPanel2 === "panel2"} onChange={handleChange("panel2")}>
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <div className="grid grid-cols-2 w-full">
            <div className="text-white text-lg uppercase text-left">mint id</div>
            <ChevronDownIcon
              className={
                expandedPanel2 === "panel2"
                  ? "w-5 justify-self-end self-center text-white transition-transform transform rotate-180"
                  : "w-5 justify-self-end self-center text-white transition-transform transform rotate-0"
              }
            />
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="flex items-center">
            <Link
              to={{
                pathname: `https://explorer.solana.com/address/${mint}`,
              }}
              className="text-blue-500 text-sm flex-auto text-left truncate ..."
              target="_blank"
              rel="noreferrer"
            >
              {mint}
            </Link>
            <button
              className="hover:text-white w-full justify-end	flex-1"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                copyLink();
              }}
            >
              <TooltipReference {...tooltipCopy}>
                <span className="text-white self-end">
                  <ClipboardCopyIcon className="h-5 w-5 m-2" />
                </span>
              </TooltipReference>
              <Tooltip {...tooltipCopy} style={{ background: "none" }}>
                <div className="bg-black text-xs p-2 rounded-md">
                  <TooltipArrow {...tooltipCopy} />
                  {copied ? "Copied :)" : "Copy Link"}
                </div>
              </Tooltip>
            </button>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
