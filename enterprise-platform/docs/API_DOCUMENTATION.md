# ⚡ Enterprise Backend API Specification

**Base API URL**: `http://localhost:4000/api/v1`  
**OpenAPI / Swagger Specs**: `http://localhost:4000/api/v1/docs`

---

## 🔐 Authentication & Security Headers

All protected administrative endpoints require a Bearer JWT Token in the HTTP Authorization Header:
```http
Authorization: Bearer <JWT_TOKEN>
X-Temple-Role: SUPER_ADMIN
```

---

## 📩 API Endpoints Reference

### 1. Devotees Module

#### `POST /devotees/register`
Register a new devotee profile.
- **Request Body**:
```json
{
  "fullName": "Sri Rajesh Thaneeru",
  "email": "rajesh@example.com",
  "phone": "+919876543210",
  "gotram": "Kasyapa",
  "nakshatram": "Rohini",
  "address": "Hyderabad, Telangana"
}
```
- **Response `201 Created`**:
```json
{
  "id": "DEV-99120",
  "devoteeCode": "SRK-2026-9912",
  "status": "ACTIVE",
  "createdAt": "2026-09-30T12:00:00Z"
}
```

---

### 2. Donations & 80G Receipts Module

#### `POST /donations/ehundi`
Create an E-Hundi donation order linked to Razorpay.
- **Request Body**:
```json
{
  "devoteeId": "DEV-99120",
  "amount": 2500,
  "currency": "INR",
  "category": "MANDIR_CONSTRUCTION",
  "is80GRequested": true,
  "panNumber": "ABCDE1234F"
}
```
- **Response `201 Created`**:
```json
{
  "donationId": "DON-884910",
  "razorpayOrderId": "order_RZP984210",
  "amount": 250000,
  "currency": "INR"
}
```

#### `GET /donations/receipt/:receiptId/pdf`
Download generated 80G Tax Exemption PDF receipt.

---

### 3. Razorpay Payment Gateway Webhooks

#### `POST /payments/razorpay-webhook`
Handles Razorpay async payment capture notifications.
- **Headers**:
```http
X-Razorpay-Signature: 5a8d9...e12a
```
- **Response `200 OK`**:
```json
{
  "status": "SUCCESS",
  "message": "Payment captured and 80G receipt issued automatically.",
  "receiptNo": "RSK-2026-881"
}
```

---

### 4. System Audit Trail Module

#### `GET /audit/logs`
Retrieve paginated immutable audit logs for compliance checks.
- **Query Parameters**: `page=1&limit=20&category=FINANCIAL`
- **Response `200 OK`**:
```json
{
  "data": [
    {
      "id": "LOG-884910",
      "timestamp": "2026-09-30 17:42:15",
      "actorName": "Sri Rajesh (Chief Admin)",
      "action": "DONATION_80G_RECEIPT_GENERATE",
      "hash": "0x8f3a92b...e41c",
      "status": "SUCCESS"
    }
  ],
  "total": 14892
}
```
