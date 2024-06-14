import buttonStyles from "./button.module.scss";
import Link from "next/link";

export enum ButtonTypes {
  BUTTON = "button",
  SUBMIT = "submit",
  RESET = "reset",
}

export interface IButton {
  children?: React.ReactNode;
  onClick?: () => void;
  type?: ButtonTypes;
  disabled?: boolean;
  extraClassname?: string;
  href?: string;
}

const ButtonBase = (btnProps: IButton) => {
  const {
    children,
    type = ButtonTypes.BUTTON,
    href,
    extraClassname,
    ...restProps
  } = btnProps;

  if (!!href) {
    return (
      <Link {...restProps} href={href} className={extraClassname}>
        {children}
      </Link>
    );
  }

  return (
    <button {...restProps} type={type} className={extraClassname}>
      {children}
    </button>
  );
};

const Button = (btnProps: IButton) => {
  const { extraClassname, ...restProps } = btnProps;

  return (
    <ButtonBase
      {...restProps}
      extraClassname={`${buttonStyles.button} ${extraClassname ?? ""}`}
    />
  );
};

export const ButtonContrast = (btnProps: IButton) => {
  const { extraClassname, ...restProps } = btnProps;

  return (
    <ButtonBase
      {...restProps}
      extraClassname={`${buttonStyles.buttonContrast} ${extraClassname ?? ""}`}
    />
  );
};

export const ButtonSimple = (btnProps: IButton) => {
  const { extraClassname, ...restProps } = btnProps;

  return (
    <ButtonBase
      {...restProps}
      extraClassname={`${buttonStyles.buttonSimple} ${extraClassname ?? ""}`}
    />
  );
};

export enum ButtonComponentsType {
  SIMPLE = "simple",
  CONTRAST = "contrast",
  DEFAULT = "default",
}

export const ButtonComponents = {
  [ButtonComponentsType.SIMPLE]: ButtonSimple,
  [ButtonComponentsType.CONTRAST]: ButtonContrast,
  [ButtonComponentsType.DEFAULT]: Button,
};

export default Button;
