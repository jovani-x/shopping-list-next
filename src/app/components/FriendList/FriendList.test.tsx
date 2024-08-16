/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FriendList from "./FriendList";
import { getTestUser } from "@/tests/test-utils";

const mocks = vi.hoisted(() => ({
  initStreamListener: vi.fn(),
  deleteFriends: vi.fn(),
  deleteFriend: vi.fn(),
  checkboxStr: "Test checkbox",
}));

vi.mock("@/app/helpers/listener", () => ({
  initStreamListener: mocks.initStreamListener,
}));

vi.mock("@/app/actions/client/friends", () => ({
  deleteFriends: mocks.deleteFriends,
  deleteFriend: mocks.deleteFriend,
}));

vi.mock("@/app/components/Checkbox/Checkbox", () => ({
  default: () => <div>{mocks.checkboxStr}</div>,
}));

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn().mockImplementation(() => ({
    t: vi.fn().mockImplementation((key: string) => key),
  })),
}));

describe("FriendList", () => {
  const emptyStr = "noOne";
  const deleteStr = /deleteSelected/i;

  it("Rendered", () => {
    const { id, userName, cards } = getTestUser();
    const { queryByText, getByText } = render(
      <FriendList friendsProps={[{ id, userName, cards }]} />
    );

    expect(getByText(mocks.checkboxStr)).toBeInTheDocument();
    expect(queryByText(emptyStr)).toBeNull();
    expect(getByText(deleteStr)).toBeInTheDocument();
  });

  it("Rendered (empty)", () => {
    const { queryByText, getByText } = render(<FriendList friendsProps={[]} />);

    expect(getByText(emptyStr)).toBeInTheDocument();
    expect(queryByText(mocks.checkboxStr)).toBeNull();
    expect(queryByText(deleteStr)).toBeNull();
  });

  it.todo("Submit form (success)");
  it.todo("Submit form (error)");
});
