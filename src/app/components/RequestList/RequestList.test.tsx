/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RequestList from "./RequestList";
import { getTestRequest } from "@/tests/test-utils";
import { IRequest } from "@/app/helpers/types";
import initTranslations from "@/app/i18n";

const mocks = vi.hoisted(() => ({
  requestItemStr: "Test Request Item",
  approveFun: vi.fn(),
  declineFun: vi.fn(),
}));

describe("RequestList", async () => {
  const { t } = await initTranslations("en");
  const emptyStr = t("noOne");

  vi.mock("@/components/RequestItem/RequestItem", () => ({
    default: () => <div>{mocks.requestItemStr}</div>,
  }));

  vi.mock("@/app/helpers/language", () => ({
    getCurrentLocale: vi.fn().mockImplementation(() => "en"),
  }));

  it("Rendered", async () => {
    const requests = [getTestRequest()];
    const jsx = await RequestList({
      requests,
      approveFun: mocks.approveFun,
      declineFun: mocks.declineFun,
    });
    const { getByText, queryByText } = render(jsx);
    expect(getByText(mocks.requestItemStr)).toBeInTheDocument();
    expect(queryByText(emptyStr)).toBeNull();
  });

  it("Rendered (empty)", async () => {
    const requests: IRequest[] = [];
    const jsx = await RequestList({
      requests,
      approveFun: mocks.approveFun,
      declineFun: mocks.declineFun,
    });
    const { getByText, queryByText } = render(jsx);
    expect(getByText(emptyStr)).toBeInTheDocument();
    expect(queryByText(mocks.requestItemStr)).toBeNull();
  });
});
