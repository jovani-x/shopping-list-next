/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FriendsPage from "./page";
import { UserRequest } from "@/app/helpers/types";

const mocks = vi.hoisted(() => ({
  inviteStr: "Test invite friend",
  panelStr: "Test panel",
  getAllFriends: vi.fn(),
  getUserRequests: vi.fn(),
}));

vi.mock("@/components/InviteFriend/InviteFriend", () => ({
  default: () => <div>{mocks.inviteStr}</div>,
}));

vi.mock("@/components/Panel/Panel", () => ({
  default: () => <div>{mocks.panelStr}</div>,
}));

vi.mock("@/app/helpers/actions", () => ({
  getAllFriends: mocks.getAllFriends,
  getUserRequests: mocks.getUserRequests,
}));

describe("Friends page", () => {
  it("Rendered", async () => {
    const jsx = await FriendsPage({ params: { locale: "en" } });
    const { getAllByText, getByText, getByRole } = render(jsx);

    expect(getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(getByText(mocks.inviteStr)).toBeInTheDocument();
    expect(getAllByText(mocks.panelStr).length).toBe(2);
    expect(mocks.getAllFriends).toBeCalled();
    expect(mocks.getUserRequests).toBeCalledWith({
      type: UserRequest.becomeFriend,
    });
  });
});
