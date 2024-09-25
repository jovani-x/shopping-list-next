import errorMessageStyles from "./errorMessage.module.scss";

const ErrorMessage = ({ text }: { text: unknown }) => {
  if (text === undefined || text === null) return null;

  const res = transformErrIntoText(text);

  return (
    <span role="alert" className={errorMessageStyles.error}>
      {res}
    </span>
  );
};

export const wrapIntoP = (el: unknown, ix: number) => {
  if (Array.isArray(el)) {
    const [key, value] = el;
    return <p key={ix}>{`${String(key)}: ${String(value)}`}</p>;
  } else {
    return <p key={ix}>{String(el).replaceAll('":"', ": ")}</p>;
  }
};

export const transformErrIntoText = (text: unknown) =>
  typeof text === "string"
    ? text.split("\n").map(wrapIntoP)
    : Array.isArray(text)
      ? text.map(wrapIntoP)
      : typeof text === "object"
        ? JSON.stringify(text).slice(2, -2).split('","').map(wrapIntoP)
        : String(text);

export default ErrorMessage;
