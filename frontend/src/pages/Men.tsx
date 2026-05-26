import { useEffect, useState } from "react";

import type { Product } from "../api/client";
import { fetchProducts } from "../api/client";
import ProductCard from "../components/ProductCard";
import { useCart } from "../state/CartContext";

export default function Men() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts({ category: "men" })
      .then(setProducts)
      .catch((e) => setError(String(e)));
  }, []);

  return (
    <main className="page">
      <div className="container">
        <h1 className="pageTitle">Men</h1>
        <p className="pageSubtitle">Everyday tees to premium fits.</p>

        {error ? <div className="banner" style={{ marginBottom: 14 }}>{error}</div> : null}

        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={() => addItem(p.id)} />
          ))}
        </div>
      </div>
    </main>
  );
}

