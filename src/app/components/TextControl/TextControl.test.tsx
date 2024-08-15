/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TextControl, { TextControlTypes } from "./TextControl";

describe("TextControl", () => {
  const fakeFieldState = vi.fn().mockImplementation((name) => ({
    error: null,
  }));
  const textControlProps = {
    label: "Test label",
    id: "test_control_id",
    type: TextControlTypes.TEXT,
    placeholder: "Test placeholder",
    required: false,
    name: "test_control",
    fieldState: fakeFieldState,
  };
  const registerProps = {};
  const register = vi.fn();
  const types = Object.values(TextControlTypes);

  describe.each(types)("Type %s", (type) => {
    it("Rendered", () => {
      const { getByLabelText, queryByRole } = render(
        <TextControl
          controlProps={{ ...textControlProps, type }}
          register={register}
          registerProps={registerProps}
        />
      );

      const inputEl = getByLabelText(textControlProps.label);
      expect(inputEl).toBeInTheDocument();
      expect(inputEl).toHaveAttribute("id", textControlProps.id);
      expect(inputEl).toHaveAttribute(
        "placeholder",
        textControlProps.placeholder
      );
      expect(inputEl).not.toBeRequired();
      const tagStr = inputEl.tagName.toLowerCase();
      if (tagStr === "input") {
        expect(inputEl).toHaveAttribute("type", type);
      } else {
        expect(tagStr).toBe(type);
      }
      expect(queryByRole("alert")).toBeNull();
    });

    it.skip("Rendered (required)", () => {
      const { getByLabelText } = render(
        <TextControl
          controlProps={{ ...textControlProps, type, required: true }}
          register={register}
          registerProps={registerProps}
        />
      );

      expect(getByLabelText(textControlProps.label)).toBeRequired();
    });

    it("Rendered (error)", () => {
      fakeFieldState.mockImplementationOnce((name) => ({
        error: { message: "Test error" },
      }));

      const { getByRole } = render(
        <TextControl
          controlProps={{ ...textControlProps, type, required: true }}
          register={register}
          registerProps={registerProps}
        />
      );

      expect(getByRole("alert")).toBeInTheDocument();
    });
  });

  it("Default type", () => {
    const { label, id, placeholder, required, name, fieldState } =
      textControlProps;
    const { getByLabelText } = render(
      <TextControl
        controlProps={{ label, id, placeholder, required, name, fieldState }}
        register={register}
        registerProps={registerProps}
      />
    );

    const inputEl = getByLabelText(textControlProps.label);
    expect(inputEl).toBeInTheDocument();
    expect(inputEl).toHaveAttribute("type", TextControlTypes.TEXT);
  });
});
