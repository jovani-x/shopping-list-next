/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import YCenteredBlock from "./YCenteredBlock";

describe("YCenteredBlock", () => {
  it("Rendered", () => {
    const str = "Test string";
    const { container, getByText, getByRole } = render(
      <YCenteredBlock>
        <p>{str}</p>
      </YCenteredBlock>
    );

    const el = container.querySelector("div");
    expect(el).toBeInTheDocument();
    expect(getByText(str)).toBeInTheDocument();
    expect(getByRole("paragraph")).toBeInTheDocument();
  });
});
