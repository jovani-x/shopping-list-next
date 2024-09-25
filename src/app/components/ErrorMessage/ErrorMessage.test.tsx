/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ErrorMessage, { transformErrIntoText, wrapIntoP } from "./ErrorMessage";
import { ReactElement } from "react";

describe("ErrorMessage", () => {
  const errorMsg = "It's a error message";

  it("Rendered text", () => {
    const { getByText, getAllByRole } = render(
      <ErrorMessage text={errorMsg} />
    );
    const res = transformErrIntoText(errorMsg) as ReactElement[];
    const expArr = [errorMsg];

    expect(getAllByRole("paragraph")).toHaveLength(expArr.length);

    expArr.forEach((expEl, ix) => {
      expect(getByText(expEl)).toBeInTheDocument();
      expect(res[ix]?.type).toBe("p");
      expect(res[ix]?.key).toBe(`${ix}`);
      expect(res[ix]?.props?.children).toBe(expEl);
    });
  });

  it("Rendered object", () => {
    const obj = { message: errorMsg, reason: "test reason" };
    const { getByText, getAllByRole } = render(<ErrorMessage text={obj} />);
    const res = transformErrIntoText(obj) as ReactElement[];
    const expArr = [`message: ${obj.message}`, `reason: ${obj.reason}`];

    expect(getAllByRole("paragraph")).toHaveLength(expArr.length);

    expArr.forEach((expEl, ix) => {
      expect(getByText(expEl)).toBeInTheDocument();
      expect(res[ix]?.type).toBe("p");
      expect(res[ix]?.key).toBe(`${ix}`);
      expect(res[ix]?.props?.children).toBe(expEl);
    });
  });

  it("Rendered array", () => {
    const expArr = [errorMsg, "test message 2"];
    const { getByText, getAllByRole } = render(<ErrorMessage text={expArr} />);
    const res = transformErrIntoText(expArr) as ReactElement[];

    expect(getAllByRole("paragraph")).toHaveLength(expArr.length);
    expArr.forEach((expEl, ix) => {
      expect(getByText(expEl)).toBeInTheDocument();
      expect(res[ix]?.type).toBe("p");
      expect(res[ix]?.key).toBe(`${ix}`);
      expect(res[ix]?.props?.children).toBe(expEl);
    });
  });

  it.each([undefined, null])("Rendered %s", (value) => {
    const { container } = render(<ErrorMessage text={value} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("wrapIntoP text", () => {
    const ix = 0;
    const res = wrapIntoP(errorMsg, ix);

    expect(res?.type).toBe("p");
    expect(res?.key).toBe(`${ix}`);
    expect(res?.props?.children).toBe(errorMsg);
  });

  it("wrapIntoP [key, value]", () => {
    const ix = 1;
    const key = "message";
    const value = errorMsg;
    const expArr = [key, value];
    const res = wrapIntoP(expArr, ix);

    expect(res?.type).toBe("p");
    expect(res?.key).toBe(`${ix}`);
    expect(res?.props?.children).toBe(`${String(key)}: ${String(value)}`);
  });

  it.each([true, false, 0, 100, -10])("transformErrIntoText %s", (value) => {
    const res = transformErrIntoText(value);

    expect(res).toBe(String(value));
  });
});
