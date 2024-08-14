import errorMessageStyles from "./errorMessage.module.scss";

const ErrorMessage = ({ text }: { text: string }) => {
  return (
    <span role="alert" className={errorMessageStyles.error}>
      {text.split("\n").map((el, ix) => {
        return <p key={ix}>{el}</p>;
      })}
    </span>
  );
};

export default ErrorMessage;
