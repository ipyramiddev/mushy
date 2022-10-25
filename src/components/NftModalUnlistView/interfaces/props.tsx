import { ActiveOffer } from "../../../types";

export interface NftModalViewProps {
	offer: ActiveOffer;
	modalCard: boolean;
	modalCardToggleHandler: any;
	modalCardSuccessHandler: any;
	disputedMessage: string;
}
