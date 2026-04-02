# PrintDesk — Print Order Management System

A full-stack print order system built with **React** (frontend) and **Spring Boot** (backend).

---

## Features

- **PDF Upload** — Upload PDF files only; file name displayed after upload
- **Auto Page Count** — Apache PDFBox detects number of pages automatically
- **Print Options** — Black & White (₹2/page) or Color (₹5/page) + number of copies
- **Dynamic Pricing** — Total price updates in real time as options change
- **Order Storage** — All orders persisted in database (H2 for dev, MySQL for prod)
- **Orders List** — Full table view with stats (total orders, revenue, pages printed)
- **Delete Orders** — Remove any order from the list

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, React Router v6, Axios  |
| Backend   | Spring Boot 3.3, Java 17, Maven   |
| ORM       | Spring Data JPA / Hibernate       |
| Database  | H2 (dev) / MySQL (prod)           |
| PDF       | Apache PDFBox 3                   |
| Styling   | Custom CSS (no UI library)        |

---

## Project Structure

```
print-module/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/printmodule/
│       │   ├── PrintModuleApplication.java
│       │   ├── config/CorsConfig.java
│       │   ├── controller/PrintOrderController.java
│       │   ├── model/
│       │   │   ├── PrintOrder.java
│       │   │   └── PrintOrderDTO.java
│       │   ├── repository/PrintOrderRepository.java
│       │   └── service/PrintOrderService.java
│       └── resources/
│           ├── application.properties          ← H2 (default)
│           └── application-mysql.properties    ← MySQL (prod)
└── frontend/
    ├── package.json
    └── src/
        ├── App.js / App.css
        ├── index.js
        ├── services/api.js
        └── pages/
            ├── NewOrderPage.js
            └── OrdersListPage.js
```

---

## Getting Started

### Prerequisites

- Java 17+
- Maven 3.8+ (or use the included `mvnw` wrapper)
- Node.js 18+
- npm 9+

---

### Backend

```bash
cd print-module/backend

# Run with H2 (default — no setup needed)
./mvnw spring-boot:run

# Server starts at: http://localhost:8080
# H2 Console:       http://localhost:8080/h2-console
#   JDBC URL: jdbc:h2:mem:printdb
#   User: sa | Password: (blank)
```

#### Switch to MySQL (Production)

1. Create a MySQL database:
   ```sql
   CREATE DATABASE printdb;
   ```

2. Update credentials in `application-mysql.properties`.

3. Add MySQL driver to `pom.xml` (see `MYSQL_SETUP.txt`).

4. Run:
   ```bash
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=mysql
   ```

---

### Frontend

```bash
cd print-module/frontend
npm install
npm start

# App starts at: http://localhost:3000
# API proxy: configured to http://localhost:8080
```

---

## API Reference

| Method   | Endpoint                    | Description                          |
|----------|-----------------------------|--------------------------------------|
| `POST`   | `/api/print/upload`         | Upload PDF → returns page count      |
| `GET`    | `/api/print/price`          | Calculate price (query params)       |
| `POST`   | `/api/print/orders`         | Create and save a new order          |
| `GET`    | `/api/print/orders`         | List all orders (newest first)       |
| `DELETE` | `/api/print/orders/{id}`    | Delete an order by ID                |

### Example: Upload PDF
```bash
curl -X POST http://localhost:8080/api/print/upload \
  -F "file=@document.pdf"

# Response:
# { "fileName": "document.pdf", "pageCount": 12 }
```

### Example: Calculate Price
```bash
curl "http://localhost:8080/api/print/price?printType=COLOR&pageCount=12&copies=3"

# Response:
# { "totalPrice": 180.0, "pricePerPage": 5.0, "pageCount": 12, "copies": 3 }
```

### Example: Create Order
```bash
curl -X POST http://localhost:8080/api/print/orders \
  -H "Content-Type: application/json" \
  -d '{"fileName":"doc.pdf","pageCount":12,"printType":"COLOR","copies":3}'
```

---

## Deployment

### Backend — Deploy to Render / Railway / EC2

```bash
# Build JAR
./mvnw clean package -DskipTests

# Run JAR
java -jar target/printmodule-0.0.1-SNAPSHOT.jar --spring.profiles.active=mysql
```

### Frontend — Deploy to Vercel / Netlify

```bash
# Build production bundle
npm run build

# Set environment variable:
REACT_APP_API_URL=https://your-backend-url.com/api/print
```

---

## Pricing Rules

| Type         | Rate       |
|--------------|------------|
| Black & White | ₹2 / page |
| Color         | ₹5 / page |

**Formula:** `Total = pricePerPage × pageCount × copies`

---

## License

MIT
