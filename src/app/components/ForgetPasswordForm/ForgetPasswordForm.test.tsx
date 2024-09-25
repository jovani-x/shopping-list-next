/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import ForgetPasswordForm from "./ForgetPasswordForm";

const mocks = vi.hoisted(() => ({
  forgetPassword: vi.fn(),
  pending: false,
}));

vi.mock("@/app/helpers/actions", () => ({
  forgetPassword: mocks.forgetPassword,
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

describe("Forget form", () => {
  it("Rendered", () => {
    const { getByRole, getByText, queryByRole } = render(
      <ForgetPasswordForm />
    );

    expect(getByRole("textbox")).toBeInTheDocument();
    const btn = getByText("restoreAccess");
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();
    expect(getByText("login")).toBeInTheDocument();
    expect(getByText("createAccount")).toBeInTheDocument();
    expect(getByText("or")).toBeInTheDocument();
    expect(queryByRole("alert")).toBeNull();
  });

  it("Submit (error)", async () => {
    const user = userEvent.setup();
    const { getByRole, getByText, queryByRole } = render(
      <ForgetPasswordForm />
    );

    const textbox = getByRole("textbox");
    await user.type(textbox, "wrong_email_str");
    const btn = getByText("restoreAccess");
    expect(btn).not.toBeDisabled();
    // await user.click(btn);
    // form action:
    // https://github.com/vercel/next.js/issues/54757
    // expect(mocks.forgetPassword).toBeCalled();
    // expect(queryByRole("alert")).toBeInTheDocument();
  });

  it("Submit", async () => {
    const user = userEvent.setup();
    const { getByRole, getByText, queryByRole } = render(
      <ForgetPasswordForm />
    );

    const textbox = getByRole("textbox");
    await user.type(textbox, "test.email@test.test");
    const btn = getByText("restoreAccess");
    expect(btn).not.toBeDisabled();
    // await user.click(btn);
    // form action:
    // https://github.com/vercel/next.js/issues/54757
    // expect(mocks.forgetPassword).toBeCalled();
    // expect(queryByRole("alert")).toBeInTheDocument();
  });

  it("Submit (pending)", async () => {
    mocks.pending = true;
    const user = userEvent.setup();
    const { getByRole, getByText, queryByRole } = render(
      <ForgetPasswordForm />
    );

    const textbox = getByRole("textbox");
    await user.type(textbox, "test.email@test.test");
    const btn = getByText("restoreAccess");
    expect(btn).toBeDisabled();
    // await user.click(btn);
    // form action:
    // https://github.com/vercel/next.js/issues/54757
    // expect(mocks.forgetPassword).toBeCalled();
    // expect(queryByRole("alert")).toBeInTheDocument();
  });
});
