/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProductList from "./ProductList";
import { getTestProduct } from "@/tests/test-utils";

const mocks = vi.hoisted(() => ({
  updateProduct: vi.fn(),
  productStr: "Test product",
}));

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn().mockImplementation(() => ({
    t: vi.fn().mockImplementation((key: string) => key),
  })),
}));

vi.mock("@/components/ProductItem/ProductItem", () => ({
  default: () => <div>{mocks.productStr}</div>,
}));

describe("ProductList", () => {
  const noStr = "noProducts";

  it("Rendered", () => {
    const products = [getTestProduct()];
    const { getByText, queryByText } = render(
      <ProductList
        products={products}
        updateProduct={mocks.updateProduct}
        canBeChecked={false}
      />
    );
    expect(getByText(mocks.productStr)).toBeInTheDocument();
    expect(queryByText(noStr)).toBeNull();
  });

  it("Rendered (no products)", () => {
    const { getByText, queryByText } = render(
      <ProductList
        products={[]}
        updateProduct={mocks.updateProduct}
        canBeChecked={false}
      />
    );
    expect(getByText(noStr)).toBeInTheDocument();
    expect(queryByText(mocks.productStr)).toBeNull();
  });
});
