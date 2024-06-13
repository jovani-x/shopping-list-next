import panelStyles from "./panel.module.scss";
import React from "react";

const Panel = ({
  headContent,
  bodyContent,
  footContent,
  extraClassname,
  bodyWithOffset = true,
}: {
  headContent?: React.ReactNode;
  bodyContent?: React.ReactNode;
  footContent?: React.ReactNode;
  extraClassname?: string;
  bodyWithOffset?: boolean;
}) => {
  return (
    <div className={`${panelStyles.panel} ${extraClassname}`}>
      {headContent && (
        <header className={panelStyles.panelHead}>{headContent}</header>
      )}
      {bodyContent && (
        <div
          className={`${panelStyles.panelBody} ${
            bodyWithOffset && panelStyles.panelWithOffset
          }`}
        >
          {bodyContent}
        </div>
      )}
      {footContent && (
        <footer className={panelStyles.panelFoot}>{footContent}</footer>
      )}
    </div>
  );
};

export default Panel;
