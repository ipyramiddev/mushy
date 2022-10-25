import { formatNumber } from "../../utils";
import { ActiveOffer } from "../../types";

export interface NftRoyaltyCalculatorProps {
  offer: ActiveOffer;
  listingPrice: number;
}

export const NftRoyaltyCalculator: React.FC<NftRoyaltyCalculatorProps> = ({ offer, listingPrice }) => {
  const sellerFeeBasis = offer.metadata?.seller_fee_basis_points || 0;
  const marketFee = .025; //percent
  const finalMarketFee: number = listingPrice * marketFee;
  const sellerFee: number = listingPrice * (sellerFeeBasis * .0001);
  const finalPrice: number = Number(listingPrice) - Number(finalMarketFee) - Number(sellerFee);
  return (
    <>
     { listingPrice > 0 && (
       <>
       <p className="mt-4 text-xxs text-white">Fees & Royalties:</p>
        <table className="mt-2 mb-4">
          <tbody className="text-sm text-gray-500 font-light">
            { (sellerFeeBasis > 0) && (
              <tr className="mb-1">
                <td className="pr-2">Royalties:</td>
                <td className="pr-2">{ formatNumber.format(sellerFee)} SOL ({Number(sellerFeeBasis * .01).toFixed(1)}%)</td>
              </tr>
            )}
            <tr className="mb-1">
              <td className="pr-2">Service fee:</td>
              <td className="pr-2">{ formatNumber.format(finalMarketFee)} SOL (2.5%)</td>
            </tr>
            <tr className="mb-1">
              <td className="pr-2">Upon sale, you get:</td>
              <td className="pr-2">{ formatNumber.format(finalPrice)} SOL</td>
            </tr>
          </tbody>
        </table>
      </>
      )}
    </>
  );
};
