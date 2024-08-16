/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { getTestCard } from "@/tests/test-utils";
import Card from "./Card";
import ProvideUserContext from "@/app/components/ProvideUserContext/ProvideUserContext";
import { UserRole, CardEditingStatus } from "@/app/helpers/types";
import { getErrorMessage } from "@/lib/utils";
import initTranslations from "@/app/i18n";

const mocks = vi.hoisted(() => ({
  handlePush: vi.fn(),
  modalStr: "Test Modal",
  updateCard: vi.fn(),
  removeCard: vi.fn(),
}));

vi.mock("@/app/i18n", () => ({
  default: vi.fn().mockImplementation(() => ({
    t: (key: string) => key,
  })),
}));

vi.mock("@/app/actions/client/cards", () => ({
  updateCard: mocks.updateCard,
  removeCard: mocks.removeCard,
  addToUser: vi.fn(),
}));

vi.mock("@/app/components/Modal/Modal", () => ({
  default: () => <dialog>{mocks.modalStr}</dialog>,
}));

vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: mocks.handlePush,
    };
  },
}));

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn().mockImplementation(() => ({
    t: vi.fn().mockImplementation((key: string) => key),
  })),
}));

beforeEach(() => {
  mocks.updateCard.mockClear();
  mocks.removeCard.mockClear();
  consoleLogMock.mockClear();
});

const consoleLogMock = vi
  .spyOn(global.console, "log")
  .mockImplementation(() => vi.fn());

