import ProductItem, { Product } from "@/app/components/ProductItem/ProductItem";
import { useTranslation } from "react-i18next";
import cardStyles from "@/components/Card/card.module.scss";

const ProductList = ({
  products,
  updateProduct,
  canBeChecked,
}: {
  products?: Product[];
  updateProduct: Function;
  canBeChecked: boolean;
}) => {
  const { t } = useTranslation();

  if (!products || !products?.length) {
    return (
      <div className={cardStyles.cardMessage}>
        <p>{t("noProducts")}</p>
      </div>
    );
  }

  return products.map((product: Product) => {
    return (
      <ProductItem
        key={product.id}
        product={product}
        updateProduct={updateProduct}
        canBeChecked={canBeChecked}
      />
    );
  });
};

export default ProductList;
