/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RegisterPage from "./page";

const mocks = vi.hoisted(() => ({
  formStr: "Test register form",
  handleBack: vi.fn(),
}));

vi.mock("@/components/RegisterForm/RegisterForm", () => ({
  default: () => <>{mocks.formStr}</>,
}));

vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      back: mocks.handleBack,
    };
  },
}));

describe("Register page", () => {
  it("Rendered", async () => {
    const jsx = await RegisterPage({ params: { locale: "en" } });
    const { getByRole, getByText } = render(jsx);
    expect(getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(getByText(mocks.formStr)).toBeInTheDocument();
    expect(getByText(/back/i)).toBeInTheDocument();
  });
});
