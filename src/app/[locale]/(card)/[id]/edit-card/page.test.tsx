/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import EditCardPage from "./page";
import { getTestCard } from "@/tests/test-utils";
import { UserRole, CardEditingStatus } from "@/app/helpers/types";
import initTranslations from "@/app/i18n";

const mocks = vi.hoisted(() => ({
  getCard: vi.fn(),
  updateCard: vi.fn(),
  token: "test_token",
  userName: "Test User",
  setterStr: "Test CardStatusSetter",
  editingStr: "Test EditingStatus",
  formStr: "Test CardForm",
  getCurrentUser: vi
    .fn()
    .mockImplementation(() => ({ userName: mocks.userName })),
}));

vi.mock("@/app/actions/client/cards", () => ({
  getCard: mocks.getCard,
  updateCard: mocks.updateCard,
}));

vi.mock("@/components/CardStatusSetter/CardStatusSetter", () => ({
  default: () => <div>{mocks.setterStr}</div>,
}));

vi.mock("@/components/CardForm/CardForm", () => ({
  default: () => <div>{mocks.formStr}</div>,
}));

vi.mock("@/components/EditingStatus/EditingStatus", () => ({
  default: () => <div>{mocks.editingStr}</div>,
}));

vi.mock("@/app/helpers/auth", () => ({
  getAuthToken: vi.fn().mockImplementation(() => mocks.token),
  getCurrentUser: mocks.getCurrentUser,
}));

describe("Edit card page ", async () => {
  const card = getTestCard();
  const pageParams = { params: { locale: "en", id: "123" } };
  const { t } = await initTranslations(pageParams.params.locale);
  const backBtnStr = t("backToHome");

  it("Rendered", async () => {
    mocks.getCard.mockImplementationOnce(() => ({
      ...card,
      userRole: UserRole.owner,
      status: {
        userName: mocks.userName,
        value: CardEditingStatus.FREE,
      },
    }));
    const jsx = await EditCardPage(pageParams);
    const { getByText, getAllByText } = render(jsx);

    expect(getAllByText(mocks.setterStr).length).toBe(2);
    expect(getByText(mocks.formStr)).toBeInTheDocument();
  });

  it("Status 'in progress'", async () => {
    mocks.getCard.mockImplementationOnce(() => ({
      ...card,
      userRole: UserRole.owner,
      status: {
        value: CardEditingStatus.IN_PROCESS,
        userName: mocks.userName,
      },
    }));
    const jsx = await EditCardPage(pageParams);
    const { getByText } = render(jsx);

    expect(getByText(backBtnStr)).toBeInTheDocument();
    expect(getByText(mocks.editingStr)).toBeInTheDocument();
  });

  it("Status 'editing'", async () => {
    mocks.getCard.mockImplementationOnce(() => ({
      ...card,
      userRole: UserRole.owner,
      status: {
        value: CardEditingStatus.EDITING,
        userName: mocks.userName,
      },
    }));
    const jsx = await EditCardPage(pageParams);
    const { getByText, getAllByText } = render(jsx);

    expect(getAllByText(mocks.setterStr).length).toBe(2);
    expect(getByText(mocks.formStr)).toBeInTheDocument();
  });

  it("Status 'editing' and not the same user", async () => {
    mocks.getCard.mockImplementationOnce(() => ({
      ...card,
      userRole: UserRole.owner,
      status: {
        value: CardEditingStatus.EDITING,
        userName: "Another Person",
      },
    }));
    const jsx = await EditCardPage(pageParams);
    const { getByText } = render(jsx);

    expect(getByText(backBtnStr)).toBeInTheDocument();
    expect(getByText(mocks.editingStr)).toBeInTheDocument();
  });

  it("Status 'editing' and no user", async () => {
    mocks.getCurrentUser.mockImplementation(() => ({ userName: "" }));
    mocks.getCard.mockImplementationOnce(() => ({
      ...card,
      userRole: UserRole.owner,
      status: {
        value: CardEditingStatus.EDITING,
        userName: "",
      },
    }));
    const jsx = await EditCardPage(pageParams);
    const { getByText } = render(jsx);

    expect(getByText(backBtnStr)).toBeInTheDocument();
    expect(getByText(mocks.editingStr)).toBeInTheDocument();
  });

  it("Rendered (no card)", async () => {
    mocks.getCard.mockImplementationOnce(() => null);
    const jsx = await EditCardPage(pageParams);
    const { getByText } = render(jsx);

    expect(
      getByText(t("cardWithIdDoesnotExist", { id: pageParams.params.id }))
    ).toBeInTheDocument();
    expect(getByText(backBtnStr)).toBeInTheDocument();
  });

  it("Rendered (not owner)", async () => {
    mocks.getCard.mockImplementationOnce(() => ({
      ...card,
      userRole: UserRole.buyer,
    }));
    const jsx = await EditCardPage(pageParams);
    const { getByText } = render(jsx);

    expect(getByText(t("unauthorizedRequest"))).toBeInTheDocument();
    expect(getByText(backBtnStr)).toBeInTheDocument();
  });
});
