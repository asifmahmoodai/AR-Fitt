import { Grid } from "@mui/material";

const Footer = () => {
  return (
    <Grid
      container
      direction="row"
      xs={12}
      className="w-screen xs:h-full md:h-52 bg-primarySaturated"
    >
      <Grid
        item
        className=" w-[40%] xs:w-[100%] md:w-[60%] xl:w-[50%] h-[100%] flex md:justify-start xs:justify-center items-center"
      >
        {/* logo */}
        <Grid
          direction="column"
          className="xs:w-[25%] xl:w-[30%] h-[100%] flex justify-center xs:items-center md:items-end"
        >
          <img
            alt="white logo"
            className="xs:w-[70%] lg:w-[65%] xl:w-[50%]"
            src="/assets/images/logoWhite.png"
          />
        </Grid>
        {/* text */}
        <Grid
          direction="column"
          className="w-[60%] lg:w-[70%] xl:w-[65%]  h-[100%]  flex justify-center px-4 py-8 "
        >
          <div className="font-Dhurjati font-normal text-base  text-white leading-[20px]">
            Experience the future of fashion with AR-Fitt - the ultimate
            destination for personalized style. Sign up now to unlock exclusive
            features, including virtual try-ons and curated recommendations
            tailored to your unique measurements and skin profile.
          </div>
        </Grid>
      </Grid>

      <Grid
        item
        className="w-[50%] xs:w-[100%] md:w-[40%] xl:w-[50%] h-[100%] flex justify-end"
      >
        {" "}
        {/* nav */}
        <Grid
          direction="column"
          className=" w-[30%] h-[100%] flex justify-center"
        >
          <div className="font-Dhurjati font-normal text-base text-white leading-[20px] py-8">
            <div>
              <a href="#home" className="text-white no-underline">
                Home
              </a>
            </div>
            <div>
              <a href="#aboutUs" className="text-white no-underline">
                About us
              </a>
            </div>
            <div>
              <a href="#howItWorks" className="text-white no-underline">
                How it works
              </a>
            </div>
            <div>
              <a href="#features" className="text-white no-underline">
                Features
              </a>
            </div>
            <div>
              <a href="/download-app" className="text-white no-underline">Download Android app</a>
            </div>
          </div>
        </Grid>
        {/* contact */}
        <Grid
          direction="column"
          className=" w-[40%] h-[100%] flex justify-center"
          id="contact"
        >
          <div className="font-Dhurjati font-normal text-base text-white leading-[20px] py-8">
            <div className="text-lg ">Contact:</div>

            <div>+92004904-09</div>
            <div>arfitt@gmail.com</div>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Footer;
