/**
 * @vitest-environment jsdom
 */
import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CardForm from "./CardForm";
import cardFormStyles from "./CardForm.module.scss";
import { ICard } from "@/components/Card/Card";
import userEvent from "@testing-library/user-event";
import { getTestCard } from "@/tests/test-utils";
import stylesConfirmation from "@/components/Confirmation/confirmation.module.scss";

const mocks = vi.hoisted(() => ({
  confirmStr: "Test confirmation",
}));

vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

vi.mock("/src/app/helpers/utils-common", () => ({
  refreshPagesCache() {
    return "";
  },
}));

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn().mockImplementation(() => ({
    t: vi.fn().mockImplementation((key: string) => key),
  })),
}));

describe("Card Form", () => {
  const card = getTestCard();
  const handleFn = vi.fn().mockImplementation((formData: ICard) => null);
  const titleStr = "cardTitle";
  const notesStr = "cardNotes";
  const saveStr = "saveCard";
  const addStr = "addProduct";

  it("Rendered 'Create card'", async () => {
    vi.mock("@/app/components/Confirmation/Confirmation", () => ({
      default: () => <div>{mocks.confirmStr}</div>,
    }));

    const { container, getByLabelText, getByText, queryByText } = render(
      <CardForm mutationFunc={handleFn} />
    );
    const formEl = container.querySelector("form");
    expect(formEl).toBeInTheDocument();

    const cardTitleInput = getByLabelText(titleStr) as HTMLInputElement;
    expect(cardTitleInput).toBeInTheDocument();
    expect(cardTitleInput.value).toBe("");

    const cardNoteInput = getByLabelText(notesStr) as HTMLInputElement;
    expect(cardNoteInput).toBeInTheDocument();
    expect(cardNoteInput.value).toBe("");

    const btnAdd = getByText(addStr);
    expect(btnAdd).toBeInTheDocument();
    expect(btnAdd).toBeEnabled();

    const btnSave = getByText(saveStr);
    expect(btnSave).toBeInTheDocument();
    expect(btnSave).toBeDisabled();

    expect(queryByText(mocks.confirmStr)).toBeNull();
  });

  it("Rendered 'Edit card'", async () => {
    vi.mock("@/app/components/Confirmation/Confirmation", () => ({
      default: () => <div>{mocks.confirmStr}</div>,
    }));

    const { container, getByLabelText, getByDisplayValue, queryByText } =
      render(<CardForm mutationFunc={handleFn} card={card} />);

    const cardTitleInput = getByLabelText(titleStr, {
      selector: "input",
    }) as HTMLInputElement;
    expect(cardTitleInput.value).toBe(card?.name);

    const cardNotesInput = getByLabelText(notesStr, {
      selector: "textarea",
    }) as HTMLInputElement;
    expect(cardNotesInput.value).toBe(card?.notes);

    card?.products?.map((prod) => {
      const inputNameEl = getByDisplayValue(prod.name) as HTMLInputElement;
      const commonId = inputNameEl.id.split("_name")[0];
      const inputNoteEl = container.querySelector(
        `[id="${commonId}_note"]`
      ) as HTMLInputElement;
      expect(inputNameEl.value).toBe(prod.name);
      expect(inputNoteEl.value).toBe(prod.note);
    });

    expect(queryByText(mocks.confirmStr)).toBeNull();
  });

  it("Toggle 'delete confirmation tooltip'", async () => {
    const user = userEvent.setup();
    const { container, getByText, getAllByLabelText } = render(
      <CardForm mutationFunc={handleFn} card={card} />
    );

    const inputs = getAllByLabelText("productTitle*", { selector: "input" });
    expect(inputs.length).toBe(card.products.length);
    const tooltipSel = `.${stylesConfirmation.confirmationTooltip}`;
    expect(container.querySelector(tooltipSel)).toBeNull();
    const btnEl = container.querySelector(`.${cardFormStyles.btnClose}`);
    expect(btnEl).toBeInTheDocument();
    if (btnEl) {
      await user.click(btnEl);
      waitFor(async () => {
        expect(container.querySelector(tooltipSel)).toBeInTheDocument();
        const noBtn = getByText("no");
        const yesBtn = getByText("yes");
        expect(noBtn).toBeInTheDocument();
        expect(yesBtn).toBeInTheDocument();
        await user.click(noBtn);
        expect(container.querySelector(tooltipSel)).toBeNull();

        await user.click(btnEl);
        await user.click(yesBtn);
        expect(getAllByLabelText("productTitle*", { selector: "input" })).toBe(
          card.products.length - 1
        );
      });
    }
  });

  it("Click 'Add a product'", async () => {
    const user = userEvent.setup();
    const saveFn = vi.fn();
    const { container, getByText, getByLabelText } = render(
      <CardForm mutationFunc={saveFn} />
    );

    const btnAdd = getByText(addStr);
    const groupSel = `.${cardFormStyles.group}`;
    expect(container.querySelectorAll(groupSel)).toHaveLength(0);

    await user.click(btnAdd);
    expect(container.querySelectorAll(groupSel)).toHaveLength(1);

    const btnSave = getByText(saveStr);
    expect(btnSave).toBeDisabled();

    const cardTitleInput = getByLabelText(titleStr);
    await user.type(cardTitleInput, "Test card title");

    const groups = container.querySelectorAll(groupSel);
    const lastGroup = groups[groups.length - 1];
    const inputEl = lastGroup.querySelector("input");
    expect(inputEl).toBeInTheDocument();
    if (inputEl) {
      await user.type(inputEl, "test product name");
      expect(inputEl).toHaveDisplayValue("test product name");
    }
    expect(btnSave).not.toBeDisabled();
    // await user.click(btnSave);
    // expect(saveFn).toBeCalled();
  });
});
