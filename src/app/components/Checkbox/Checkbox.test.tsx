/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, it, vi, expect, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import Checkbox from "./Checkbox";
import { useForm, useController } from "react-hook-form";

describe("Checkbox", () => {
  const labelText = "my checkbox";
  const initialState = false;
  let res = initialState;
  const handleChange = vi.fn().mockImplementation((isChecked) => {
    res = isChecked;
  });

  const TestComponentWithControl = () => {
    const { control } = useForm<{
      test: boolean;
    }>();

    const { field } = useController({
      name: "test",
      control,
      defaultValue: initialState,
    });

    return (
      <Checkbox
        text={labelText}
        checked={!!field.value}
        onChange={handleChange}
        control={control}
      />
    );
  };

  afterEach(() => {
    res = initialState;
    vi.clearAllMocks();
  });

  it("Rendered checkbox", async () => {
    const { getByLabelText } = render(
      <Checkbox
        text={labelText}
        checked={initialState}
        onChange={handleChange}
      />
    );

    expect(await getByLabelText(labelText)).not.toBeChecked();
  });

  it("Rendered checkbox (control)", async () => {
    const { getByLabelText } = render(<TestComponentWithControl />);

    expect(await getByLabelText(labelText)).not.toBeChecked();
  });

  it("Click checkbox", async () => {
    const user = userEvent.setup();
    const { getByLabelText } = render(
      <Checkbox
        text={labelText}
        checked={initialState}
        onChange={handleChange}
      />
    );

    const checkboxEl = await getByLabelText(labelText);
    expect(res).toBe(initialState);
    await user.click(checkboxEl);
    expect(checkboxEl).toBeChecked();
    expect(res).toBe(!initialState);

    await user.click(checkboxEl);
    expect(checkboxEl).not.toBeChecked();
    expect(res).toBe(initialState);
  });

  it("Click checkbox (control)", async () => {
    const user = userEvent.setup();
    const { getByLabelText } = render(<TestComponentWithControl />);

    const checkboxEl = await getByLabelText(labelText);
    expect(res).toBe(initialState);
    await user.click(checkboxEl);
    expect(checkboxEl).toBeChecked();
    expect(res).toBe(!initialState);

    await user.click(checkboxEl);
    expect(checkboxEl).not.toBeChecked();
    expect(res).toBe(initialState);
  });
});
