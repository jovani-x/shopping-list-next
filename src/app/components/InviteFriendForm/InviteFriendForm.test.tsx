/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import InviteFriendForm from "./InviteFriendForm";

const mocks = vi.hoisted(() => ({ inviteFriendViaEmail: vi.fn() }));

vi.mock("@/app/helpers/actions", () => ({
  inviteFriendViaEmail: mocks.inviteFriendViaEmail,
}));

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn().mockImplementation(() => ({
    t: vi.fn().mockImplementation((key: string) => key),
  })),
}));

describe("InviteFriendForm", () => {
  const btnStr = "invite";
  const emailStr = "email";
  const messageStr = "message";
  const testEmail = "test.email@test.test";
  const testMsg = "Hello, it's a test message";
  const inputEntArr = [
    { name: emailStr, value: testEmail },
    { name: messageStr, value: testMsg },
  ];

  it("Rendered", () => {
    const { getByText, getByLabelText, queryByRole } = render(
      <InviteFriendForm />
    );

    for (const { name } of inputEntArr) {
      expect(getByLabelText(name)).toBeInTheDocument();
    }
    const btnEl = getByText(btnStr);
    expect(btnEl).toBeInTheDocument();
    expect(btnEl).toBeDisabled();
    expect(queryByRole("alert")).toBeNull();
  });

  it("Fill email only", async () => {
    const user = userEvent.setup();
    const { getByText, getByLabelText } = render(<InviteFriendForm />);

    const inputEl = getByLabelText(emailStr);
    await user.type(inputEl, testEmail);
    expect(getByText(btnStr)).not.toBeDisabled();
  });

  it("Fill message only", async () => {
    const user = userEvent.setup();
    const { getByText, getByLabelText } = render(<InviteFriendForm />);

    const inputEl = getByLabelText(messageStr);
    await user.type(inputEl, testMsg);
    expect(getByText(btnStr)).toBeDisabled();
  });

  it("Fill form", async () => {
    const user = userEvent.setup();
    const { getByText, getByLabelText } = render(<InviteFriendForm />);

    for (const { value, name } of inputEntArr) {
      const inputEl = getByLabelText(name);
      await user.type(inputEl, value);
      expect(inputEl).toHaveDisplayValue(value);
    }
    expect(getByText(btnStr)).not.toBeDisabled();
  });

  it.todo("Submit form (success)");
  it.todo("Submit form (error)");
});