describe("Card", async () => {
  const card = getTestCard();
  const { t } = await initTranslations("en");

  it("Rendered", () => {
    const { getByText } = render(
      <ProvideUserContext value={{ userName: "Test User" }}>
        <Card card={card} />
      </ProvideUserContext>
    );

    expect(getByText(mocks.modalStr)).toBeInTheDocument();
    expect(getByText(new RegExp(card.name))).toBeInTheDocument();
  });

  describe("editAction", () => {
    const btnText = "📝";
    const testCard = { ...card, userRole: UserRole.owner };

    it("Successfull", async () => {
      const user = userEvent.setup();
      const { getByText } = render(
        <ProvideUserContext value={{ userName: "Test User" }}>
          <Card card={testCard} />
        </ProvideUserContext>
      );

      const btnEl = getByText(btnText);
      expect(btnEl).toBeInTheDocument();
      await user.click(btnEl);
      expect(mocks.updateCard).toBeCalled();
      expect(mocks.handlePush).toBeCalledWith(`${card.id}/edit-card`);
    });

    it("Faild", async () => {
      const testErrMessage = "Test error message";
      mocks.updateCard.mockImplementationOnce(() =>
        Promise.reject(new Error(testErrMessage))
      );
      const user = userEvent.setup();
      const { getByText } = render(
        <ProvideUserContext value={{ userName: "Test User" }}>
          <Card card={testCard} />
        </ProvideUserContext>
      );

      const btnEl = getByText(btnText);
      expect(btnEl).toBeInTheDocument();
      await user.click(btnEl);
      expect(mocks.updateCard).toBeCalled();
      expect(consoleLogMock).toBeCalledWith(
        "Go editing Card failed",
        getErrorMessage(testErrMessage)
      );
    });
  });

  describe("shoppingAction", () => {
    const btnText = "🛒";
    const testUserName = "Test User";
    const testCard = {
      ...card,
      userRole: UserRole.owner,
      status: {
        value: CardEditingStatus.FREE,
        userName: testUserName,
      },
    };

    it("Successfull", async () => {
      const user = userEvent.setup();
      const { getByText } = render(
        <ProvideUserContext value={{ userName: testUserName }}>
          <Card card={testCard} />
        </ProvideUserContext>
      );

      const btnEl = getByText(btnText);
      expect(btnEl).toBeInTheDocument();
      await user.click(btnEl);
      expect(mocks.updateCard).toBeCalledWith({
        ...testCard,
        status: { value: CardEditingStatus.IN_PROCESS, userName: testUserName },
      });
    });

    it("Faild", async () => {
      const testErrMessage = "Test error message";
      mocks.updateCard.mockImplementationOnce(() =>
        Promise.reject(new Error(testErrMessage))
      );
      const user = userEvent.setup();
      const { getByText } = render(
        <ProvideUserContext value={{ userName: "Test User" }}>
          <Card card={testCard} />
        </ProvideUserContext>
      );

      const btnEl = getByText(btnText);
      expect(btnEl).toBeInTheDocument();
      await user.click(btnEl);
      expect(mocks.updateCard).toBeCalled();
      expect(consoleLogMock).toBeCalledWith(
        "Saving Card failed",
        getErrorMessage(testErrMessage)
      );
    });
  });

  describe("saveAction", () => {
    const btnText = "💾";
    const testUserName = "Test User";
    const btnDoneText = `${t("done")}?`;

    it("Successfull", async () => {
      const testCard = {
        ...card,
        done: false,
        userRole: UserRole.owner,
        status: {
          value: CardEditingStatus.IN_PROCESS,
          userName: testUserName,
        },
      };
      const user = userEvent.setup();
      const { getByText } = render(
        <ProvideUserContext value={{ userName: testUserName }}>
          <Card card={testCard} />
        </ProvideUserContext>
      );

      const btnDone = getByText(btnDoneText);
      expect(btnDone).toBeInTheDocument();
      await user.click(btnDone);
      const btnEl = getByText(btnText);
      expect(btnEl).toBeInTheDocument();
      await user.click(btnEl);
      const testProducts = testCard.products.map((pr) => ({
        ...pr,
        got: true,
      }));
      expect(mocks.updateCard).toBeCalledWith({
        ...testCard,
        isDone: true,
        products: testProducts,
        status: { value: CardEditingStatus.FREE, userName: "" },
      });
    });

    it("Faild", async () => {
      const testCard = {
        ...card,
        done: false,
        userRole: UserRole.owner,
        status: {
          value: CardEditingStatus.IN_PROCESS,
          userName: testUserName,
        },
      };
      const testErrMessage = "Test error message";
      mocks.updateCard.mockImplementationOnce(() =>
        Promise.reject(new Error(testErrMessage))
      );
      const user = userEvent.setup();
      const { getByText } = render(
        <ProvideUserContext value={{ userName: "Test User" }}>
          <Card card={testCard} />
        </ProvideUserContext>
      );

      const btnDone = getByText(btnDoneText);
      expect(btnDone).toBeInTheDocument();
      await user.click(btnDone);
      const btnEl = getByText(btnText);
      expect(btnEl).toBeInTheDocument();
      await user.click(btnEl);
      expect(mocks.updateCard).toBeCalled();
      expect(consoleLogMock).toBeCalledWith(
        "Saving Card failed",
        getErrorMessage(testErrMessage)
      );
    });
  });

  describe("deleteAction", () => {
    const btnText = "❌";
    const btnConfirmText = t("yes");
    const testUserName = "Test User";
    const testCard = {
      ...card,
      userRole: UserRole.owner,
      status: {
        value: CardEditingStatus.FREE,
        userName: testUserName,
      },
    };

    it("Successfull", async () => {
      const user = userEvent.setup();
      const { getByText } = render(
        <ProvideUserContext value={{ userName: testUserName }}>
          <Card card={testCard} />
        </ProvideUserContext>
      );

      const btnEl = getByText(btnText);
      expect(btnEl).toBeInTheDocument();
      await user.click(btnEl);
      const btnRemove = getByText(btnConfirmText);
      expect(btnRemove).toBeInTheDocument();
      await user.click(btnRemove);
      expect(mocks.removeCard).toBeCalledWith(testCard.id);
    });

    it("Faild", async () => {
      const testErrMessage = "Test error message";
      mocks.removeCard.mockImplementationOnce(() =>
        Promise.reject(new Error(testErrMessage))
      );
      const user = userEvent.setup();
      const { getByText } = render(
        <ProvideUserContext value={{ userName: "Test User" }}>
          <Card card={testCard} />
        </ProvideUserContext>
      );

      const btnEl = getByText(btnText);
      expect(btnEl).toBeInTheDocument();
      await user.click(btnEl);
      const btnRemove = getByText(btnConfirmText);
      expect(btnRemove).toBeInTheDocument();
      await user.click(btnRemove);
      expect(mocks.removeCard).toBeCalled();
      expect(consoleLogMock).toBeCalledWith(
        "Removing failed",
        getErrorMessage(testErrMessage)
      );
    });
  });

  it.todo("required tests");
});
