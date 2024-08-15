/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import Header from "./Header";
import headerStyles from "./Header.module.scss";
import ProvideMenuContext, {
  useMenuContext,
} from "@/components/ProvideMenuContext/ProvideMenuContext";
import ProvideUserContext from "@/app/components/ProvideUserContext/ProvideUserContext";
import i18nConfig from "@/i18nConfig";

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn().mockImplementation(() => ({
    t: vi.fn().mockImplementation((key: string) => key),
    i18n: {
      language: i18nConfig.defaultLocale,
    },
  })),
}));

describe("Header", () => {
  const isMenuVisible = false;
  const userName = "Test User";
  const menuStr = new RegExp("menu", "i");
  const menuElStr = "Test menu";
  const lngSel = `.${headerStyles.langButton}`;
  const TestMenu = () => {
    const { isMenuVisible } = useMenuContext();
    return isMenuVisible && <div>{menuElStr}</div>;
  };

  it("Rendered (logged)", () => {
    const { container, getByText } = render(
      <ProvideMenuContext opts={{ isMenuVisible: false }}>
        <ProvideUserContext value={{ userName: userName }}>
          <Header />
        </ProvideUserContext>
      </ProvideMenuContext>
    );
    expect(getByText(/welcome/i)).toBeInTheDocument();
    expect(getByText(menuStr)).toBeInTheDocument();
    expect(container.querySelector(lngSel)).toBeInTheDocument();
    expect(getByText(new RegExp(userName))).toBeInTheDocument();
  });

  it("Rendered (not logged)", () => {
    const { queryByText } = render(
      <ProvideUserContext value={{ userName: "" }}>
        <ProvideMenuContext opts={{ isMenuVisible: false }}>
          <Header />
        </ProvideMenuContext>
      </ProvideUserContext>
    );
    expect(queryByText(userName)).toBeNull();
  });

  it('Click "menu"', async () => {
    const user = userEvent.setup();
    const { getByText, queryByText } = render(
      <ProvideUserContext value={{ userName: userName }}>
        <ProvideMenuContext opts={{ isMenuVisible }}>
          <Header />
          <TestMenu />
        </ProvideMenuContext>
      </ProvideUserContext>
    );

    expect(isMenuVisible).toBeFalsy();
    expect(queryByText(menuElStr)).toBeNull();
    const btnMenu = getByText(menuStr);
    await user.click(btnMenu);
    expect(getByText(menuElStr)).toBeInTheDocument();
  });

  it('Click "language"', async () => {
    const user = userEvent.setup();
    const { container, getByText, queryByText } = render(
      <ProvideUserContext value={{ userName: userName }}>
        <ProvideMenuContext opts={{ isMenuVisible }}>
          <Header />
          <TestMenu />
        </ProvideMenuContext>
      </ProvideUserContext>
    );

    expect(isMenuVisible).toBeFalsy();
    expect(queryByText(menuElStr)).toBeNull();
    const btnLng = container.querySelector(lngSel);
    if (btnLng) {
      await user.click(btnLng);
      expect(getByText(menuElStr)).toBeInTheDocument();
    }
  });
});
