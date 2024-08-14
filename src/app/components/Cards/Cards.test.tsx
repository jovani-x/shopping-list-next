/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Cards from "./Cards";
import panelStyles from "@/components/Panel/panel.module.scss";
import { getTestCard } from "@/tests/test-utils";

const mocks = vi.hoisted(() => ({
  filterStr: "CardFilter",
  initStreamListener: vi.fn(),
  useCardsFilterContext: vi.fn().mockImplementation(() => ({
    filterState: { unfinished: true, done: true },
    setFilterState: vi.fn(),
  })),
}));

vi.mock("@/app/helpers/listener", () => ({
  initStreamListener: mocks.initStreamListener,
}));

vi.mock("@/components/CardFilter/CardFilter", () => ({
  default: () => <div>{mocks.filterStr}</div>,
}));

vi.mock("@/components/Card/Card", () => ({
  default: vi.fn(({ card }) => <div>{card.name}</div>),
}));

vi.mock(
  "@/app/components/ProvideCardsFilterContext/ProvideCardsFilterContext",
  () => ({ useCardsFilterContext: mocks.useCardsFilterContext })
);

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn().mockImplementation(() => ({
    t: vi.fn().mockImplementation((key: string) => key),
  })),
}));

describe("Cards", () => {
  const card = getTestCard();
  const product = card.products[0];
  const cardNameDone = "Test done";
  const cardDone = {
    ...card,
    id: "11",
    name: cardNameDone,
    isDone: true,
    products: [{ ...product, id: "100", got: true }],
  };
  const cardNameUnfinished = "Test unfinished";
  const cardUnfinished = {
    ...card,
    id: "12",
    name: cardNameUnfinished,
    isDone: false,
    products: [{ ...product, id: "101", got: false }],
  };
  const cardSel = `.${panelStyles.panel}`;
  const noCardsStr = "noCards";

  it("Rendered (one card only)", async () => {
    const cards = Array(1).fill(card);
    const { getByText, queryByText } = render(<Cards cardsProps={cards} />);

    expect(getByText(mocks.filterStr)).toBeInTheDocument();
    expect(getByText(card.name)).toBeInTheDocument();
    expect(queryByText(noCardsStr)).toBeNull();
  });

  it("Rendered (no cards)", () => {
    const { container, getByText, queryByText } = render(
      <Cards cardsProps={[]} />
    );

    expect(getByText(noCardsStr)).toBeInTheDocument();
    expect(queryByText(mocks.filterStr)).toBeNull();
    expect(container.querySelector(cardSel)).toBeNull();
  });

  it("Rendered (all)", async () => {
    const cards = [cardDone, cardUnfinished];
    const { getByText, queryByText } = render(<Cards cardsProps={cards} />);

    expect(getByText(mocks.filterStr)).toBeInTheDocument();
    expect(getByText(cardDone.name)).toBeInTheDocument();
    expect(getByText(cardUnfinished.name)).toBeInTheDocument();
    expect(queryByText(noCardsStr)).toBeNull();
  });

  it("Rendered (only done)", () => {
    mocks.useCardsFilterContext.mockImplementation(() => ({
      filterState: { unfinished: false, done: true },
      setFilterState: vi.fn(),
    }));
    const cards = [cardDone, cardUnfinished];
    const { getByText, queryByText } = render(<Cards cardsProps={cards} />);

    expect(getByText(mocks.filterStr)).toBeInTheDocument();
    expect(getByText(cardDone.name)).toBeInTheDocument();
    expect(queryByText(cardUnfinished.name)).toBeNull();
    expect(queryByText(noCardsStr)).toBeNull();
  });

  it("Rendered (only unfinished)", () => {
    mocks.useCardsFilterContext.mockImplementation(() => ({
      filterState: { unfinished: true, done: false },
      setFilterState: vi.fn(),
    }));
    const cards = [cardDone, cardUnfinished];
    const { getByText, queryByText } = render(<Cards cardsProps={cards} />);

    expect(getByText(mocks.filterStr)).toBeInTheDocument();
    expect(getByText(cardUnfinished.name)).toBeInTheDocument();
    expect(queryByText(cardDone.name)).toBeNull();
    expect(queryByText(noCardsStr)).toBeNull();
  });

  it("Rendered (no one)", async () => {
    mocks.useCardsFilterContext.mockImplementation(() => ({
      filterState: { unfinished: false, done: false },
      setFilterState: vi.fn(),
    }));
    const cards = [cardDone, cardUnfinished];
    const { getByText, queryByText } = render(<Cards cardsProps={cards} />);

    expect(getByText(mocks.filterStr)).toBeInTheDocument();
    expect(queryByText(cardDone.name)).toBeNull();
    expect(queryByText(cardUnfinished.name)).toBeNull();
    expect(queryByText(noCardsStr)).toBeNull();
  });
});
