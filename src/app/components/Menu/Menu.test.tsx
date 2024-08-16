/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import Menu from "./Menu";
import ProvideMenuContext from "@/components/ProvideMenuContext/ProvideMenuContext";
import ProvideUserContext from "@/app/components/ProvideUserContext/ProvideUserContext";

const mocks = vi.hoisted(() => ({
  LngMenuStr: "LanguageMenu",
  handleLogout: vi.fn(),
  handlePush: vi.fn(),
  LanguageMenu: () => ({
    default: () => <div>{mocks.LngMenuStr}</div>,
  }),
}));

vi.mock("@/app/components/LanguageMenu/LanguageMenu", mocks.LanguageMenu);

vi.mock("@/app/components/FadeInOut/FadeInOut", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <section>{children}</section>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: mocks.handlePush,
    };
  },
  usePathname() {
    return "/test";
  },
}));

vi.mock("@/app/actions/client/auth", () => ({
  logout: mocks.handleLogout,
}));

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn().mockImplementation(() => ({
    t: vi.fn().mockImplementation((key: string) => key),
  })),
}));

const consoleLogMock = vi
  .spyOn(global.console, "log")
  .mockImplementation(() => vi.fn());

afterEach(() => {
  consoleLogMock.mockClear();
});

describe("Menu", () => {
  const isMenuVisible = true;
  const setIsMenuVisible = vi.fn();
  const closeStr = "closeMenu";
  const userName = "Test User";
  const logoutStr = "logout";
  const loginStr = "login";
  const menuContext = { isMenuVisible, setIsMenuVisible };
  const loggedUserContext = { userName: userName };

  it("Rendered (not logged)", () => {
    const { getByText, queryByText } = render(
      <ProvideUserContext value={{ userName: "" }}>
        <ProvideMenuContext opts={menuContext}>
          <Menu />
        </ProvideMenuContext>
      </ProvideUserContext>
    );

    expect(getByText(mocks.LngMenuStr)).toBeInTheDocument();
    expect(getByText(loginStr)).toBeInTheDocument();
    expect(getByText(closeStr)).toBeInTheDocument();
    expect(queryByText(logoutStr)).toBeNull();
  });

  it("Rendered (logged)", async () => {
    const { getByRole, getByText, queryByText } = render(
      <ProvideUserContext value={loggedUserContext}>
        <ProvideMenuContext opts={menuContext}>
          <Menu />
        </ProvideMenuContext>
      </ProvideUserContext>
    );

    expect(getByRole("navigation")).toBeVisible();
    expect(getByText(mocks.LngMenuStr)).toBeInTheDocument();
    expect(getByText(closeStr)).toBeInTheDocument();
    expect(getByText(logoutStr)).toBeInTheDocument();
    expect(queryByText(loginStr)).toBeNull();
  });

  it("Click 'logout'", async () => {
    const user = userEvent.setup();
    const { getByText } = render(
      <ProvideUserContext value={loggedUserContext}>
        <ProvideMenuContext opts={menuContext}>
          <Menu />
        </ProvideMenuContext>
      </ProvideUserContext>
    );

    await user.click(getByText(logoutStr));
    expect(mocks.handleLogout).toBeCalled();
    expect(mocks.handlePush).toBeCalledWith("/login");
  });

  it("Click 'logout' with error", async () => {
    mocks.handleLogout.mockImplementationOnce(() => {
      throw new Error("Test error logout");
    });
    const user = userEvent.setup();
    const { getByText } = render(
      <ProvideUserContext value={loggedUserContext}>
        <ProvideMenuContext opts={menuContext}>
          <Menu />
        </ProvideMenuContext>
      </ProvideUserContext>
    );

    await user.click(getByText(logoutStr));
    expect(consoleLogMock).toBeCalledWith("Test error logout");
    expect(mocks.handleLogout).toBeCalled();
    expect(mocks.handlePush).toBeCalledWith("/login");
  });
});
