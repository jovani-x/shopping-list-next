/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import HomePage from "./page";

const mocks = vi.hoisted(() => ({
  handleGetData: vi.fn(),
  cardsStr: "Test Cards",
}));

vi.mock("@/app/helpers/actions", () => ({
  getAllCards: mocks.handleGetData,
}));

vi.mock("@/components/Cards/Cards", () => ({
  default: () => <div>{mocks.cardsStr}</div>,
}));

describe("Home page", () => {
  const pageParams = { params: { locale: "en" } };

  it("Rendered", async () => {
    const jsx = await HomePage(pageParams);
    const { getByRole, getByText } = render(jsx);

    expect(getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(getByText(mocks.cardsStr)).toBeInTheDocument();
    const btnEl = getByRole("link");
    expect(btnEl).toBeInTheDocument();
    expect(btnEl).toHaveAttribute("href", "/create-card");
    expect(mocks.handleGetData).toBeCalled();
  });
});
