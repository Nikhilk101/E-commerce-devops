import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Product } from "../api/client";
import { fetchProducts } from "../api/client";
import { useCart } from "../state/CartContext";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, count, setQuantity, removeItem, clear } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const ids = useMemo(() => Object.keys(cart).map((k) => Number(k)), [cart]);

  useEffect(() => {
    setError(null);
    if (!ids.length) {
      setProducts([]);
      return;
    }

    fetchProducts({ ids })
      .then(setProducts)
      .catch((e) => setError(String(e)));
  }, [ids]);

  const total = useMemo(() => {
    return products.reduce((sum, p) => sum + p.price * (cart[p.id] ?? 0), 0);
  }, [products, cart]);

  return (
    <main className="page">
      <div className="container">
        <h1 className="pageTitle">Cart</h1>
        <p className="pageSubtitle">Review your items and proceed to checkout.</p>

        {count === 0 ? (
          <div className="panel" style={{ padding: 16 }}>
            <p className="muted">Your cart is empty.</p>
            <div style={{ marginTop: 12 }}>
              <button className="btn btnPrimary" onClick={() => navigate("/products")}>
                Browse Products
              </button>
            </div>
          </div>
        ) : (
          <>
            {error ? <div className="banner" style={{ marginBottom: 14 }}>{error}</div> : null}

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
              {products.map((p) => {
                const qty = cart[p.id] ?? 0;
                return (
                  <div key={p.id} className="cartItem">
                    <div style={{ minWidth: 240 }}>
                      <div className="productName">{p.name}</div>
                      <div className="muted">${p.price.toFixed(2)}</div>
                    </div>

                    <div className="qtyControls">
                      <button className="btn" onClick={() => setQuantity(p.id, qty - 1)} aria-label={`Decrease ${p.name}`}>
                        -
                      </button>
                      <div className="qtyNumber">{qty}</div>
                      <button className="btn" onClick={() => setQuantity(p.id, qty + 1)} aria-label={`Increase ${p.name}`}>
                        +
                      </button>
                    </div>

                    <div className="price">${(p.price * qty).toFixed(2)}</div>

                    <button className="btn btnDanger" onClick={() => removeItem(p.id)}>
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="panel" style={{ padding: 16 }}>
              <div className="rowBetween" style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 800 }}>Total</div>
                <div className="price">${total.toFixed(2)}</div>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button className="btn btnPrimary" onClick={() => navigate("/checkout")}>
                  Checkout
                </button>
                <button className="btn" onClick={() => clear()}>
                  Clear cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

