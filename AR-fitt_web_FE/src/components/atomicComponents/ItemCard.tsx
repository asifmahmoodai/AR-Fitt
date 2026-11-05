/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { Grid, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import {
  setOpenCameraModule,
  setSelectedItem,
} from "../../redux/main/mainActions";
import { getProductImageUrl } from "../../utils/productImage";

interface ItemCardProps {
  item: any;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Redux Store Variables
  const selectedCategory = useSelector(
    (state: RootState) => state.main.selectedCategory
  );
  const [imageSource, setImageSource] = useState<any>(null);

  // Handles the Item Image
  const validateImage = async (url: string) => {
    const defaultImage = "/assets/images/placeHolderImage.jpeg";
    try {
      const response = await fetch(url);
      const contentType = response.headers.get("content-type");
      if (response.ok && contentType && contentType.startsWith("image/")) {
        return url;
      } else {
        return defaultImage;
      }
    } catch {
      return defaultImage;
    }
  };


  console.log(item);
  console.log("Items image");

  const getRenderableImage = async () => {
    const imageUrl = getProductImageUrl(item?.itemImagesURLs?.[0]?.imageURL);
    const validatedImageSource = imageUrl
      ? await validateImage(imageUrl)
      : "/assets/images/placeHolderImage.jpeg";

    setImageSource(validatedImageSource);
  };
  const handleItemClick = () => {
    dispatch(setSelectedItem(item));
    navigate(
      `/home/item?type=${selectedCategory.type}&categoryName=${selectedCategory.category.name}&categoryId=${selectedCategory.category.id}&itemId=${item.id}`
    );
  };

  useEffect(() => {
    getRenderableImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  return (
    <Grid
      item
      onClick={() => handleItemClick()}
      className="flex flex-col w-full h-full border-solid border-2 border-gray-200 rounded-[20px] overflow-hidden cursor-pointer"
    >
      <img
        className="w-full h-[70%] object-cover"
        src={imageSource}
        alt="item image"
      />
      {/* Item Main Desc */}
      <Box className="flex w-full p-4 justify-start items-center">
        <Grid
          className="flex gap-2 items-end justify-between"
          style={{ width: "calc(100% - 32px)" }}
        >
          {/* Text */}
          <Grid xs={5.5} className="flex flex-col gap-1 items-start">
            <p className="m-0 font-Montserrat text-sm">{item?.brand}</p>
            <p className="m-0 font-Montserrat text-xs">{item?.name}</p>
            <p className="m-0 font-Montserrat text-xs">${item?.price}</p>
          </Grid>
          {/* Try On Button */}
          <Grid
            xs={5.5}
            className="px-2 py-4 w-[35%] min-h-4 bg-primary rounded-md gap-3 flex items-center justify-center"
            onClick={(event) => {
              event.stopPropagation();
              dispatch(setOpenCameraModule(true));
              handleItemClick();
            }}
          >
            <img
              className="w-4"
              src="/assets/icons/png/camera.png"
              alt="camera"
            />
            <p className="m-0 font-Montserrat font-bold text-sm text-white text-center p-0 leading-[1]">
              TRY ON
            </p>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default ItemCard;
