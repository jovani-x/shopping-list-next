/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ErrorMessage from "./ErrorMessage";

describe("ErrorMessage", () => {
  const errorMsg = "It's a error message";

  it("Rendered", () => {
    const { getByText } = render(<ErrorMessage text={errorMsg} />);
    expect(getByText(errorMsg)).toBeInTheDocument();
  });
});
