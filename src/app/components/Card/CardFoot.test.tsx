/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import CardFootContent from "./CardFoot";

const mocks = vi.hoisted(() => ({
  setAllProductsDone: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn().mockImplementation(() => ({
    t: vi.fn().mockImplementation((key: string) => key),
  })),
}));

vi.mock("./CardContextProvider", () => ({
  useCardContext() {
    return {
      setAllProductsDone: mocks.setAllProductsDone,
    };
  },
}));

describe("CardFootContent", () => {
  const btnStr = /done/i;

  it("Rendered", () => {
    const { getByText } = render(<CardFootContent />);
    expect(getByText(btnStr)).toBeInTheDocument();
  });

  it("Clicked 'done'", async () => {
    const user = userEvent.setup();
    const { getByText } = render(<CardFootContent />);
    const btnEl = getByText(btnStr);
    await user.click(btnEl);
    expect(mocks.setAllProductsDone).toBeCalled();
  });
});
