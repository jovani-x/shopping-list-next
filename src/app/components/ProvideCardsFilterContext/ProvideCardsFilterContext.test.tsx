/**
 * @vitest-environment jsdom
 */
import { render, renderHook } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import ProvideCardsFilterContext, {
  useCardsFilterContext,
  cardsFilterContextErrorMessage,
} from "./ProvideCardsFilterContext";
import React, { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

const consoleLogMock = vi
  .spyOn(global.console, "error")
  .mockImplementation(() => vi.fn());

afterEach(() => {
  consoleLogMock.mockClear();
});

describe("ProvideCardsFilterContext", () => {
  it.each([
    { unfinished: true, done: true },
    { unfinished: true, done: false },
    { unfinished: false, done: true },
    { unfinished: false, done: false },
  ])("Successful with %s", (testState) => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ProvideCardsFilterContext value={{ filterState: testState }}>
        {children}
      </ProvideCardsFilterContext>
    );
    const { result } = renderHook(useCardsFilterContext, { wrapper });

    expect(result.current.filterState).toEqual(testState);
  });

  it("Faild", () => {
    const errorMessage = cardsFilterContextErrorMessage;
    const TestComponent = () => {
      const { filterState } = useCardsFilterContext();
      return <>{filterState}</>;
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
