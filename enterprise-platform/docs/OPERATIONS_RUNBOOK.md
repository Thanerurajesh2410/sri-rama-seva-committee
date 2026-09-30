# 📋 Temple Administration Operations & Maintenance Runbook

This operations runbook outlines step-by-step procedures for temple administrators, system operators, and IT staff to maintain, backup, and troubleshoot the **Sri Rama Seva Enterprise Platform**.

---

## 🔁 1. Daily & Weekly Maintenance Tasks

### Daily Checks:
1. Verify Razorpay webhook reconciliation status in Admin ERP (`/reconciliation`). Ensure 0 unmatched entries.
2. Check automated database backup status in `./backups/` directory.

### Weekly Checks:
1. Run audit log compliance export from Admin ERP (`/audit`).
2. Run database integrity check using `scripts/backup-db.ps1`.

---

## 💾 2. Automated Database Backup & Disaster Recovery

### Executing Manual Database Backup (PowerShell):
```powershell
# Run from repository root directory
powershell -ExecutionPolicy Bypass -File ./enterprise-platform/scripts/backup-db.ps1
```
Expected Output:
```text
==========================================================
 🏛️ SRI RAMA SEVA COMMITTEE - AUTOMATED DB BACKUP SYSTEM 
==========================================================
[1/3] Generating PostgreSQL Dump...
[2/3] Calculating Cryptographic SHA-256 Checksum...
[VERIFIED] SHA-256 Hash: 8F3A92B...E41C
[3/3] Compressing Backup Archive...
 ✅ BACKUP SUCCESSFUL: ./backups/srirama_db_backup_20260930.zip
```

---

## 🐳 3. Local & Staging Docker Environment Setup

### Start All Services:
```bash
cd enterprise-platform
docker-compose up -d
```

### Stop All Services:
```bash
docker-compose down
```

### View Application Logs:
```bash
docker-compose logs -f api
docker-compose logs -f web
```

---

## 🆘 4. Troubleshooting Common Issues

### Issue 1: Razorpay Webhook Signature Failure
- **Symptom**: Webhook status shows `WARNING` in audit logs.
- **Fix**: Verify `RAZORPAY_KEY_SECRET` in `apps/api/.env` matches Razorpay merchant dashboard secret key.

### Issue 2: Prisma Migration Conflict
- **Fix**: Run `npx prisma migrate dev --schema=packages/database/prisma/schema.prisma`.
