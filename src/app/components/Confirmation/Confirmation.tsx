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
      <ButtonSimple onClick={() => yesFunc()}>{yesText}</ButtonSimple>
      <ButtonSimple onClick={() => noFunc()}>{noText}</ButtonSimple>
    </div>
  );
};

export default Confirmation;
