/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CardPage from "./page";
import { getTestCard } from "@/tests/test-utils";

const mocks = vi.hoisted(() => ({
  getCard: vi.fn(),
  cardStr: "Test card",
  notFound: "Test not found",
}));

vi.mock("@/app/helpers/actions", () => ({
  getCard: mocks.getCard,
}));

vi.mock("@/components/Card/Card", () => ({
  default: () => <div>{mocks.cardStr}</div>,
}));

vi.mock("next/navigation", () => ({
  notFound: () => <div>{mocks.notFound}</div>,
}));

describe("Card page", () => {
  const pageParams = { params: { locale: "en", id: "123" } };

  it("Rendered", async () => {
    const card = getTestCard();
    mocks.getCard.mockImplementationOnce(() => card);
    const jsx = await CardPage(pageParams);
    const { getByText, getByRole } = render(jsx);

    expect(getByText(new RegExp(card.name))).toBeInTheDocument();
    expect(getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(getByText(mocks.cardStr)).toBeInTheDocument();
  });

  it("Rendered (not found)", async () => {
    mocks.getCard.mockImplementationOnce(() => null);
    const jsx = await CardPage(pageParams);
    const { getByText } = render(jsx);

    expect(getByText(mocks.notFound)).toBeInTheDocument();
  });
});
