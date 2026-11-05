/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import CategorySidebar from "./components/categorySidebar";
import ItemCard from "../../../components/atomicComponents/ItemCard";
import { RootState } from "../../../redux/rootReducer";
import { setSelectedCategory } from "../../../redux/main/mainActions";
import { useQuery } from "react-query";
import dashboardService from "../../../services/dashboard.service";
import CONSTANTS from "../../../utils/constants/CONSTANTS";

const SuggestedItems: React.FC = () => {
  // React Hooks
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const typeQueryParamTrigger = queryParams.get("type");
  // Redux Store Variables
  const selectedCategory = useSelector(
    (state: RootState) => state.main.selectedCategory
  );
  const hideRecommendedSize = ["jeans", "shorts"].includes(
    (selectedCategory?.category?.name || "").trim().toLowerCase()
  );

  const userDetails = useSelector((state: any) => state.signup.userDetails);
  console.log("userDetails", userDetails);
  const isBodyScanPresent = userDetails.isBodyScanned;
  const isFaceScanPresent = userDetails.isBodyScanned;
  const guestDetails = useSelector((state: any) => state.signup.guestDetails);
  const isGuestFaceScanPresent = guestDetails.isFaceScanned;
  const isGuestBodyScanPresent = guestDetails.isBodyScanned;
  var userId = userDetails?.id; // Get current logged in user id

  if(!userId || userId === "" || userId === undefined) {
    userId = guestDetails?.id; // Get guest user id
  }
  // State Variables
  const [items, setItems] = useState<any>();
  const [categories, setCategories] = useState<{ [key: string]: any }>({});
  // Helper Functions
  const isEmpty = (obj: any) =>
    Object.keys(obj).length === 0 && obj.constructor === Object;
  const capitalizeFirstChar = (str: any) => {
    if (typeof str !== "string" || str.length === 0) {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  // For initializing the data the following functions get executed
  const initializeCategories = (category: any, categoryType: string) => {
    const newCategories: { [key: string]: any } = {};
    if (category && category.length > 0) {
      newCategories[categoryType] = category;
    }
    setCategories((prevData) => ({
      ...prevData,
      [categoryType]: newCategories[categoryType],
    }));
  };
  // Has All the type of categories and sets the default selected category
  const setDefaultCategory = () => {
    if (categories || Object.keys(categories).length > 0) {
      const [firstKey, firstArray] = Object.entries(categories)[0];
      const defaultCategory = {
        type: firstKey,
        category: firstArray[0],
      };
      if (defaultCategory && defaultCategory?.category) {
        dispatch(setSelectedCategory(defaultCategory));
        return defaultCategory;
      }
    }
    return null;
  };
  // Sets the initial category value in the selected category state variable
  const setCategoryFromQueryParams = (
    queryParamType: string | null,
    queryParamCategory: string | null,
    queryParamId: string | null
  ) => {
    // Holds the categories for the specified type; i.e all categories for apparels etc
    const typeCategories = queryParamType ? categories[queryParamType] : null;

    if (typeCategories && queryParamCategory && queryParamId) {
      // First Validate
      const validCategory = typeCategories.find(
        (item: any) =>
          item.id === queryParamId && item.name === queryParamCategory
      );
      if (validCategory) {
        dispatch(
          setSelectedCategory({
            type: queryParamType,
            category: {
              id: queryParamId,
              name: queryParamCategory,
            },
          })
        );
        return;
      } else setDefaultCategory();
    } else if (typeCategories) {
      const typeFromQueryParam = capitalizeFirstChar(queryParamType);
      const defaultCategory = typeCategories[0];

      if (defaultCategory) {
        dispatch(
          setSelectedCategory({
            type: typeFromQueryParam,
            category: {
              id: defaultCategory.id,
              name: defaultCategory.name,
            },
          })
        );
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("type", typeFromQueryParam);
        searchParams.set("categoryName", defaultCategory.name);
        searchParams.set("categoryId", defaultCategory.id);
        navigate(`${location.pathname}?${searchParams.toString()}`);
        return;
      } else setDefaultCategory();
    } else {
      const defaultCategory = setDefaultCategory();
      updateQueryParams(defaultCategory);
    }
  };
  // On Selecting Category From Sidebar these function triggers
  const updateQueryParams = (_category: any) => {
    if (_category) {
      console.log("## - updateQueryParams - Category: ", _category);
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("type", capitalizeFirstChar(_category?.type));
      searchParams.set("categoryName", _category.name);
      searchParams.set("categoryId", _category.id);
      navigate(`${location.pathname}?${searchParams.toString()}`);
    }
  };
  const handleTypeCategory = (_type: string) => {
    if (categories[_type].length > 0) {
      const defaultCategory = {
        type: _type,
        category: categories[_type][0],
      };
      updateQueryParams(categories[_type][0]);
      dispatch(setSelectedCategory(defaultCategory));
    }
  };
  const handleCategory = (_category: any) => {
    const selected_category = {
      type: capitalizeFirstChar(_category?.type),
      category: _category,
    };
    updateQueryParams(_category);
    dispatch(setSelectedCategory(selected_category));
  };
  // API CALL - Use Query React Hook Api Call to get all categories
  const useGetCategories = (type: string) => {
    return useQuery(
      ["getCategories", type, userId],
      async () => await dashboardService.getCategories(type, dispatch, userId),
      {
        enabled: false,
        onSuccess: (response) => {
          const categoriesResponse = response?.data?.message;
          // TODO: Remove the ternary
          initializeCategories(
            categoriesResponse,
            type === "apparel" ? "Apparel" : "Cosmetics"
          );
        },
        onError: (error) => {
          console.log(
            `%cError Occured While Fetching Categories For Type: ${type}`,
            "color: red"
          );
        },
      }
    );
  };
  const { refetch: getApparelCategories } = useGetCategories(CONSTANTS.APPAREL);
  const { refetch: getCosmeticsCategories } = useGetCategories(
    CONSTANTS.COSMETICS
  );
  // API CALL - Use Query React Hook Api Call to get all inventory for specified category
  const useGetInventory = (categoryId: string) => {
    return useQuery(
      ["getInventory", categoryId],
      async () => await dashboardService.getInventory(categoryId, dispatch, userId),
      {
        enabled: false,
        onSuccess: (response) => {
          const inventoryResponse = response?.data?.message;
          setItems(inventoryResponse);
        },
        onError: (error) => {
          console.log(
            `%cError Occured While Fetching Inventory For Category: ${selectedCategory}`,
            "color: red"
          );
        },
      }
    );
  };
  const { refetch: getInventory } = useGetInventory(
    selectedCategory?.category?.id
  );
  // On Mount API Call triggered to get all categories
  useEffect(() => {
    if (isBodyScanPresent || isGuestBodyScanPresent) getApparelCategories();
    if (isFaceScanPresent || isGuestFaceScanPresent) getCosmeticsCategories();
  }, []);
  // On categories state variable change update the query params
  useEffect(() => {
    if (!isEmpty(categories)) {
      const queryParams = new URLSearchParams(location.search);
      const queryParamType = queryParams.get("type");
      const queryParamCategory = queryParams.get("categoryName");
      const queryParamId = queryParams.get("categoryId");
      setCategoryFromQueryParams(
        queryParamType,
        queryParamCategory,
        queryParamId
      );
    }
  }, [categories, typeQueryParamTrigger]);
  // On selected category change get the respective items
  useEffect(() => {
    if (selectedCategory) {
      getInventory();
    }
  }, [selectedCategory]);

  // Generate colors for user when items are loaded (for cosmetics only)
  useEffect(() => {
    if (items && items.length > 0 && (selectedCategory?.category?.name === 'Lipstick' || selectedCategory?.category?.name === 'Foundation' || selectedCategory?.category?.name === 'Maskara')) {
      // This will generate and store colors for the user if they don't have any
      getRandomColors([
        'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white',
        'gray', 'grey', 'silver', 'gold', 'beige', 'cream', 'ivory', 'tan', 'bronze', 'copper',
        'maroon', 'burgundy', 'crimson', 'scarlet', 'rose', 'coral', 'salmon', 'peach', 'apricot', 'amber',
        'navy', 'royal blue', 'sky blue', 'turquoise', 'teal', 'cyan', 'aqua', 'mint', 'lime', 'olive',
        'forest green', 'emerald', 'jade', 'sage', 'moss', 'chartreuse', 'neon green', 'dark green', 'light green', 'sea green',
        'lavender', 'violet', 'indigo', 'plum', 'magenta', 'fuchsia', 'orchid', 'mauve', 'lilac', 'periwinkle',
        'hot pink', 'bubblegum', 'blush', 'dusty rose', 'flamingo', 'carnation', 'cherry', 'ruby', 'wine', 'mahogany',
        'chocolate', 'coffee', 'espresso', 'mocha', 'caramel', 'honey', 'wheat', 'sand', 'khaki', 'taupe',
        'charcoal', 'slate', 'steel', 'pewter', 'platinum', 'pearl', 'snow', 'alabaster', 'bone', 'eggshell',
        'vanilla', 'butter', 'lemon', 'canary', 'mustard', 'saffron', 'ochre', 'rust', 'brick', 'terracotta',
        'papaya', 'mango', 'tangerine', 'persimmon', 'pumpkin', 'carrot', 'marigold', 'sunflower', 'goldenrod', 'citrine',
        'azure', 'cerulean', 'cobalt', 'sapphire', 'denim', 'powder blue', 'baby blue', 'ice blue', 'steel blue', 'midnight blue',
        'seafoam', 'mint green', 'pistachio', 'avocado', 'pea green', 'kelly green', 'hunter green', 'pine', 'fern', 'basil'
      ], 6, userId, items);
    }
  }, [items, selectedCategory, userId]);
  // Helper function to get random colors that exist in the database
  const getRandomColors = (colors: string[], count: number, userId: string, availableItems: any[]) => {
    const storageKey = `recommendedColors_${userId}`;
    
    // Filter colors to only include those that have matching items in the database
    const availableColors = colors.filter(color => 
      availableItems.some(item => 
        item?.name?.toLowerCase().includes(color.toLowerCase())
      )
    );

    // Check if user already has stored colors
    const storedColors = localStorage.getItem(storageKey);

    if (storedColors) {
      // User has existing colors - preserve them and add new ones if needed
      const storedColorsArray = storedColors.split(",").map(c => c.trim());
      const stillAvailableColors = storedColorsArray.filter(color => 
        availableColors.some(availableColor => 
          availableColor.toLowerCase() === color.toLowerCase()
        )
      );

      // If we still have enough colors from the original selection, keep them
      if (stillAvailableColors.length >= count) {
        return stillAvailableColors.slice(0, count).join(", ");
      }

      // If we need more colors, add new available ones to the existing ones
      const newColorsNeeded = count - stillAvailableColors.length;
      const remainingAvailableColors = availableColors.filter(color => 
        !stillAvailableColors.some(storedColor => 
          storedColor.toLowerCase() === color.toLowerCase()
        )
      );

      if (remainingAvailableColors.length >= newColorsNeeded) {
        const shuffled = remainingAvailableColors.sort(() => 0.5 - Math.random());
        const newColors = shuffled.slice(0, newColorsNeeded);
        const finalColors = [...stillAvailableColors, ...newColors].join(", ");
        localStorage.setItem(storageKey, finalColors);
        return finalColors;
      } else {
        // If not enough new colors, use all available colors
        const selectedColors = availableColors.join(", ");
        localStorage.setItem(storageKey, selectedColors);
        return selectedColors;
      }
    } else {
      // First time user - generate new colors and store them
      if (availableColors.length >= count) {
        const shuffled = availableColors.sort(() => 0.5 - Math.random());
    const selectedColors = shuffled.slice(0, count).join(", ");
    localStorage.setItem(storageKey, selectedColors);
    return selectedColors;
      } else {
        const selectedColors = availableColors.join(", ");
        localStorage.setItem(storageKey, selectedColors);
        return selectedColors;
      }
    }
  };
  // JSX
  return (
    <Grid
      container
      className="w-full flex max-mui_sm:flex-col max-mui_sm:gap-0 gap-4 pb-10"
    >
      {/* The sidebar */}
      <CategorySidebar
        categories={categories}
        handleTypeCategory={handleTypeCategory}
        handleCategory={handleCategory}
      />
      {/* The suggested items section */}
      <Grid item xs={12} md={7} lg={8.5} className="p-0 m-0">
        {/* <h1 className="font-Dhurjati text-[220%] font-normal text-gray-300 leading-[1] p-0 my-4">
          {typeQueryParamTrigger == 'Apparel' ? 'Shirts' : 'Lipstick'}: 
          <span style={{ fontSize: '50%', top: 0 }}>
            {typeQueryParamTrigger == 'Apparel' 
              ? `[Recommended Size is ${userDetails.recommendedSize}]` 
              : `[Recommended Colors are: ${getRandomColors(['dark brown', 'light brown', 'red', 'purple', 'pink', 'maroon'], 4, userId)}]`}
          </span>
        </h1> */}

        <div className="flex items-center justify-between my-4">
          <h1 className="font-Dhurjati text-[220%] font-normal text-gray-300 leading-[1] p-0">
          {selectedCategory?.category?.name}
          <span style={{ fontSize: '50%', top: 0 }}>
            {typeQueryParamTrigger === 'Apparel'
              ? (hideRecommendedSize ? "" : `[Recommended Size is ${userDetails.recommendedSize}]`)
              : (selectedCategory?.category?.name === 'Lipstick' || selectedCategory?.category?.name === 'Foundation' || selectedCategory?.category?.name === 'Maskara')
                ? `[Recommended Colors are: ${getRandomColors( ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white',
                    'gray', 'grey', 'silver', 'gold', 'beige', 'cream', 'ivory', 'tan', 'bronze', 'copper',
                    'maroon', 'burgundy', 'crimson', 'scarlet', 'rose', 'coral', 'salmon', 'peach', 'apricot', 'amber',
                    'navy', 'royal blue', 'sky blue', 'turquoise', 'teal', 'cyan', 'aqua', 'mint', 'lime', 'olive',
                    'forest green', 'emerald', 'jade', 'sage', 'moss', 'chartreuse', 'neon green', 'dark green', 'light green', 'sea green',
                    'lavender', 'violet', 'indigo', 'plum', 'magenta', 'fuchsia', 'orchid', 'mauve', 'lilac', 'periwinkle',
                    'hot pink', 'bubblegum', 'blush', 'dusty rose', 'flamingo', 'carnation', 'cherry', 'ruby', 'wine', 'mahogany',
                    'chocolate', 'coffee', 'espresso', 'mocha', 'caramel', 'honey', 'wheat', 'sand', 'khaki', 'taupe',
                    'charcoal', 'slate', 'steel', 'pewter', 'platinum', 'pearl', 'snow', 'alabaster', 'bone', 'eggshell',
                    'vanilla', 'butter', 'lemon', 'canary', 'mustard', 'saffron', 'ochre', 'rust', 'brick', 'terracotta',
                    'papaya', 'mango', 'tangerine', 'persimmon', 'pumpkin', 'carrot', 'marigold', 'sunflower', 'goldenrod', 'citrine',
                    'azure', 'cerulean', 'cobalt', 'sapphire', 'denim', 'powder blue', 'baby blue', 'ice blue', 'steel blue', 'midnight blue',
                    'seafoam', 'mint green', 'pistachio', 'avocado', 'pea green', 'kelly green', 'hunter green', 'pine', 'fern', 'basil'], 6, userId, items || [])}]`
                : ""}
          </span>
        </h1>
          
        </div>

        {/* Grid Rows */}
        <Grid
          container
          gap={2}
          className="flex flex-wrap w-full max-mui_md:justify-center"
        >
          {items?.length > 0 ? (
            items.map((item: any) => (
              <Grid
                item
                key={item.id}
                className="w-[100%] mui_sm:w-[45%] mui_md:w-[48%] mui_lg:w-[32%] min-h-[320px]"
              >
                <ItemCard item={item} />
              </Grid>
            ))
          ) : (
            <p>Oops, Currently there are no items for the selected category</p>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SuggestedItems;
