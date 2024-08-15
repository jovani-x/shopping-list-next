/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SelectControl from "./SelectControl";

describe("SelectControl", () => {
  const fakeFieldState = vi.fn().mockImplementation((name) => ({
    error: null,
  }));
  const opts = [
    { value: "test_value_1", label: "Test label 1" },
    { value: "test_value_2" },
  ];
  const controlProps = {
    label: "Test label",
    id: "test_control_id",
    placeholder: "Test placeholder",
    required: false,
    name: "test_control",
    fieldState: fakeFieldState,
    options: opts,
  };
  const registerProps = {};
  const register = vi.fn();

  it("Rendered", () => {
    const { getByText, getByLabelText, getAllByRole, queryByRole } = render(
      <SelectControl
        controlProps={controlProps}
        register={register}
        registerProps={registerProps}
      />
    );
    expect(getByLabelText(controlProps.label)).toBeInTheDocument();
    const optionEls = getAllByRole("option");
    expect(optionEls.length).toBe(1 + opts.length);
    expect(optionEls[0]).toHaveAttribute("value", "");
    expect(getByText(controlProps.placeholder)).toBeInTheDocument();
    for (const { value, label } of opts) {
      expect(getByText(label ?? value)).toBeInTheDocument();
    }
    expect(queryByRole("alert")).toBeNull();
  });

  it("Rendered (error)", () => {
    fakeFieldState.mockImplementationOnce(() => ({
      error: { message: "Test error" },
    }));
    const { getByRole } = render(
      <SelectControl
        controlProps={controlProps}
        register={register}
        registerProps={registerProps}
      />
    );

    expect(getByRole("alert")).toBeInTheDocument();
  });

  it.todo("Required");
});
