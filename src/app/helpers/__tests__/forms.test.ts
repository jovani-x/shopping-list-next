/**
 * @vitest-environment jsdom
 */
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  useUserNameProps,
  usePasswordProps,
  useConfirmPasswordProps,
  useEmailProps,
  useMessageProps,
} from "@/app/helpers/forms";
import { TextControlTypes } from "@/app/components/TextControl/TextControl";

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn().mockImplementation(() => ({
    t: (key: string) => key,
  })),
}));

describe("Form hooks", () => {
  it("useUserNameProps", () => {
    const { result } = renderHook(() => useUserNameProps());
    expect(result.current).toEqual({
      label: "userName",
      id: "userName",
      type: TextControlTypes.TEXT,
      placeholder: "yourLogin",
      required: true,
      name: "userName",
      fieldState: expect.any(Function),
    });
  });

  it("usePasswordProps", () => {
    const { result } = renderHook(() => usePasswordProps());
    expect(result.current).toEqual({
      label: "password",
      id: "password",
      type: TextControlTypes.PASSWORD,
      placeholder: "yourPassword",
      required: true,
      name: "password",
      fieldState: expect.any(Function),
    });
  });

  it("useConfirmPasswordProps", () => {
    const { result } = renderHook(() => useConfirmPasswordProps());
    expect(result.current).toEqual({
      label: "confirmPassword",
      id: "confirmPassword",
      type: TextControlTypes.PASSWORD,
      placeholder: "yourPassword",
      required: true,
      name: "confirmPassword",
      fieldState: expect.any(Function),
    });
  });

  it("useEmailProps", () => {
    const { result } = renderHook(() => useEmailProps());
    expect(result.current).toEqual({
      label: "email",
      id: "email",
      type: TextControlTypes.EMAIL,
      placeholder: "yourEmail",
      required: true,
      name: "email",
      fieldState: expect.any(Function),
    });
  });

  it("useMessageProps", () => {
    const { result } = renderHook(() => useMessageProps());
    expect(result.current).toEqual({
      label: "message",
      id: "message",
      type: TextControlTypes.TEXTAREA,
      placeholder: "yourMessage",
      required: false,
      name: "message",
      fieldState: expect.any(Function),
    });
  });
});
