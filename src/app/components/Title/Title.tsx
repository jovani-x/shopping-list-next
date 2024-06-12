import titleStyles from "./title.module.scss";

const Title = ({ children }: { children: React.ReactNode }) => (
  <header className={titleStyles.title}>{children}</header>
);

export default Title;
