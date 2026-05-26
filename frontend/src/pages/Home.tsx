import { useEffect, useState } from "react";
import type { Product } from "../api/client";
import { fetchProducts } from "../api/client";
import ProductCard from "../components/ProductCard";
import { useCart } from "../state/CartContext";

export default function Home() {
  const { addItem } = useCart();
  const [men, setMen] = useState<Product[]>([]);
  const [women, setWomen] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.allSettled([fetchProducts({ category: "men" }), fetchProducts({ category: "women" })])
      .then((results) => {
        const menResult = results[0];
        const womenResult = results[1];
        if (menResult.status === "fulfilled") setMen(menResult.value);
        else setError(String(menResult.reason));
        if (womenResult.status === "fulfilled") setWomen(womenResult.value);
        else setError((prev) => prev ?? String(womenResult.reason));
      })
      .catch((e) => setError(String(e)));
  }, []);

  return (
    <main className="page">
      <div className="container">
        <section className="hero">
          <h1 className="heroTitle">Premium tees, simple checkout</h1>
          <p className="heroSub">
            Explore Men & Women collections, add to cart, and place a mock order in seconds.
          </p>
        </section>

        {error ? <div className="banner" style={{ marginTop: 14 }}>{error}</div> : null}

        <section>
          <h2 className="sectionTitle">Men</h2>
          <div className="grid">
            {men.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} onAdd={() => addItem(p.id)} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="sectionTitle">Women</h2>
          <div className="grid">
            {women.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} onAdd={() => addItem(p.id)} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

