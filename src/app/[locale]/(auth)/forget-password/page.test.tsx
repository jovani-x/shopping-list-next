/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ForgetPasswordPage from "./page";

const mocks = vi.hoisted(() => ({
  formStr: "Test forget form",
}));

vi.mock("@/components/ForgetPasswordForm/ForgetPasswordForm", () => ({
  default: () => <>{mocks.formStr}</>,
}));

describe("Forget page", () => {
  it("Rendered", async () => {
    const jsx = await ForgetPasswordPage({ params: { locale: "en" } });
    const { getByRole, getByText } = render(jsx);

    expect(getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(getByText(mocks.formStr)).toBeInTheDocument();
  });
});
