/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import RegisterForm from "./RegisterForm";

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  registerUser: vi.fn(),
  pending: false,
}));

vi.mock("next/navigation", () => ({
  useRouter() {
    back: mocks.push;
  },
}));

vi.mock("@/app/helpers/actions", () => ({
  registerUser: mocks.registerUser,
}));

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn().mockImplementation(() => ({
    t: vi.fn().mockImplementation((key: string) => key),
  })),
}));

vi.mock("react-dom", async (importOriginal) => {
  const orig: object = await importOriginal();
  return {
    ...orig,
    useFormStatus: vi.fn().mockImplementation(() => ({
      pending: mocks.pending,
    })),
  };
});

afterEach(() => {
  mocks.pending = false;
});

describe("Register form", () => {
  const btnStr = "createAccount";
  const nameStr = "userName";
  const emailStr = "email";
  const passStr = "password";
  const confPassStr = "confirmPassword";
  const inputEntArr = [
    { name: nameStr, value: "Test User" },
    { name: emailStr, value: "test.email@test.test" },
    { name: passStr, value: "pass12345" },
    { name: confPassStr, value: "pass12345" },
  ];

  it("Rendered", () => {
    const { getByText, queryByRole, getByLabelText } = render(<RegisterForm />);

    for (const { name } of inputEntArr) {
      expect(getByLabelText(name)).toBeInTheDocument();
    }
    const btnEl = getByText(btnStr);
    expect(btnEl).toBeInTheDocument();
    expect(btnEl).toBeDisabled();
    expect(getByText("login")).toBeInTheDocument();
    expect(getByText("forgetPassword")).toBeInTheDocument();
    expect(getByText("or")).toBeInTheDocument();
    expect(queryByRole("alert")).toBeNull();
  });

  it.each(inputEntArr)("Fill $name only", async ({ name, value }) => {
    const user = userEvent.setup();
    const { getByText, getByLabelText } = render(<RegisterForm />);

    const inputEl = getByLabelText(name);
    await user.type(inputEl, value);
    expect(getByLabelText(name)).toHaveDisplayValue(value);
    expect(getByText(btnStr)).toBeDisabled();
  });

  it("Fill form", async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByText } = render(<RegisterForm />);

    for (const { name, value } of inputEntArr) {
      const inputEl = getByLabelText(name);
      await user.type(inputEl, value);
    }
    inputEntArr.map(({ name, value }) => {
      expect(getByLabelText(name)).toHaveDisplayValue(value);
    });
    expect(getByText(btnStr)).not.toBeDisabled();
  });

  it("Fill form (pending)", async () => {
    mocks.pending = true;
    const user = userEvent.setup();
    const { getByLabelText, getByText } = render(<RegisterForm />);

    for (const { name, value } of inputEntArr) {
      const inputEl = getByLabelText(name);
      await user.type(inputEl, value);
    }
    inputEntArr.map(({ name, value }) => {
      expect(getByLabelText(name)).toHaveDisplayValue(value);
    });
    // due to pending
    expect(getByText(btnStr)).toBeDisabled();
  });

  it.todo("Submit form (success)");
  it.todo("Submit form (error)");
});
