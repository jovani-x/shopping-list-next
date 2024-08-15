/**
 * @vitest-environment jsdom
 */
import { render, renderHook } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import ProvideMenuContext, {
  useMenuContext,
  menuContextErrorMessage,
} from "./ProvideMenuContext";
import React, { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

const consoleLogMock = vi
  .spyOn(global.console, "error")
  .mockImplementation(() => vi.fn());

afterEach(() => {
  consoleLogMock.mockClear();
});

describe("ProvideMenuContext", () => {
  it.each([true, false])("Successful with %s", (menuValue) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ProvideMenuContext opts={{ isMenuVisible: menuValue }}>
        {children}
      </ProvideMenuContext>
    );
    const { result } = renderHook(useMenuContext, { wrapper });
    expect(result.current.isMenuVisible).toBe(menuValue);
  });

  it("Faild", () => {
    const errorMessage = menuContextErrorMessage;
    const TestComponent = () => {
      const { isMenuVisible } = useMenuContext();
      return <>{isMenuVisible}</>;
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
