export type Category = "men" | "women";

export type Product = {
  id: number;
  name: string;
  category: Category;
  price: number;
  description?: string;
  image_url?: string;
};

export type CartLine = { product_id: number; quantity: number };

export type CheckoutPayload = {
  items: CartLine[];
  customer_name: string;
  customer_email: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code?: string;
  country?: string;
};

export type CheckoutResponse = {
  order_id: number;
  status: string;
  total_amount: number;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.toString() || "http://localhost:8000/api";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }

  return (await res.json()) as T;
}

export async function fetchProducts(params?: {
  category?: Category;
  ids?: number[];
}): Promise<Product[]> {
  const search = new URLSearchParams();
  if (params?.category) search.set("category", params.category);
  if (params?.ids && params.ids.length) search.set("ids", params.ids.join(","));

  const query = search.toString();
  const data = await apiFetch<any[]>(`/products/${query ? `?${query}` : ""}`);

  return data.map((p) => ({
    ...p,
    price: typeof p.price === "string" ? Number(p.price) : p.price,
  }));
}

export async function checkout(payload: CheckoutPayload): Promise<CheckoutResponse> {
  const data = await apiFetch<any>("/checkout/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return {
    order_id: data.order_id,
    status: data.status,
    total_amount:
      typeof data.total_amount === "string" ? Number(data.total_amount) : data.total_amount,
  };
}

