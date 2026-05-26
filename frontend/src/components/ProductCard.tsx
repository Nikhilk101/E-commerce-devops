import type { Product } from "../api/client";

export default function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: () => void;
}) {
  return (
    <article className="productCard">
      {product.image_url ? (
        <img className="productImg" src={product.image_url} alt={product.name} />
      ) : (
        <div className="productMedia">Tee preview</div>
      )}

      <div className="productBody">
        <div className="productName">{product.name}</div>
        <div className="productMetaRow">
          <span className="tag">{product.category}</span>
          <span className="price">${product.price.toFixed(2)}</span>
        </div>

        <button className="btn btnPrimary" onClick={onAdd}>
          Add to cart
        </button>
      </div>
    </article>
  );
}

