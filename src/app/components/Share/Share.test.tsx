/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Share from "./Share";
import userEvent from "@testing-library/user-event";

describe("Share", () => {
  it("Rendered", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const { getByText } = render(<Share onClick={handleClick} />);
    const shareEl = getByText("👥");
    expect(shareEl).toBeInTheDocument();
    await user.click(shareEl);
    expect(handleClick).toBeCalled();
  });
});
