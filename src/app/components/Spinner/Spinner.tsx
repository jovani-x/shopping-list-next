import spinnerStyles from "./spinner.module.scss";

const Spinner = ({
  isAbsolute = true,
  coverBgClass = "bg-white",
  coverOpacityClass = "opacity-50",
}: {
  isAbsolute?: boolean;
  coverBgClass?: string;
  coverOpacityClass?: string;
}) => (
  <div
    className={`${spinnerStyles.spinner} ${isAbsolute ? "absolute" : "relative"}`}
  >
    <span
      className={`${spinnerStyles.spinnerBg} ${coverBgClass} ${coverOpacityClass}`}
    ></span>
    <span className={`${spinnerStyles.spinnerItem}`}></span>
  </div>
);

export default Spinner;
