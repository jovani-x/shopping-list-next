/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import CardStatusSetter from "./CardStatusSetter";
import { getTestCard } from "@/tests/test-utils";
import { CardEditingStatus } from "@/app/helpers/types";
import { updateCard } from "@/app/helpers/actions";

vi.mock("@/app/helpers/actions", () => ({
  updateCard: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      back: vi.fn(),
    };
  },
}));

describe("CardStatusSetter", () => {
  const card = getTestCard();
  const testName = "Test User";
  const statusArr = Object.keys(CardEditingStatus).map((key) => ({
    value: CardEditingStatus[key as keyof typeof CardEditingStatus],
    userName: key === CardEditingStatus.FREE ? "" : testName,
  }));

  it.each(statusArr)("Rendered $value", async ({ value, userName }) => {
    const user = userEvent.setup();
    const status = { value, userName };
    const { getByText } = render(
      <CardStatusSetter card={card} status={status}>
        {value}
      </CardStatusSetter>
    );

    const btnEl = getByText(value);
    expect(btnEl).toBeInTheDocument();
    await user.click(btnEl);
    expect(updateCard).toBeCalled();
    expect(updateCard).toBeCalledWith({ ...card, status });
  });
});
