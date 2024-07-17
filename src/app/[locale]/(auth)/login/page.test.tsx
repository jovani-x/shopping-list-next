/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LoginPage from "./page";

const mocks = vi.hoisted(() => ({
  formStr: "Test login form",
}));

vi.mock("@/components/LoginForm/LoginForm", () => ({
  default: () => <>{mocks.formStr}</>,
}));

describe("Forget page", () => {
  it("Rendered", async () => {
    const jsx = await LoginPage({ params: { locale: "en" } });
    const { getByRole, getByText } = render(jsx);

    expect(getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(getByText(mocks.formStr)).toBeInTheDocument();
  });
});
