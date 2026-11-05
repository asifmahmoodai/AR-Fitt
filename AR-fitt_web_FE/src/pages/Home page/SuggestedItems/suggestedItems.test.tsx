import React from "react";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import dashboardService from "../../../services/dashboard.service";
import SuggestedItems from "./suggestedItems";

let mockState: any;
const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  useSelector: (selector: (state: any) => unknown) => selector(mockState),
  useDispatch: () => mockDispatch,
}));
jest.mock("../../../services/dashboard.service", () => ({
  __esModule: true,
  default: { getInventory: jest.fn(), getCategories: jest.fn() },
}));
jest.mock("./components/categorySidebar", () => () => null);
jest.mock("../../../components/atomicComponents/ItemCard", () => ({ item }: any) => (
  <article data-testid="product-card">{item.name}</article>
));

const products = [
  "Dark Brown Lipstick", "Rosy Pink Lipstick", "Peach Lipstick",
  "Bright Red Lipstick", "Dark Green Lipstick", "Dark Purple Lipstick",
].map((name, index) => ({ id: `lipstick-${index}`, name }));

beforeEach(() => {
  localStorage.clear();
  mockDispatch.mockClear();
  mockState = {
    main: { selectedCategory: { type: "Cosmetics", category: { id: "lipsticks", name: "Lipsticks" } } },
    signup: { userDetails: { id: "test-user", isBodyScanned: false }, guestDetails: {} },
  };
  (dashboardService.getInventory as jest.Mock).mockResolvedValue({ data: { message: products } });
});

function renderCategory() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, cacheTime: 0 } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={["/home/suggestion?type=Cosmetics&categoryName=Lipsticks&categoryId=lipsticks"]}>
        <SuggestedItems />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

test("shows all six lipsticks when a stale recommendation matches only the red lipstick", async () => {
  localStorage.setItem("recommendedColors_test-user", "red");
  renderCategory();
  expect((await screen.findAllByTestId("product-card"))).toHaveLength(6);
  for (const product of products) expect(screen.getByText(product.name)).toBeTruthy();
});

test("shows the catalogue even when no recommended colours are saved", async () => {
  renderCategory();
  expect((await screen.findAllByTestId("product-card"))).toHaveLength(6);
});

test("keeps cosmetics with names that do not contain a recommended colour visible", async () => {
  localStorage.setItem("recommendedColors_test-user", "red");
  (dashboardService.getInventory as jest.Mock).mockResolvedValue({ data: { message: [{ id: "shade-07", name: "Velvet Finish No. 07" }] } });
  renderCategory();
  expect(await screen.findByText("Velvet Finish No. 07")).toBeTruthy();
});

test("shows the empty-category message only when the API has no products", async () => {
  (dashboardService.getInventory as jest.Mock).mockResolvedValue({ data: { message: [] } });
  await act(async () => { renderCategory(); });
  expect(screen.getByText(/Currently there are no items/)).toBeTruthy();
  expect(screen.queryAllByTestId("product-card")).toHaveLength(0);
});
