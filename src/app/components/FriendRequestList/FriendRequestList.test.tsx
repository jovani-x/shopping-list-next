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
  initStreamListener: vi.fn(),
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
  initStreamListener: mocks.initStreamListener,
}));

describe("FriendRequestList", () => {
  const emptyStr = "noOne";

  it("Rendered", () => {
    const requests = [getTestRequest()];
    const { queryByText, getByText } = render(
      <FriendRequestList requests={requests} />
    );

    expect(getByText(mocks.requestItemStr)).toBeInTheDocument();
    expect(queryByText(emptyStr)).toBeNull();
    expect(mocks.initStreamListener).toBeCalledTimes(1);
  });

  it("Rendered (empty)", () => {
    const requests: IRequest[] = [];
    const { queryByText, getByText } = render(
      <FriendRequestList requests={requests} />
    );
    expect(getByText(emptyStr)).toBeInTheDocument();
    expect(queryByText(mocks.requestItemStr)).toBeNull();
  });
});
