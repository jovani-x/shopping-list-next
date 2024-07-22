/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CardFilter from "./CardFilter";
import userEvent from "@testing-library/user-event";

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn().mockImplementation(() => ({
    t: vi.fn().mockImplementation((key: string) => key),
  })),
}));

describe("Card Filter", () => {
  const checkboxNames = ["unfinished", "done"] as const;
  const initialState = Object.fromEntries(
    checkboxNames.map((v) => [v, false])
  ) as { unfinished: boolean; done: boolean };

  it("Rendered", async () => {
    const handleUpdate = vi.fn();
    const { getByText } = render(
      <CardFilter filterState={initialState} setFilterState={handleUpdate} />
    );
    expect(await getByText(/filter/i)).toBeInTheDocument();
    expect(await getByText(/unfinished/i)).toBeInTheDocument();
    expect(await getByText(/done/i)).toBeInTheDocument();
  });

  it.each(checkboxNames)('Click "%s"', async (checkName) => {
    let testObj = { ...initialState };
    const handleUpdate = vi
      .fn()
      .mockImplementation(
        ({ unfinished, done }: { unfinished: boolean; done: boolean }) => {
          testObj = { ...testObj, unfinished, done };
          return { ...testObj };
        }
      );
    const user = userEvent.setup();
    const { getByLabelText } = render(
      <CardFilter filterState={initialState} setFilterState={handleUpdate} />
    );
    const checkboxEl = await getByLabelText(checkName);
    expect(checkboxEl).not.toBeChecked();
    await user.click(checkboxEl);
    expect(checkboxEl).toBeChecked();
    expect(testObj[checkName]).toBeTruthy();
    await user.click(checkboxEl);
    expect(checkboxEl).not.toBeChecked();
    expect(testObj[checkName]).toBeFalsy();
  });
});
