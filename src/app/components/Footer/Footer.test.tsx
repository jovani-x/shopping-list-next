/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "./Footer";

describe("Footer", () => {
  const author = {
    url: process.env.VITE_AUTHOR_LINK,
    name: process.env.VITE_AUTHOR_NAME,
  };

  it("Rendered", () => {
    const { getByText } = render(<Footer />);
    if (author?.name) {
      const linkEl = getByText(author.name);
      expect(linkEl).toBeInTheDocument();
      expect(linkEl).toHaveAttribute("href", author.url);
    }
  });
});
