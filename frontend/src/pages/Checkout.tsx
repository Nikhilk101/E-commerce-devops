import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Product } from "../api/client";
import { checkout, fetchProducts } from "../api/client";
import { useCart } from "../state/CartContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { count, cart, lines, clear } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);

  const ids = useMemo(() => Object.keys(cart).map((k) => Number(k)), [cart]);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");

  const total = useMemo(() => {
    return products.reduce((sum, p) => sum + p.price * (cart[p.id] ?? 0), 0);
  }, [products, cart]);

  useEffect(() => {
    if (count === 0) navigate("/cart", { replace: true });
  }, [count, navigate]);

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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const res = await checkout({
        items: lines,
        customer_name: customerName,
        customer_email: customerEmail,
        address_line1: address1,
        address_line2: address2,
        city,
        state,
        postal_code: postalCode,
        country,
      });

      clear();
      setOrderId(res.order_id);
    } catch (err: any) {
      setError(err?.message ? String(err.message) : String(err));
    }
  }

  return (
    <main className="page">
      <div className="container">
        <h1 className="pageTitle">Checkout</h1>
        <p className="pageSubtitle">Enter delivery details and place a mock order.</p>

        {error ? <div className="banner" style={{ marginBottom: 14 }}>{error}</div> : null}

        <div className="panel" style={{ padding: 16, marginBottom: 16 }}>
          <div className="rowBetween">
            <div style={{ fontWeight: 800 }}>Total</div>
            <div className="price">${total.toFixed(2)}</div>
          </div>
          <div className="muted" style={{ fontSize: 13, marginTop: 8 }}>
            Mock checkout: no real payment is processed.
          </div>
        </div>

        {orderId ? (
          <section className="panel" style={{ padding: 16 }}>
            <h2 style={{ marginTop: 0, marginBottom: 6 }}>Order placed</h2>
            <p className="muted">
              Your order ID is <strong style={{ color: "white" }}>{orderId}</strong>.
            </p>
            <div style={{ marginTop: 12 }}>
              <button className="btn btnPrimary" onClick={() => navigate("/products")}>
                Continue shopping
              </button>
            </div>
          </section>
        ) : (
          <form onSubmit={onSubmit} className="panel formCard">
            <div className="twoCol">
              <label className="label">
                Name
                <input
                  className="input"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </label>
              <label className="label">
                Email
                <input
                  className="input"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                />
              </label>
            </div>

            <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
              <label className="label">
                Address line 1
                <input className="input" value={address1} onChange={(e) => setAddress1(e.target.value)} required />
              </label>
              <label className="label">
                Address line 2 (optional)
                <input className="input" value={address2} onChange={(e) => setAddress2(e.target.value)} />
              </label>

              <div className="twoCol">
                <label className="label">
                  City
                  <input className="input" value={city} onChange={(e) => setCity(e.target.value)} required />
                </label>
                <label className="label">
                  State (optional)
                  <input className="input" value={state} onChange={(e) => setState(e.target.value)} />
                </label>
              </div>

              <div className="twoCol">
                <label className="label">
                  Postal code (optional)
                  <input className="input" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                </label>
                <label className="label">
                  Country
                  <input className="input" value={country} onChange={(e) => setCountry(e.target.value)} />
                </label>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
              <button className="btn btnPrimary" type="submit">
                Place mock order
              </button>
              <button className="btn" type="button" onClick={() => navigate("/cart")}>
                Back to cart
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

