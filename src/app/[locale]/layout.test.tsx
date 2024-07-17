/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RootLayout from "./layout";

// layout.test.tsx
// https://github.com/testing-library/react-testing-library/issues/1250

const mocks = vi.hoisted(() => ({
  headerStr: "Test Header",
  footerStr: "Test Footer",
  menuStr: "Test Menu",
  token: "test_token",
  userName: "Test User",
  fontName: "testFont",
  getCurrentUser: vi
    .fn()
    .mockImplementation(() => ({ userName: mocks.userName })),
}));

vi.mock("@/app/helpers/utils", () => ({
  getAuthToken: vi.fn().mockImplementation(() => mocks.token),
  getCurrentUser: mocks.getCurrentUser,
}));

vi.mock("next/font/google", () => ({
  Inter: vi.fn().mockImplementation(() => ({
    className: mocks.fontName,
  })),
}));

vi.mock("@/components/Header/Header", () => ({
  default: () => <header>{mocks.headerStr}</header>,
}));

vi.mock("@/components/Footer/Footer", () => ({
  default: () => <footer>{mocks.footerStr}</footer>,
}));

vi.mock("@/components/Menu/Menu", () => ({
  default: () => <nav>{mocks.menuStr}</nav>,
}));

describe("RootLayout", () => {
  const childrenStr = "Test children";
  const childrenItems = <article>{childrenStr}</article>;
  const pageParams = { params: { locale: "en" }, children: childrenItems };

  it("Rendered", async () => {
    const jsx = await RootLayout(pageParams);
    const { getByRole, getByText } = render(jsx);

    const docEl = getByRole("document");
    expect(docEl).toBeInTheDocument();
    expect(docEl).toHaveAttribute("lang", pageParams.params.locale);
    expect(getByRole("article")).toBeInTheDocument();
    expect(getByText(childrenStr)).toBeInTheDocument();
    expect(getByText(mocks.headerStr)).toBeInTheDocument();
    expect(getByText(mocks.footerStr)).toBeInTheDocument();
    expect(getByText(mocks.menuStr)).toBeInTheDocument();
  });

  it("Rendered no userName", async () => {
    mocks.getCurrentUser.mockImplementation(() => "");
    const jsx = await RootLayout(pageParams);
    const { getByRole, getByText } = render(jsx);

    const docEl = getByRole("document");
    expect(docEl).toBeInTheDocument();
    expect(docEl).toHaveAttribute("lang", pageParams.params.locale);
    expect(getByRole("article")).toBeInTheDocument();
    expect(getByText(childrenStr)).toBeInTheDocument();
    expect(getByText(mocks.headerStr)).toBeInTheDocument();
    expect(getByText(mocks.footerStr)).toBeInTheDocument();
    expect(getByText(mocks.menuStr)).toBeInTheDocument();
  });
});
