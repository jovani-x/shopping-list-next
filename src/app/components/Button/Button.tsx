import buttonStyles from "./button.module.scss";

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
}

const Button = ({
  children,
  onClick,
  type,
  disabled,
  extraClassname,
}: IButton) => {
  return (
    <button
      className={`${buttonStyles.button} ${extraClassname}`}
      type={type || ButtonTypes.BUTTON}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const ButtonContrast = ({
  children,
  onClick,
  type,
  disabled,
  extraClassname,
}: IButton) => {
  return (
    <button
      className={`${buttonStyles.buttonContrast} ${extraClassname}`}
      type={type || ButtonTypes.BUTTON}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const ButtonSimple = ({
  children,
  onClick,
  type,
  disabled,
  extraClassname,
}: IButton) => {
  return (
    <button
      className={`${buttonStyles.buttonSimple} ${extraClassname}`}
      type={type || ButtonTypes.BUTTON}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
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
