/**
 * @vitest-environment jsdom
 */
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ButtonBack from "./ButtonBack";
import { ButtonComponentsType } from "@/components/Button/Button";

vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      back: () => null,
    };
  },
}));

describe.each(Object.keys(ButtonComponentsType))("ButtonBack $name", (name) => {
  const btnCompName: ButtonComponentsType =
    ButtonComponentsType[name as keyof typeof ButtonComponentsType];
  const buttonText = `My button ${name}`;
  const testValue = "Test value is";

  it("Rendered", () => {
    const { getByText } = render(
      <ButtonBack btnComponentName={btnCompName} children={buttonText} />
    );
    const btnEl = getByText(buttonText);
    expect(btnEl).toBeInTheDocument();
  });

  it("With callback", async () => {
    const user = userEvent.setup();
    const callbackFn = vi
      .fn()
      .mockImplementation(() => `${testValue}: ${name}`);
    const { getByText } = render(
      <ButtonBack
        btnComponentName={btnCompName}
        children={buttonText}
        callback={callbackFn}
      />
    );
    const btnEl = getByText(buttonText);
    expect(btnEl).toBeInTheDocument();
    await user.click(btnEl);
    expect(callbackFn).toHaveBeenCalledTimes(1);
    expect(callbackFn).toHaveReturnedWith(callbackFn());
  });

  it("With onClick", async () => {
    const user = userEvent.setup();
    const handleClick = vi
      .fn()
      .mockImplementation(() => `${testValue}: ${name}`);
    const { getByText } = render(
      <ButtonBack
        btnComponentName={btnCompName}
        children={buttonText}
        onClick={handleClick}
      />
    );
    const btnEl = getByText(buttonText);
    expect(btnEl).toBeInTheDocument();
    await user.click(btnEl);
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveReturnedWith(handleClick());
  });
});
