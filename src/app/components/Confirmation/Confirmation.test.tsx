/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Confirmation from "./Confirmation";

describe("Confirmation", () => {
  const messageStr = "Lorem ipsum";
  const yesStr = "yes";
  const noStr = "no";
  let res = "";
  const initialState = {
    text: messageStr,
    yesText: yesStr,
    noText: noStr,
    yesFunc: vi.fn().mockImplementation(() => {
      res = yesStr;
    }),
    noFunc: vi.fn().mockImplementation(() => {
      res = noStr;
    }),
    extraClassname: "custom-class",
  };

  afterEach(() => {
    res = "";
    vi.clearAllMocks();
  });

  it("Rendered", async () => {
    const { container, getByText } = render(<Confirmation {...initialState} />);

    expect(await getByText(messageStr)).toBeInTheDocument();
    expect(await getByText(yesStr)).toBeInTheDocument();
    expect(await getByText(noStr)).toBeInTheDocument();
    expect(await container.querySelector("*")).toHaveClass(
      initialState.extraClassname
    );
  });

  it.each([yesStr, noStr])('Click "%s"', async (choiceStr) => {
    const user = userEvent.setup();
    const { getByText } = render(<Confirmation {...initialState} />);

    const btnEl = await getByText(choiceStr);
    expect(res).toBe("");
    await user.click(btnEl);
    expect(res).toBe(choiceStr);
  });
});
