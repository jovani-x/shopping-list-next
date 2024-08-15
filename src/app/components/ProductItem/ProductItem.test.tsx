/**
 * @vitest-environment jsdom
 */
import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProductItem, { Product } from "./ProductItem";
import productItemStyles from "./ProductItem.module.scss";
import { getTestProduct } from "@/tests/test-utils";
import userEvent from "@testing-library/user-event";

describe("Product item", () => {
  const productValue: Product | undefined = getTestProduct();
  const initialGot = productValue?.got;
  const handleUpdate = vi.fn().mockImplementation(() => {
    productValue.got = !productValue.got;
  });

  it("Rendered", () => {
    if (productValue) {
      const { container, getByText } = render(
        <ProductItem product={productValue} updateProduct={handleUpdate} />
      );
      expect(
        container.querySelector(`.${productItemStyles.productItem}`)
      ).toBeInTheDocument();
      const btnToggle = container.querySelector(
        `.${productItemStyles.productItem} button`
      );
      expect(btnToggle).toBeInTheDocument();
      const statusEl = container.querySelector(`.${productItemStyles.status}`);
      expect(statusEl).toBeInTheDocument();
      expect(getByText(productValue.name)).toBeInTheDocument();
    }
  });

  it('Click "toggle description"', async () => {
    if (productValue) {
      const { container, queryByText } = render(
        <ProductItem product={productValue} updateProduct={handleUpdate} />
      );
      const user = userEvent.setup();
      const btnToggle = container.querySelector(
        `.${productItemStyles.productItem} button`
      );
      if (btnToggle && !!productValue?.note) {
        await user.click(btnToggle);
        const descrEl = await waitFor(() =>
          container.querySelector(`.${productItemStyles.productInfo}`)
        );
        expect(descrEl).toBeInTheDocument();
        expect(queryByText(productValue?.note)).toBeInTheDocument();
        await user.click(btnToggle);
        expect(descrEl).not.toBeInTheDocument();
      }
    }
  });

  it("Product.got = false", async () => {
    if (productValue) {
      const { container, getByText, queryByText } = render(
        <ProductItem
          product={{ ...productValue, got: false }}
          updateProduct={handleUpdate}
        />
      );

      const statusEl = container.querySelector(`.${productItemStyles.status}`);
      if (statusEl) {
        expect(getByText("👉")).toBeInTheDocument();
        expect(queryByText("✅")).toBeNull();
      }
    }
  });

  it("Product.got = true", async () => {
    if (productValue) {
      const { container, getByText, queryByText } = render(
        <ProductItem
          product={{ ...productValue, got: true }}
          updateProduct={handleUpdate}
        />
      );

      const statusEl = container.querySelector(`.${productItemStyles.status}`);
      if (statusEl) {
        expect(getByText("✅")).toBeInTheDocument();
        expect(queryByText("👉")).toBeNull();
      }
    }
  });

  it("Click disabled", async () => {
    if (productValue) {
      const { container } = render(
        <ProductItem
          product={productValue}
          updateProduct={handleUpdate}
          canBeChecked={false}
        />
      );
      const user = userEvent.setup();
      const statusEl = container.querySelector(`.${productItemStyles.status}`);
      if (statusEl) {
        await user.click(statusEl);
        expect(handleUpdate).not.toBeCalled();
      }
    }
  });

  it('Click "toggle done"', async () => {
    if (productValue) {
      const { container } = render(
        <ProductItem
          product={productValue}
          updateProduct={handleUpdate}
          canBeChecked={true}
        />
      );
      const user = userEvent.setup();
      const statusEl = container.querySelector(`.${productItemStyles.status}`);
      if (statusEl) {
        await user.click(statusEl);
        await user.click(statusEl);
        expect(handleUpdate).toBeCalledTimes(2);
        expect(handleUpdate).toHaveBeenNthCalledWith(1, {
          ...productValue,
          got: !initialGot,
        });
        expect(handleUpdate).toHaveBeenNthCalledWith(2, {
          ...productValue,
          got: initialGot,
        });
      }
    }
  });
});
