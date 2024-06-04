import footerStyles from "./footer.module.scss";

const Footer = () => {
  const author = {
    url: process.env.VITE_AUTHOR_LINK,
    name: process.env.VITE_AUTHOR_NAME,
  };
  return (
    <footer className={footerStyles.bottomBar}>
      <strong className={footerStyles.title}>
        Shopping List by{" "}
        <a href={author.url} target="_blank">
          {author.name}
        </a>
      </strong>
    </footer>
  );
};

export default Footer;
