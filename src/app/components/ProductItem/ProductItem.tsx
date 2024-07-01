import { useState } from "react";
import productItemStyles from "./productItem.module.scss";

/**
 * @property {string} id
 * @property {string} name
 * @property {string | null} photo
 * @property {string | null} note
 * @property {Product[]} alternatives (optional)
 * @property {boolean} got
 */
export interface Product {
  id: string;
  name: string;
  photo: string | null;
  note: string | null;
  alternatives?: Product[];
  got: boolean;
}

const ProductItem = ({
  product,
  updateProduct,
  canBeChecked = false,
}: {
  product: Product;
  updateProduct: Function;
  canBeChecked?: boolean;
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const hasNote = product.note && product.note.length > 0;

  return (
    <>
      <div key={product.id} className={productItemStyles.productItem}>
        <span
          className={`${productItemStyles.status} ${
            canBeChecked ? productItemStyles.editable : ""
          }`}
          onClick={() => {
            if (canBeChecked) {
              updateProduct({ ...product, got: !product.got });
            }
          }}
        >
          {product.got ? "✅" : "👉"}
        </span>
        <h4>{product.name}</h4>
        {product?.photo && <img src={"product.photo" ?? "#"} alt={""} />}
        {hasNote && (
          <button type="button" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? "🔽" : "🔼"}
          </button>
        )}
      </div>
      {hasNote && !collapsed && (
        <div className={productItemStyles.productInfo}>{product.note}</div>
      )}
    </>
  );
};

export default ProductItem;
