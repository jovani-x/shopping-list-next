/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CreateCardPage from "./page";

const mocks = vi.hoisted(() => ({
  formStr: "Test CardForm",
  btnBack: "Test back",
}));

vi.mock("@/components/ButtonBack/ButtonBack", () => ({
  default: () => <div>{mocks.btnBack}</div>,
}));

vi.mock("@/components/CardForm/CardForm", () => ({
  default: () => <div>{mocks.formStr}</div>,
}));

describe("Create card page", () => {
  it("Rendered", async () => {
    const jsx = await CreateCardPage({ params: { locale: "en" } });
    const { getByText } = render(jsx);

    expect(getByText(mocks.formStr)).toBeInTheDocument();
    expect(getByText(mocks.btnBack)).toBeInTheDocument();
  });
});
