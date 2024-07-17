import "@testing-library/jest-dom/vitest";
import { beforeAll, afterAll, beforeEach, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { isFixedDialogInTestLib } from "./test-utils";
import { testServer } from "./node";

// HTMLDialogElement Issue
// https://github.com/jsdom/jsdom/issues/3294

// form with action
// https://github.com/vercel/next.js/issues/54757

// layout.test.tsx
// https://github.com/testing-library/react-testing-library/issues/1250

const isJSDom = typeof window !== "undefined";

beforeAll(() => {
  if (isJSDom) {
    if (!isFixedDialogInTestLib) {
      HTMLDialogElement.prototype.show = vi.fn(function mock(
        this: HTMLDialogElement
      ) {
        this.open = true;
        this.ariaHidden = "false";
      });

      HTMLDialogElement.prototype.showModal = vi.fn(function mock(
        this: HTMLDialogElement
      ) {
        this.open = true;
        this.ariaHidden = "false";
      });

      HTMLDialogElement.prototype.close = vi.fn(function mock(
        this: HTMLDialogElement
      ) {
        this.open = false;
        this.ariaHidden = "true";
      });
    }
  } else {
    // node
    testServer.listen();
  }
});

beforeEach(() => {
  if (isJSDom) {
  } else {
    // node
  }
});

afterEach(() => {
  if (isJSDom) {
  } else {
    // node
    testServer.resetHandlers();
  }

  cleanup();
});

afterAll(() => {
  if (isJSDom) {
  } else {
    // node
    testServer.close();
    testServer.dispose();
  }

  vi.clearAllMocks();
});
