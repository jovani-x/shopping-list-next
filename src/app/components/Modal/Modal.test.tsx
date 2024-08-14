/**
 * @vitest-environment jsdom
 */
import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Modal from "./Modal";
import { isFixedDialogInTestLib } from "@/tests/test-utils";

// HTMLDialogElement Issue
// https://github.com/jsdom/jsdom/issues/3294

const isFixedInTestLib = isFixedDialogInTestLib;
const isHidden = !isFixedInTestLib;

describe("Modal", () => {
  const titleStr = "Test Modal";
  const str = "Test string in the modal dialog element";
  const children = <p>{str}</p>;
  const user = userEvent.setup();

  it("Rendered", async () => {
    const setOpened = vi.fn();
    const { getByText, getByRole } = render(
      <Modal isOpen={true} setOpened={setOpened} title={titleStr}>
        {children}
      </Modal>
    );

    const dialogEl = getByRole("dialog", { hidden: isHidden });
    expect(dialogEl).toBeInTheDocument();
    if (!isHidden) {
      expect(dialogEl).toBeVisible();
    } else {
      expect(dialogEl).not.toBeVisible();
    }
    expect(getByText(titleStr)).toBeInTheDocument();
    expect(getByText(str)).toBeInTheDocument();
  });

  it("isOpen = false", () => {
    const setOpened = vi.fn();
    const { container } = render(
      <Modal isOpen={false} setOpened={setOpened} title={titleStr}>
        {children}
      </Modal>
    );

    expect(container.querySelector("dialog")).toBeNull();
  });

  it("Clicked onClose", async () => {
    const setOpened = vi.fn();
    const onClose = vi.fn();
    const isOpenExpected = false;
    const { getByText, getByRole } = render(
      <Modal
        isOpen={true}
        setOpened={setOpened}
        title={titleStr}
        onClose={onClose}
      >
        {children}
      </Modal>
    );

    const closeEl = getByText("❌");
    expect(closeEl).toBeInTheDocument();
    await user.click(closeEl);
    expect(setOpened).toHaveBeenCalledWith(isOpenExpected);
    expect(onClose).toHaveBeenCalled();
    if (!isFixedInTestLib) {
      const dialogEl = await waitFor(
        () => getByRole("dialog", { hidden: isHidden }) as HTMLDialogElement
      );
      expect(dialogEl.open).toBe(isOpenExpected);
    } else {
      expect(getByRole("dialog")).toBeNull();
    }
  });

  it("Pressed Escape", async () => {
    const setOpened = vi.fn();
    const isOpenExpected = false;
    const { getByRole } = render(
      <Modal isOpen={true} setOpened={setOpened} title={titleStr}>
        {children}
      </Modal>
    );

    await user.keyboard("{Escape}");
    if (!isFixedInTestLib) {
      const dialogEl = await waitFor(
        () => getByRole("dialog", { hidden: isHidden }) as HTMLDialogElement
      );
      expect(setOpened).toBeCalledTimes(0);
      expect(dialogEl.open).toBe(!isHidden);
    } else {
      expect(setOpened).toHaveBeenCalledWith(isOpenExpected);
      expect(getByRole("dialog")).toBeNull();
    }
  });

  it("Clicked outside of the modal", async () => {
    const setOpened = vi.fn();
    const isOpenExpected = false;
    const { getByRole } = render(
      <Modal isOpen={true} setOpened={setOpened} title={titleStr}>
        {children}
      </Modal>
    );

    if (!isFixedInTestLib) {
      const dialogEl = await waitFor(
        () => getByRole("dialog", { hidden: isHidden }) as HTMLDialogElement
      );
      expect(setOpened).toBeCalledTimes(0);
      expect(dialogEl.open).toBe(!isHidden);
    } else {
      expect(setOpened).toHaveBeenCalledWith(isOpenExpected);
      expect(getByRole("dialog")).toBeNull();
    }
  });
});
