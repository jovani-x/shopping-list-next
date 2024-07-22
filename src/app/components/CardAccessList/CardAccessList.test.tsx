/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CardAccessList from "./CardAccessList";
import { getTestCard, getTestUser } from "@/tests/test-utils";
import { FriendType } from "@/app/helpers/types";

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn().mockImplementation(() => ({
    t: vi.fn().mockImplementation((key: string) => key),
  })),
}));

const card = getTestCard();
const users = (): FriendType[] => {
  const { id, userName, cards } = getTestUser();
  return [{ id, userName, cards }];
};

describe("CardAccessList", () => {
  it("Rendered (no users)", () => {
    const { getByText, queryByText } = render(
      <CardAccessList cardId={card?.id} users={null} />
    );
    expect(getByText("noOne")).toBeInTheDocument();
    expect(queryByText("haveAccess")).toBeNull();
  });

  it("Rendered (1 user)", () => {
    const { getByText, queryByText } = render(
      <CardAccessList cardId={card?.id} users={users()} />
    );
    expect(queryByText("noOne")).toBeNull();
    expect(getByText(/haveAccess/i)).toBeInTheDocument();
  });
});
