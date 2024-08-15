/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Panel from "./Panel";
import panelStyles from "./panel.module.scss";

describe("Panel", () => {
  it("Rendered (Empty)", () => {
    const { container } = render(<Panel />);
    const panelEl = container.querySelector(`.${panelStyles.panel}`);

    expect(panelEl).toBeInTheDocument();
    expect(panelEl).toBeEmptyDOMElement();
  });

  it("Rendered (with bodyWithOffset)", () => {
    const bodyStr = "Body text";
    const bodyContent = <section>{bodyStr}</section>;
    const { container } = render(
      <Panel bodyContent={bodyContent} bodyWithOffset={true} />
    );

    expect(
      container.querySelector(`.${panelStyles.panelWithOffset}`)
    ).toBeInTheDocument();
  });

  it("Rendered (with content)", () => {
    const extraClsStr = "testclass";
    const titleStr = "Title #1";
    const bodyStr = "Body text";
    const footStr = "Footer text";
    const headContent = <h3>{titleStr}</h3>;
    const bodyContent = <section>{bodyStr}</section>;
    const footContent = <p>{footStr}</p>;
    const { container, getByText } = render(
      <Panel
        headContent={headContent}
        bodyContent={bodyContent}
        footContent={footContent}
        extraClassname={extraClsStr}
      />
    );

    expect(getByText(titleStr)).toBeInTheDocument();
    expect(getByText(bodyStr)).toBeInTheDocument();
    expect(getByText(footStr)).toBeInTheDocument();
    expect(container.querySelector("h3")).toBeInTheDocument();
    expect(container.querySelector("section")).toBeInTheDocument();
    expect(container.querySelector("p")).toBeInTheDocument();
    expect(container.querySelector(`.${extraClsStr}`)).toBeInTheDocument();
    expect(container.querySelector(`.${panelStyles.WithOffset}`)).toBeNull();
  });
});
