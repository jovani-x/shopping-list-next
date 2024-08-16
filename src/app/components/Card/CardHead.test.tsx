/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import CardHeadContent from "./CardHead";
import { UserRole, CardEditingStatus } from "@/app/helpers/types";

const mocks = vi.hoisted(() => ({
  confirmationStr: /deleteTheCard/i,
  shareStr: "Test share",
  userNameStr: "Test user",
  deleteAction: vi.fn(),
  useUserContext: vi.fn().mockImplementation(() => ({
    userName: mocks.userNameStr,
  })),
  getCard: vi.fn(),
  useCardContext: vi.fn(),
}));

vi.mock("@/components/Share/Share", () => ({
  default: () => <div>{mocks.shareStr}</div>,
}));

vi.mock("@/components/ProvideUserContext/ProvideUserContext", () => ({
  useUserContext: mocks.useUserContext,
}));

vi.mock("./CardContextProvider", () => ({
  useCardContext: mocks.useCardContext,
}));

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn().mockImplementation(() => ({
    t: vi.fn().mockImplementation((key: string) => key),
  })),
}));

describe("CardHeadContent", () => {
  const editStr = "📝";
  const saveStr = "💾";
  const shoppingStr = "🛒";
  const deleteStr = "❌";

  describe.each([mocks.userNameStr, "Test friend", ""])(
    "userName: %s",
    (userName) => {
      describe.each([mocks.userNameStr])(
        "card userName: %s",
        (cardUserName) => {
          describe.each([UserRole.owner, UserRole.buyer])(
            "role: %s",
            (role) => {
              describe.each([
                CardEditingStatus.FREE,
                CardEditingStatus.EDITING,
                CardEditingStatus.IN_PROCESS,
                undefined,
              ])("status: %s", (status) => {
                describe.each([false, true])("isDone: %s", (isDone) => {
                  describe.each([false, true])("isChanged: %s", (isChanged) => {
                    it("Rendered", () => {
                      mocks.getCard.mockImplementation(() => ({
                        status:
                          status === undefined
                            ? status
                            : { userName: cardUserName, value: status },
                        name: "Test title",
                        userRole: role,
                      }));
                      mocks.useCardContext.mockImplementation(() => ({
                        card: mocks.getCard(),
                        isChanged,
                        isDone,
                        shareAction: vi.fn(),
                        editAction: vi.fn(),
                        shoppingAction: vi.fn(),
                        saveAction: vi.fn(),
                        deleteAction: vi.fn(),
                      }));
                      mocks.useUserContext.mockImplementation(() => ({
                        userName: userName,
                      }));

                      const isShareShown = role === UserRole.owner;
                      const isEditShown =
                        role === UserRole.owner &&
                        (status === CardEditingStatus.FREE ||
                          !status ||
                          (status === CardEditingStatus.EDITING &&
                            userName &&
                            userName === cardUserName));
                      const isShoppingShown =
                        !isDone &&
                        (status === CardEditingStatus.FREE ||
                          !status ||
                          (status === CardEditingStatus.IN_PROCESS &&
                            userName &&
                            userName === cardUserName));
                      const isSaveShown =
                        isChanged &&
                        status === CardEditingStatus.IN_PROCESS &&
                        userName &&
                        userName === cardUserName;
                      const isDeleteShown =
                        role === UserRole.owner &&
                        (status === CardEditingStatus.FREE ||
                          status === undefined);
                      const { getByText, queryByText } = render(
                        <CardHeadContent />
                      );

                      expect(
                        getByText(mocks.getCard().name)
                      ).toBeInTheDocument();
                      expect(queryByText(mocks.confirmationStr)).toBeNull();

                      if (isShareShown) {
                        expect(getByText(mocks.shareStr)).toBeInTheDocument();
                      } else {
                        expect(queryByText(mocks.shareStr)).toBeNull();
                      }

                      if (isEditShown) {
                        expect(getByText(editStr)).toBeInTheDocument();
                      } else {
                        expect(queryByText(editStr)).toBeNull();
                      }

                      if (isShoppingShown) {
                        expect(getByText(shoppingStr)).toBeInTheDocument();
                      } else {
                        expect(queryByText(shoppingStr)).toBeNull();
                      }

                      if (isSaveShown) {
                        expect(getByText(saveStr)).toBeInTheDocument();
                      } else {
                        expect(queryByText(saveStr)).toBeNull();
                      }

                      if (isDeleteShown) {
                        expect(getByText(deleteStr)).toBeInTheDocument();
                      } else {
                        expect(queryByText(deleteStr)).toBeNull();
                      }
                    });
                  });
                });
              });
            }
          );
        }
      );
    }
  );

  it("Rendered (toggle delete confirmation)", async () => {
    mocks.useUserContext.mockImplementation(() => ({
      userName: mocks.userNameStr,
    }));
    mocks.getCard.mockImplementation(() => ({
      status: { userName: mocks.userNameStr, value: CardEditingStatus.FREE },
      name: "Test title",
      userRole: UserRole.owner,
      notes: null,
    }));
    mocks.useCardContext.mockImplementation(() => ({
      card: mocks.getCard(),
      isChanged: false,
      isDone: false,
      shareAction: vi.fn(),
      editAction: vi.fn(),
      shoppingAction: vi.fn(),
      saveAction: vi.fn(),
      deleteAction: mocks.deleteAction,
    }));
    const user = userEvent.setup();
    const { getByText, queryByText } = render(<CardHeadContent />);

    const btnEl = getByText(deleteStr);
    await user.click(btnEl);
    expect(getByText(mocks.confirmationStr)).toBeInTheDocument();
    const yesBtn = getByText("yes");
    expect(yesBtn).toBeInTheDocument();
    await user.click(yesBtn);
    expect(mocks.deleteAction).toBeCalled();
    expect(queryByText(mocks.confirmationStr)).toBeNull();
  });
});
