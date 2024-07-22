/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import EditingStatus from "./EditingStatus";
import { CardEditingStatus } from "@/app/helpers/types";

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn().mockImplementation(() => ({
    t: vi.fn().mockImplementation((key: string) => key),
  })),
}));

describe.each(Object.keys(CardEditingStatus))("EditingStatus $name", (name) => {
  const statusItem: CardEditingStatus =
    CardEditingStatus[name as keyof typeof CardEditingStatus];
  const isEditingMode = statusItem === CardEditingStatus.EDITING;
  const isShoppingMode = statusItem === CardEditingStatus.IN_PROCESS;
  const userName = "Test User #1";

  it("Rendered", () => {
    const { container, getByText, queryByText } = render(
      <EditingStatus
        status={{ value: statusItem, userName: isEditingMode ? userName : "" }}
      />
    );
    const editingRegExp = new RegExp("isEditing", "i");
    const shoppingRegExp = new RegExp("isShopping", "i");

    if (isEditingMode) {
      expect(
        getByText(new RegExp(`${userName.toString()}`, "i"))
      ).toBeInTheDocument();
      expect(getByText(editingRegExp)).toBeInTheDocument();
      expect(queryByText(shoppingRegExp)).toBeNull();
    } else {
      expect(queryByText(userName)).toBeNull();

      if (isShoppingMode) {
        expect(getByText(shoppingRegExp)).toBeInTheDocument();
        expect(queryByText(editingRegExp)).toBeNull();
      } else {
        expect(container).toBeEmptyDOMElement();
      }
    }
  });
});
