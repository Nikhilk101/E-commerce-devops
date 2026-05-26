# E-commerce (Men/Women T-shirts) - Demo

This is a simple e-commerce demo:
- React + Vite frontend (localStorage cart)
- Django + Django REST Framework backend (products + mock checkout)
- Mock checkout creates an `Order` in SQLite (no real payments)

## Prerequisites

- Python 3.10+
- Node.js 18+

## Backend (Django + DRF)

From the project root:

```bash
cd backend
source venv/bin/activate  # if you created venv already
python manage.py migrate
python manage.py seed_products
python manage.py runserver 0.0.0.0:8000
```

API endpoints:
- `GET /api/products/`
- `POST /api/checkout/`

## Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Then open the URL shown by Vite (usually `http://localhost:5173`).

## Environment

The frontend calls the API at `http://localhost:8000/api` by default.
To override, set:

```bash
export VITE_API_BASE_URL="http://localhost:8000/api"
```

## What to test (end-to-end)

1. Open the frontend and go to `Men` or `Women`.
2. Click `Add to cart` for a product.
3. Open `Cart`, adjust quantities, and click `Checkout`.
4. Submit the checkout form: the backend will create an `Order` row in SQLite.

