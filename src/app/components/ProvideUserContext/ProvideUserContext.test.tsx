/**
 * @vitest-environment jsdom
 */
import { render, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ProvideUserContext, {
  useUserContext,
  userContextErrorMessage,
} from "./ProvideUserContext";
import React, { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

const consoleLogMock = vi
  .spyOn(global.console, "error")
  .mockImplementation(() => vi.fn());

afterEach(() => {
  consoleLogMock.mockClear();
});

describe("ProvideUserContext", () => {
  const userNameStr = "Test user";

  it("Successful", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ProvideUserContext value={{ userName: userNameStr }}>
        {children}
      </ProvideUserContext>
    );
    const { result } = renderHook(useUserContext, { wrapper });
    expect(result.current.userName).toBe(userNameStr);
  });

  it("Faild", () => {
    const errorMessage = userContextErrorMessage;
    const TestComponent = () => {
      const { userName } = useUserContext();
      return <>{userName}</>;
    };
    const ErrorMsg = () => <>{errorMessage}</>;
    const { getByText } = render(
      <ErrorBoundary fallback={<ErrorMsg />}>
        <TestComponent />
      </ErrorBoundary>
    );

    expect(getByText(errorMessage)).toBeInTheDocument();
  });
});
