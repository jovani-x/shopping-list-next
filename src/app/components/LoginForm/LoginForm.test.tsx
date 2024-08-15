/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";

const mocks = vi.hoisted(() => ({
  back: vi.fn(),
  authenticate: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter() {
    back: mocks.back;
  },
}));

vi.mock("@/app/helpers/actions", () => ({
  authenticate: mocks.authenticate,
}));

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn().mockImplementation(() => ({
    t: vi.fn().mockImplementation((key: string) => key),
  })),
}));

describe("Login form", () => {
  it("Rendered", () => {
    const { getByText, queryByRole, getByLabelText } = render(<LoginForm />);

    expect(getByLabelText("userName")).toBeInTheDocument();
    expect(getByLabelText("password")).toBeInTheDocument();
    const btn = getByText("login");
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();
    expect(getByText("createAccount")).toBeInTheDocument();
    expect(getByText("forgetPassword")).toBeInTheDocument();
    expect(getByText("or")).toBeInTheDocument();
    expect(queryByRole("alert")).toBeNull();
  });

  it("Fill username only", async () => {
    const user = userEvent.setup();
    const { getByText, getByLabelText } = render(<LoginForm />);

    const nameInput = getByLabelText("userName");
    await user.type(nameInput, "Test Username");
    const btn = getByText("login");
    expect(btn).toBeDisabled();
  });

  it("Fill password only", async () => {
    const user = userEvent.setup();
    const { getByText, getByLabelText } = render(<LoginForm />);

    const passInput = getByLabelText("password");
    await user.type(passInput, "pass12345");
    const btn = getByText("login");
    expect(btn).toBeDisabled();
  });

  it("Fill form", async () => {
    const user = userEvent.setup();
    const { getByText, getByLabelText } = render(<LoginForm />);

    const nameInput = getByLabelText("userName");
    await user.type(nameInput, "Test Username");
    const passInput = getByLabelText("password");
    await user.type(passInput, "pass12345");
    const btn = getByText("login");
    expect(btn).not.toBeDisabled();
  });

  it.todo("Submit form (success)");
  it.todo("Submit form (error)");
});
