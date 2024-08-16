/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CardBodyContent from "./CardBody";
import { CardEditingStatus } from "@/app/helpers/types";

const mocks = vi.hoisted(() => ({
  statusStr: "Test status",
  prodListStr: "Test ProductList",
  testUserStr: "Test user",
  useUserContext: vi.fn().mockImplementation(() => ({
    userName: "",
  })),
  getCard: vi.fn().mockImplementation(() => ({
    status: { value: CardEditingStatus.FREE, userName: mocks.testUserStr },
    notes: "Test notes",
  })),
  useCardContext: vi.fn().mockImplementation(() => ({
    card: mocks.getCard(),
    cardChanges: {},
    updateProduct: vi.fn(),
  })),
}));

vi.mock("@/components/EditingStatus/EditingStatus", () => ({
  default: () => <div>{mocks.statusStr}</div>,
}));

vi.mock("@/components/ProductList/ProductList", () => ({
  default: () => <div>{mocks.prodListStr}</div>,
}));

vi.mock("@/components/ProvideUserContext/ProvideUserContext", () => ({
  useUserContext: mocks.useUserContext,
}));

vi.mock("./CardContextProvider", () => ({
  useCardContext: mocks.useCardContext,
}));

describe("CardBodyContent", () => {
  describe.each([mocks.testUserStr, undefined])("User name: %s", (userName) => {
    describe.each([
      CardEditingStatus.IN_PROCESS,
      CardEditingStatus.FREE,
      CardEditingStatus.EDITING,
      undefined,
    ])("Status %s", (status) => {
      mocks.useUserContext.mockImplementation(() => ({
        userName: userName,
      }));

      mocks.getCard.mockImplementation(() => ({
        status: { value: status, userName: mocks.testUserStr },
        notes: "Test notes",
      }));

      it("Rendered", () => {
        const { getByText } = render(<CardBodyContent />);

        expect(getByText(mocks.statusStr)).toBeInTheDocument();
        expect(getByText(mocks.prodListStr)).toBeInTheDocument();
        expect(getByText(mocks.getCard().notes)).toBeInTheDocument();
      });

      it("Rendered (without status)", () => {
        mocks.useCardContext.mockImplementationOnce(() => {
          return {
            card: { ...mocks.getCard(), status: null },
            cardChanges: {},
            updateProduct: vi.fn(),
          };
        });
        const { getByText, queryByText } = render(<CardBodyContent />);

        expect(queryByText(mocks.statusStr)).toBeNull();
        expect(getByText(mocks.prodListStr)).toBeInTheDocument();
        expect(getByText(mocks.getCard().notes)).toBeInTheDocument();
      });

      it("Rendered (without notes)", () => {
        mocks.useCardContext.mockImplementationOnce(() => {
          return {
            card: { ...mocks.getCard(), notes: null },
            cardChanges: {},
            updateProduct: vi.fn(),
          };
        });
        const { getByText, queryByText } = render(<CardBodyContent />);

        expect(getByText(mocks.statusStr)).toBeInTheDocument();
        expect(getByText(mocks.prodListStr)).toBeInTheDocument();
        expect(queryByText(mocks.getCard().notes)).toBeNull();
      });
    });
  });
});
