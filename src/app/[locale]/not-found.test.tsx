/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import NotFoundPage from "./not-found";

vi.mock("@/app/helpers/language", () => ({
  getCurrentLocale: vi.fn(),
}));

describe("NotFoundPage", () => {
  it("Rendered", async () => {
    const jsx = await NotFoundPage();
    const { getByRole, getByText } = render(jsx);

    expect(getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(getByText("404")).toBeInTheDocument();
    const linkEl = getByRole("link");
    expect(linkEl).toBeInTheDocument();
    expect(linkEl).toHaveAttribute("href", "/");
  });
});
