/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import FriendsChoiceForm from "./FriendsChoiceForm";
import { getTestFriend } from "@/tests/test-utils";

const mocks = vi.hoisted(() => ({
  confirmFun: vi.fn(),
  cancelFun: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn().mockImplementation(() => ({
    t: vi.fn().mockImplementation((key: string) => key),
  })),
}));

describe("FriendsChoice form", () => {
  const friend = getTestFriend();
  const formId = "testform123";
  const confirmBtnText = "Test confirm";
  const cancelBtnText = "Test cancel";
  const cancelStr = "cancel";

  it("Rendered (no friends)", () => {
    const { getByText, getByRole, queryByText, queryByRole, getAllByRole } =
      render(
        <FriendsChoiceForm
          formId={formId}
          confirmFun={mocks.confirmFun}
          confirmBtnText={confirmBtnText}
          friends={null}
        />
      );

    expect(getByRole("combobox")).toBeInTheDocument();
    const optionEls = getAllByRole("option");
    expect(optionEls.length).toEqual(1);
    expect(optionEls[0]).toHaveAttribute("value", "");
    expect(queryByText(friend.userName)).toBeNull();
    const btnEl = getByText(confirmBtnText);
    expect(btnEl).toBeInTheDocument();
    expect(btnEl).toBeDisabled();
    expect(queryByText(cancelBtnText)).toBeNull();
    expect(queryByText(cancelStr)).toBeNull();
    expect(queryByRole("alert")).toBeNull();
  });

  it("Rendered (no cancel button)", () => {
    const { getByText, getByRole, queryByText, queryByRole } = render(
      <FriendsChoiceForm
        formId={formId}
        confirmFun={mocks.confirmFun}
        confirmBtnText={confirmBtnText}
        friends={[friend]}
      />
    );

    expect(getByRole("combobox")).toBeInTheDocument();
    expect(getByText(friend.userName)).toBeInTheDocument();
    const btnEl = getByText(confirmBtnText);
    expect(btnEl).toBeInTheDocument();
    expect(btnEl).toBeDisabled();
    expect(queryByText(cancelBtnText)).toBeNull();
    expect(queryByText(cancelStr)).toBeNull();
    expect(queryByRole("alert")).toBeNull();
  });

  it("Rendered (with cancel button)", () => {
    const { getByText, getByRole, queryByText, queryByRole } = render(
      <FriendsChoiceForm
        formId={formId}
        confirmFun={mocks.confirmFun}
        confirmBtnText={confirmBtnText}
        cancelFun={mocks.cancelFun}
        cancelBtnText={cancelBtnText}
        friends={[friend]}
      />
    );

    expect(getByRole("combobox")).toBeInTheDocument();
    expect(getByText(friend.userName)).toBeInTheDocument();
    const btnEl = getByText(confirmBtnText);
    expect(btnEl).toBeInTheDocument();
    expect(btnEl).toBeDisabled();
    expect(getByText(cancelBtnText)).toBeInTheDocument();
    expect(queryByText(cancelStr)).toBeNull();
    expect(queryByRole("alert")).toBeNull();
  });

  it("Rendered (with cancel button with default text)", () => {
    const { getByText, getByRole, queryByRole } = render(
      <FriendsChoiceForm
        formId={formId}
        confirmFun={mocks.confirmFun}
        confirmBtnText={confirmBtnText}
        cancelFun={mocks.cancelFun}
        friends={[friend]}
      />
    );

    expect(getByRole("combobox")).toBeInTheDocument();
    expect(getByText(friend.userName)).toBeInTheDocument();
    const btnEl = getByText(confirmBtnText);
    expect(btnEl).toBeInTheDocument();
    expect(btnEl).toBeDisabled();
    expect(queryByRole(cancelBtnText)).toBeNull();
    expect(getByText(cancelStr)).toBeInTheDocument();
    expect(queryByRole("alert")).toBeNull();
  });

  it("Click 'cancel'", async () => {
    const user = userEvent.setup();
    const { getByText } = render(
      <FriendsChoiceForm
        formId={formId}
        confirmFun={mocks.confirmFun}
        confirmBtnText={confirmBtnText}
        cancelFun={mocks.cancelFun}
        cancelBtnText={cancelBtnText}
        friends={[friend]}
      />
    );

    const btnEl = getByText(cancelBtnText);
    await user.click(btnEl);
    expect(mocks.cancelFun).toBeCalled();
  });

  it("Choose friend", async () => {
    const user = userEvent.setup();
    const { getByText, getByRole } = render(
      <FriendsChoiceForm
        formId={formId}
        confirmFun={mocks.confirmFun}
        confirmBtnText={confirmBtnText}
        cancelFun={mocks.cancelFun}
        cancelBtnText={cancelBtnText}
        friends={[friend]}
      />
    );

    const comboboxEl = getByRole("combobox");
    const optionEl = getByText(friend.userName);
    const btnEl = getByText(confirmBtnText);
    expect(btnEl).toBeDisabled();
    await user.selectOptions(comboboxEl, optionEl);
    expect(btnEl).not.toBeDisabled();
  });

  it.todo("Submit form (success)");
  it.todo("Submit form (error)");
});
