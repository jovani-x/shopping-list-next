/**
 * @vitest-environment node
 */
import { describe, expect, it } from "vitest";
import { getErrorMessage } from "@/lib/utils";

describe("getErrorMessage", () => {
  const errorStr = String("error test message");

  it("Error", () => {
    try {
      throw new Error(errorStr);
    } catch (err) {
      expect(getErrorMessage(err)).toBe(errorStr);
    }
  });

  it("SyntaxError", () => {
    try {
      throw new SyntaxError(errorStr);
    } catch (err) {
      expect(getErrorMessage(err)).toBe(errorStr);
    }
  });

  it("Object", () => {
    try {
      throw { message: errorStr };
    } catch (err) {
      expect(getErrorMessage(err)).toBe(errorStr);
    }
  });

  it("Object without message", () => {
    const obj = { detail: errorStr };
    try {
      throw obj;
    } catch (err) {
      expect(getErrorMessage(err)).toBe(JSON.stringify(obj));
    }
  });

  it("Array", () => {
    const str = [errorStr];
    expect(getErrorMessage(str)).toBe(JSON.stringify(str));
  });

  it("Class", () => {
    class TestCls {
      value: string;
      self: any;

      constructor() {
        this.value = errorStr;
        this.self = this;
      }
    }
    const testObj = new TestCls();
    expect(getErrorMessage(testObj)).toBe(String(testObj));
  });

  it.each([null, true, false, 404, errorStr])("%s", (str) => {
    expect(getErrorMessage(str)).toBe(String(str));
  });
});
