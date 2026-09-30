# 🏛️ Enterprise Digital Temple Platform - System Architecture Overview

This document provides a comprehensive technical overview of the **Sri Rama Seva Committee Digital Platform**, an enterprise-grade monorepo solution designed for scale, security, tax compliance (80G), and long-term temple administration.

---

## 📐 System Architecture Diagram

```text
                               ┌───────────────────────────────────┐
                               │     Devotees & Donors             │
                               └─────────┬───────────────┬─────────┘
                                         │               │
                        ┌────────────────▼───┐       ┌───▼────────────────┐
                        │ Next.js Web App    │       │ Flutter Mobile App │
                        │ (Public Portal)    │       │ (iOS / Android)    │
                        └────────┬───────────┘       └───┬────────────────┘
                                 │                       │
                                 │     HTTP REST / JSON  │
                                 └───────────┬───────────┘
                                             │
                               ┌─────────────▼─────────────────────┐
                               │  NestJS Enterprise API Backend    │
                               │  (Authentication, Webhooks, ERP)  │
                               └─────────────┬─────────────────────┘
                                             │
                     ┌───────────────────────┼───────────────────────┐
                     │                       │                       │
           ┌─────────▼───────────┐ ┌─────────▼───────────┐ ┌─────────▼───────────┐
           │ PostgreSQL Database │ │  Redis Cache & Queue│ │ Razorpay Payment GW │
           │ (Prisma ORM Models) │ │ (Webhook Idempotency│ │ (UPI / Cards / Net) │
           └─────────────────────┘ └─────────────────────┘ └─────────────────────┘
```

---

## 📁 Monorepo Structure

The codebase is organized as a Turborepo monorepo inside `enterprise-platform/`:

```text
enterprise-platform/
├── apps/
│   ├── api/          # NestJS Enterprise Backend API (Port 4000)
│   ├── web/          # Next.js Public Devotee Website (Port 3000)
│   ├── admin/        # Next.js Temple Administration ERP Portal (Port 3001)
│   └── mobile/       # Flutter Cross-Platform Mobile Application (iOS/Android)
├── packages/
│   ├── database/     # Prisma ORM Schema & Relational Models
│   └── types/        # Shared TypeScript Interfaces & DTO Contracts
├── infra/
│   └── terraform/    # AWS Infrastructure-as-Code Setup
├── scripts/          # Backup, SHA-256 Verification & Restore Scripts
├── .github/          # GitHub Actions CI/CD Pipeline Workflows
└── docs/             # Technical Documentation & Operations Runbooks
```

---

## 🔒 Security & Tax Compliance Architecture

1. **80G Tax Exemption Compliance**:
   - Automatic generation of sequential 80G Tax Receipts (`#RSK-YYYY-XXXX`).
   - PAN card number collection, cryptographic SHA-256 hash logging, and PDF generation.

2. **Razorpay Signature Verification**:
   - Double-entry payment verification using HMAC-SHA256 signature verification on webhooks.
   - Idempotency protection via Redis key locking to prevent duplicate donation entries.

3. **Immutable Audit Logs**:
   - Every administrative operation (financial modifications, receipt generation, role escalation) is logged with SHA-256 hashes, timestamps, actor roles, and IP addresses.
