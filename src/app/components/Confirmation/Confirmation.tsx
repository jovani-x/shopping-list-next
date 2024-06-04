import stylesConfirmation from "./confirmation.module.scss";
import { ButtonSimple } from "@/app/components/Button/Button";

const Confirmation = ({
  text,
  yesText,
  noText,
  yesFunc,
  noFunc,
  extraClassname,
}: {
  text: string;
  yesText: string;
  noText: string;
  yesFunc: Function;
  noFunc: Function;
  extraClassname?: string;
}) => {
  return (
    <div
      className={`${stylesConfirmation.confirmationTooltip} ${extraClassname}`}
    >
      <span>{text}</span>
      <ButtonSimple onClick={() => yesFunc()} children={yesText} />
      <ButtonSimple onClick={() => noFunc()} children={noText} />
    </div>
  );
};

export default Confirmation;
