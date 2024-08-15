/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import RequestItem from "./RequestItem";
import { getTestRequest } from "@/tests/test-utils";

const mocks = vi.hoisted(() => ({
  approveFun: vi.fn(),
  declineFun: vi.fn(),
}));

describe("RequestItem", () => {
  const btnApproveStr = "✅";
  const btnDeclineStr = "❌";
  const request = getTestRequest();
  const callArgs = { userId: request.from.id };

  it("Rendered", () => {
    const { getByText, container } = render(
      <RequestItem
        request={request}
        approveFun={mocks.approveFun}
        declineFun={mocks.declineFun}
      />
    );

    expect(getByText(request.from.userName)).toBeInTheDocument();
    expect(getByText(btnApproveStr)).toBeInTheDocument();
    expect(getByText(btnDeclineStr)).toBeInTheDocument();
    expect(getByText(request.text)).toBeInTheDocument();
  });

  it("Rendered without message", () => {
    const { getByText, container } = render(
      <RequestItem
        request={{ ...request, text: "" }}
        approveFun={mocks.approveFun}
        declineFun={mocks.declineFun}
      />
    );

    expect(getByText(request.from.userName)).toBeInTheDocument();
    expect(getByText(btnApproveStr)).toBeInTheDocument();
    expect(getByText(btnDeclineStr)).toBeInTheDocument();
    expect(container.querySelector("q")).toBeNull();
  });

  it("Clicked 'approve'", async () => {
    const user = userEvent.setup();
    const { getByText } = render(
      <RequestItem
        request={request}
        approveFun={mocks.approveFun}
        declineFun={mocks.declineFun}
      />
    );

    const btnEl = getByText(btnApproveStr);
    expect(btnEl).toBeInTheDocument();
    await user.click(btnEl);
    expect(mocks.approveFun).toBeCalledWith(callArgs);
  });

  it("Clicked 'decline'", async () => {
    const user = userEvent.setup();
    const { getByText } = render(
      <RequestItem
        request={request}
        approveFun={mocks.approveFun}
        declineFun={mocks.declineFun}
      />
    );

    const btnEl = getByText(btnDeclineStr);
    expect(btnEl).toBeInTheDocument();
    await user.click(btnEl);
    expect(mocks.declineFun).toBeCalledWith(callArgs);
  });
});
