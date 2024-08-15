/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Title from "./Title";
import titleStyles from "./title.module.scss";

describe("Title", () => {
  it("Rendered", () => {
    const titleStr = "Test title";
    const { container, getByRole } = render(
      <Title>
        <h2>{titleStr}</h2>
      </Title>
    );
    const titleEl = container.querySelector(`.${titleStyles.title}`);
    const headingEl = getByRole("heading", {
      level: 2,
    });

    expect(titleEl).toBeInTheDocument();
    expect(titleEl).toHaveTextContent(titleStr);
    expect(headingEl).toBeInTheDocument();
  });
});
