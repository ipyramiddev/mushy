import { ActiveOffer } from "../../../types";

export interface NftModalViewProps {
	offer: ActiveOffer;
	modalCard: boolean;
	modalCardToggleHandler:  () => void;
	modalCardSuccessHandler?:  () => void,
}
