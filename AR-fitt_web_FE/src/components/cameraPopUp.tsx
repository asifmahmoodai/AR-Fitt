// src/components/CameraPopUp.tsx

import React from "react";
import { Modal, Fade, Box, IconButton } from "@mui/material";
import CameraKitComponent from "./CameraKitComponent";
import { getHostedLensReference } from "../utils/tryOn";

interface CameraPopUpProps {
  open: boolean;
  onClose: () => void;
  lensId: string;
  // If you need to pass additional props (like productImage or selectedColor)
  // you can add them here.
}

const CameraPopUp: React.FC<CameraPopUpProps> = ({ open, onClose,lensId  }) => {
  const hostedReference = getHostedLensReference(lensId);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="camera"
      aria-describedby="camera-pop-up-for-try-on"
      className="flex items-center justify-center"
    >
      <Fade in={open}>
        <Box
          className="
            relative flex flex-col gap-4
            
            w-full max-sm:w-full sm:w-[80%] md:w-[60%] lg:w-[55%] xl:w-[40%]
            overflow-hidden
            rounded-xl bg-black
          "
        >
            <CameraKitComponent
              lensId={hostedReference ?? lensId}
              lensGroupId={hostedReference ? "hosted-lenses" : undefined}
            />

          {/* A simple close button overlay */}
          <Box className="absolute top-4 right-4">
            <IconButton onClick={onClose} className="bg-black bg-opacity-10">
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </IconButton>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default CameraPopUp;
