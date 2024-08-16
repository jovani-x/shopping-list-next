/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Button, { ButtonContrast, ButtonSimple, ButtonTypes } from "./Button";

describe.each([
  { name: "Button", TagName: Button },
  { name: "ButtonContrast", TagName: ButtonContrast },
  { name: "ButtonSimple", TagName: ButtonSimple },
])("$name", ({ TagName, name }) => {
  const buttonText = `My button ${name}`;
  const buttonTypes = Object.values(ButtonTypes);

  it("Rendered (custom classname and disabled)", () => {
    const customCls = "custom-class";
    const { container } = render(
      <TagName disabled={true} extraClassname={customCls}>
        {buttonText}
      </TagName>
    );
    const btnEl = container.querySelector("*");
    expect(btnEl).toBeInTheDocument();
    expect(btnEl?.className.indexOf(customCls)).not.toBe(-1);
    expect(btnEl?.getAttribute("disabled")).not.toBeNull();
  });

  it.each(buttonTypes)("Rendered type %s (a - link)", (type) => {
    const { container } = render(
      <TagName type={type} href={"#"}>
        {buttonText}
      </TagName>
    );
    const btnEl = container.querySelector("*");
    expect(btnEl?.getAttribute("type")).toBeNull();
    expect(btnEl?.tagName.toLocaleLowerCase()).toBe("a");
  });

  it.each(buttonTypes)("Rendered type %s (button)", (type) => {
    const { container } = render(<TagName type={type}>{buttonText}</TagName>);
    const btnEl = container.querySelector("*");
    expect(btnEl?.getAttribute("type")).toBe(type);
    expect(btnEl?.tagName.toLocaleLowerCase()).toBe("button");
  });

  it(`Clicked ${TagName.name}`, async () => {
    const testValue = "str";
    const user = userEvent.setup();
    const clickHandle = vi.fn().mockImplementation(() => testValue);
    const { container } = render(
      <TagName onClick={clickHandle}>{buttonText}</TagName>
    );
    const btnEl = container.querySelector("*");

    if (btnEl) {
      await user.click(btnEl);
      expect(clickHandle).toHaveBeenCalledTimes(1);
      expect(clickHandle).toHaveReturnedWith(testValue);
    } else {
      expect(btnEl).toBeInTheDocument();
    }
  });
});
