/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FriendRequestList from "./FriendRequestList";
import { getTestRequest } from "@/tests/test-utils";
import { IRequest } from "@/app/helpers/types";

const mocks = vi.hoisted(() => ({
  requestItemStr: "Test Request Item",
  useStreamListener: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn().mockImplementation(() => ({
    t: vi.fn().mockImplementation((key: string) => key),
  })),
}));

vi.mock("@/components/RequestItem/RequestItem", () => ({
  default: () => <div>{mocks.requestItemStr}</div>,
}));

vi.mock("@/app/helpers/listener", () => ({
  useStreamListener: mocks.useStreamListener,
}));

describe("FriendRequestList", () => {
  const emptyStr = "noOne";

  it("Rendered", () => {
    const requests = [getTestRequest()];
    mocks.useStreamListener.mockImplementationOnce(() => requests);
    const { queryByText, getByText } = render(
      <FriendRequestList requests={requests} />
    );

    expect(getByText(mocks.requestItemStr)).toBeInTheDocument();
    expect(queryByText(emptyStr)).toBeNull();
    expect(mocks.useStreamListener).toBeCalledTimes(1);
  });

  it("Rendered (empty)", () => {
    const requests: IRequest[] = [];
    mocks.useStreamListener.mockImplementationOnce(() => requests);
    const { queryByText, getByText } = render(
      <FriendRequestList requests={requests} />
    );
    expect(getByText(emptyStr)).toBeInTheDocument();
    expect(queryByText(mocks.requestItemStr)).toBeNull();
  });
});
