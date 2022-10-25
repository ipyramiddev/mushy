import { useHistory } from "react-router-dom";
import { useState } from "react";
import * as ROUTES from "../../constants/routes";
// @ts-ignore-next-line
import { IKImage } from "imagekitio-react";
import { getImagePath, IMAGE_KIT_ENDPOINT_URL, isImageInCache } from "../../constants/images";
import Masonry from "react-masonry-css";


export interface CreationsMasonryProps {
  array: any;
}

export const CreationsMasonry: React.FC<CreationsMasonryProps> = ({ array }) => {
  const history = useHistory();
  const masonryItems = array?.map(function (item:any, index:number) {
    const goToNFT = (e: any) => {
      if (Boolean(e.ctrlKey || e.metaKey || e.button === 1)) {
        window.open(
          `${window.location.origin}${ROUTES.ITEM}/${item.mint}`
        );
      } else {
        history.push(`${ROUTES.ITEM}/${item.mint}`);
      }
    };

    return (
      <div
        className="mt-1 hover:opacity-60 cursor-pointer"
        key={index}
        onClick={goToNFT}
        >
        {" "}
        {/**<IKImage
          urlEndpoint={IMAGE_KIT_ENDPOINT_URL}
          path={item?.image}
          alt="digital eyes cant find"
        />*/}
        <img
          src={item?.image}
          className="w-full"
        />
      </div>
    );
  });
  return (
    <div>
    <Masonry
      breakpointCols={3}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
    {masonryItems}
      {/**creations?.map(function (item, index) {
        return (
          <div className="mt-1" key={index}>
            {" "}
            <IKImage
              urlEndpoint={IMAGE_KIT_ENDPOINT_URL}
              path={item?.image}
              alt="digital eyes cant find"
            />
          </div>
        );
      })*/}
    </Masonry>

      </div>

  );
};
