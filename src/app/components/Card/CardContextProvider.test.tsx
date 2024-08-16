/**
 * @vitest-environment jsdom
 */
import { render, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import CardContextProvider, {
  useCardContext,
  cardContextErrorMessage,
} from "./CardContextProvider";
import React, { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { getTestCard } from "@/tests/test-utils";

const consoleLogMock = vi
  .spyOn(global.console, "error")
  .mockImplementation(() => vi.fn());

afterEach(() => {
  consoleLogMock.mockClear();
});

describe("ProvideUserContext", () => {
  it("Successful", () => {
    const card = getTestCard();
    const testValue = {
      card: card,
      cardChanges: card,
      isChanged: false,
      isDone: card.isDone,
      setCardChanges: vi.fn(),
      setIsChanged: vi.fn(),
      setIsDone: vi.fn(),
      shareAction: vi.fn(),
      editAction: vi.fn(),
      shoppingAction: vi.fn(),
      saveAction: vi.fn(),
      deleteAction: vi.fn(),
      setAllProductsDone: vi.fn(),
      updateProduct: vi.fn(),
    };
    const wrapper = ({ children }: { children: ReactNode }) => (
      <CardContextProvider value={testValue}>{children}</CardContextProvider>
    );
    const { result } = renderHook(useCardContext, { wrapper });
    expect(result.current).toEqual(testValue);
  });

  it("Faild", () => {
    const errorMessage = cardContextErrorMessage;
    const TestComponent = () => {
      const testCtx = useCardContext();
      return <>{testCtx}</>;
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
