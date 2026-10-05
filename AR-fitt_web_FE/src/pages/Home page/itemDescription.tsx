import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import CameraPopUp from "../../components/cameraPopUp";
import ImageSlider from "../../components/atomicComponents/imageSlider";
import "react-image-gallery/styles/css/image-gallery.css";
import { setOpenCameraModule } from "../../redux/main/mainActions";
import AddToCartButton from "../../components/atomicComponents/AddToCartButton";
import { addToCart } from "../../redux/cart/cartActions";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const ItemDescription = () => {
  const dispatch = useDispatch();

  const [images, setImages] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<any>(
    undefined
  );
  const [selectedColor, setSelectedColor] = useState<any>();

  // Get logged in user details
  const loggedInUser = useSelector((state: any) => state.signup.userDetails);

  const selectedItem = useSelector(
    (state: RootState) => state.main.selectedItem
  );
  const openCameraModule = useSelector(
    (state: RootState) => state.main.openCameraModule
  );

  const handleClose = () => {
    dispatch(setOpenCameraModule(false));
  };
  const handleOpen = () => {
    dispatch(setOpenCameraModule(true));
  };
  const handleSelectedSize = (size: string) => {
    setSelectedSize(size);
  };
  const handleSelectedColor = (color: any) => {
    setSelectedColor(color);
  };
  const validateImages = async (urls: string[]) => {
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

    return await Promise.all(urls.map((url) => validateImage(url)));
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;
    dispatch(addToCart({
      id: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      quantity: 1,
      // Add other fields as needed
    }));
    alert("Added to cart!");
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = encodeURIComponent(`Check out this product on ARFitt!`);
    if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`, "_blank");
    } else if (platform === "whatsapp") {
      window.open(`https://wa.me/?text=${text}%20${encodeURIComponent(url)}`, "_blank");
    }
  };

  useEffect(() => {
    console.log("selectedItem");
    console.log(selectedItem);
    const fetchImages = async () => {
      if (selectedItem && selectedItem?.itemImagesURLs?.length > 0) {
        const imageUrls = selectedItem?.itemImagesURLs?.map(
          (item: any) => `${process.env.REACT_APP_NODE_BACKEND_BASE_URL}/product_images/${item.imageURL}`
        );
        // const validatedImages = await validateImages(imageUrls);
        const validatedImages = await validateImages(imageUrls);



        setImages(validatedImages);
      }
    };
    if (selectedItem) {
      fetchImages();
      // Set recommended size from logged in user if available
      setSelectedSize(
        loggedInUser?.recommendedSize ?? undefined
      );
      // itemColors
      setSelectedColor(selectedItem?.itemColors[0] ?? undefined);
    }
    console.log("colors");
    console.log(selectedItem?.itemColors);
  }, [selectedItem, loggedInUser]);

  return (
    <Grid container className="flex flex-col gap-1 items-center px-6 py-10">
      <Grid container className="flex gap-5">
        {/* Image Grid */}
        <Grid item xs={12} md={5}>
          <Grid className="flex flex-col my-2">
            <ImageSlider images={images} />
          </Grid>
        </Grid>
        {/* Description Grid */}
        <Grid item xs={12} md={6} className="flex max-mui_md:justify-center">
          <Box className="block flex flex-col gap-4 w-full">
            {/* Heading */}
            <Box className="flex flex-col gap-1">
              <Typography className="font-Montserrat text-lg text-gray-300">
                {selectedItem?.brand}
              </Typography>
              <Typography className="font-Montserrat text-3xl font-bold text-gray-300">
                {selectedItem?.name}
              </Typography>
            </Box>
            {/* Description */}
            <Box className="flex flex-col gap-4">
              <Typography variant="body2" className="text-xs text-gray-300">
                {selectedItem?.description}
              </Typography>
            </Box>
            {/* Functions + Price */}
            <Box className="flex flex-col gap-2 text-gray-300">
              <Typography variant="h6" className="font-bold uppercase">
                {selectedItem?.price + " " + selectedItem?.currency}
              </Typography>
              {/* Buttons */}
              <Box className="flex gap-2">
                <Button
                  variant="contained"
                  className="px-2 py-1 bg-primaryDark w-full"
                  onClick={handleOpen}
                >
                  <Typography className="text-white font-bold">
                    TRY ON!
                  </Typography>
                </Button>
                <AddToCartButton className="w-full ml-2" onClick={handleAddToCart}>
                  Add to Cart
                </AddToCartButton>
                <Button variant="outlined" className="ml-2 px-2 py-1">
                  <Typography className="font-bold">♡</Typography>
                </Button>
                {/* Share Button */}
                <Box className="flex items-center ml-2 gap-1">
                  <Button variant="outlined" className="px-2 py-1 min-w-0" onClick={() => handleShare("facebook")}> <FacebookIcon fontSize="small" /> </Button>
                  <Button variant="outlined" className="px-2 py-1 min-w-0" onClick={() => handleShare("twitter")}> <TwitterIcon fontSize="small" /> </Button>
                  <Button variant="outlined" className="px-2 py-1 min-w-0" onClick={() => handleShare("whatsapp")}> <WhatsAppIcon fontSize="small" /> </Button>
                </Box>
              </Box>
              {/* Sizes */}
              {selectedItem?.itemSizes?.length > 0 ? (
                <Grid item className="flex gap-4 my-2">
                  {/* {selectedItem?.itemSizes?.map((size: any) => ( */}
                  <Button
                    className={`${"bg-primaryDark text-white"

                      } py-2 px-3 rounded-md`}
                    onClick={() => handleSelectedSize(selectedSize?.selectedSize)}
                  >
                    <Typography className="text-sm">{selectedSize}</Typography>
                  </Button>
                  {/* ))} */}
                </Grid>
              ) : null}


            </Box>
          </Box>
        </Grid>
      </Grid>

      {openCameraModule && (
        <CameraPopUp open={openCameraModule} lensId={selectedItem?.lensId} onClose={handleClose} />
      )}

      {/* {openCameraModule === true ? (
        <CameraPopUp
          open={openCameraModule ?? false}
          selectedColor={selectedColor}
          productImage={images[0]}
          onClose={handleClose}
          handleSelectedColor={handleSelectedColor}
        />
      ) : (
        <></>
      )} */}
    </Grid>
  );
};

export default ItemDescription;
