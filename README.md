# Hotel Offer Orchestrator (Node.js + Temporal + Redis)

Aggregate overlapping hotel offers from two mock suppliers, dedupe by **name**, pick the **lowest price**, cache in **Redis**, and support price-range filtering **inside Redis**.

## Stack
- Node.js (TypeScript), Express
- Temporal (workflows + activities)
- Redis (sorted sets)
- Docker & Docker Compose

## How it works
1. `/api/hotels?city=<city>[&minPrice=&maxPrice=]` starts a Temporal workflow.
2. Workflow calls two activities **in parallel** to get Supplier A & B lists.
3. Activities dedupe by hotel **name**, pick cheapest, **cache** to Redis (sorted by `price`).
4. If `minPrice`/`maxPrice` present, it returns **filtered results from Redis** using `ZRANGEBYSCORE`.

## Endpoints
- `GET /api/hotels?city=delhi` → returns deduped list
  <img width="1081" height="852" alt="image" src="https://github.com/user-attachments/assets/84e7b5f0-716d-4749-9d05-ccb360fdfd9c" />

- `GET /api/hotels?city=delhi&minPrice=5000&maxPrice=7000` → filtered via Redis
  <img width="1072" height="805" alt="image" src="https://github.com/user-attachments/assets/913e8cf7-bb77-4e2a-92ac-26abb6993618" />

- `GET /supplierA/hotels?city=delhi` → mock data
  <img width="1033" height="807" alt="image" src="https://github.com/user-attachments/assets/431faa2d-a904-4a65-a8f1-ed6bd04a29df" />

- `GET /supplierB/hotels?city=delhi` → mock data
  <img width="1002" height="825" alt="image" src="https://github.com/user-attachments/assets/fd7815c7-68cb-4cd9-88c6-df09512c75e1" />

- `GET /health` → basic health info (bonus)
  <img width="651" height="673" alt="image" src="https://github.com/user-attachments/assets/7eedf6e7-1ec9-4aa7-92b2-a6f9ee67acbf" />


## Quickstart (Docker)
```bash
docker compose up --build
# Server:          http://localhost:3000
# Temporal Web UI: http://localhost:8080
```
Test:
```bash
curl 'http://localhost:3000/api/hotels?city=delhi'
curl 'http://localhost:3000/api/hotels?city=delhi&minPrice=5000&maxPrice=7000'
```

## Local Dev
```bash
npm install
npm run dev
# (Requires local Redis at 6379 and Temporal at 7233 OR set envs)
# Example:
# REDIS_URL=redis://localhost:6379 TEMPORAL_ADDRESS=localhost:7233 npm run dev
```

## Redis Data Model
- Key: `hotels:<city>`
- Type: `ZSET` where **score = price**, **member = hotel JSON**
- Filter: `ZRANGEBYSCORE key min max` → parse JSON

## Postman
Import `postman/HOTEL_ORCHESTRATOR.postman_collection.json` and run:
- Valid city (delhi)
- City with no results (e.g. jaipur)
- Price range filter
- (Optional) Simulate one supplier down by editing activities to throw

## Notes
- In this sample, activities use **shared mock data**. Endpoints expose same mock data for inspection.
- Server & Temporal worker run in a **single container** for simplicity. In a real setup, split them.
- TTL on Redis cache is **10 minutes**.
```
