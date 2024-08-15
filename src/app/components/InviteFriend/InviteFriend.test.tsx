/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import InviteFriend from "./InviteFriend";

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn().mockImplementation(() => ({
    t: vi.fn().mockImplementation((key: string) => key),
  })),
}));

describe("InviteFriend", () => {
  it("Rendered", async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<InviteFriend />);
    const btnEl = getByRole("button");
    expect(btnEl).toBeInTheDocument();
    expect(getByRole("dialog", { hidden: true })).toBeInTheDocument();
    await user.click(btnEl);
    expect(getByRole("dialog", { hidden: false })).toBeInTheDocument();
  });
});
