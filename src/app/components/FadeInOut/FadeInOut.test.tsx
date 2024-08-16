/**
 * @vitest-environment jsdom
 */
import { render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import FadeInOut from "./FadeInOut";
import { useState } from "react";

describe("FadeInOut", () => {
  const testStr = "Test line";
  const toggleStr = "Test toggle";
  const TestComponent = ({ isVisible = false }: { isVisible?: boolean }) => {
    const [isShown, setShown] = useState(isVisible);
    return (
      <>
        <button onClick={() => setShown(!isShown)}>{toggleStr}</button>
        <FadeInOut isShown={isShown} duration={500}>
          {testStr}
        </FadeInOut>
      </>
    );
  };

  it("Rendered", () => {
    const { getByText } = render(
      <FadeInOut isShown={true}>{testStr}</FadeInOut>
    );
    expect(getByText(testStr)).toBeInTheDocument();
  });

  it("Rendered (hidden)", () => {
    const { container, queryByText } = render(
      <FadeInOut isShown={false}>{testStr}</FadeInOut>
    );
    expect(queryByText(testStr)).toBeNull();
    expect(container).toBeEmptyDOMElement();
  });

  it("Rendered (toggle)", async () => {
    const user = userEvent.setup();
    const { container, queryByText, getByText } = render(<TestComponent />);

    expect(queryByText(testStr)).toBeNull();
    const btnEl = getByText(toggleStr);
    await user.click(btnEl);
    waitFor(() => {
      expect(getByText(testStr)).toBeInTheDocument();
      expect(container).toBeEmptyDOMElement();
    });
    await user.click(btnEl);
    waitFor(() => expect(queryByText(testStr)).toBeNull());
  });
});
