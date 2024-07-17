/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import NotFound from "./page";

const mocks = vi.hoisted(() => ({
  notFoundStr: "Test not found",
}));

vi.mock("next/navigation", () => ({
  notFound: () => <p>{mocks.notFoundStr}</p>,
}));

describe("NotFound page", () => {
  it("Rendered", async () => {
    const { getByText } = render(<NotFound />);
    expect(getByText(mocks.notFoundStr)).toBeInTheDocument();
  });
});
