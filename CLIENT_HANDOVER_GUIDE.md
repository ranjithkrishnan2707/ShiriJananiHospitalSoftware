# 🏥 SHRI JANANI HOSPITAL SOFTWARE - CLIENT HANDOVER GUIDE

This guide explains how to install and deliver the **Shri Janani Hospital Software** to your client.

---

## 🚀 Client Installation Steps (3 Steps)

### Step 1: Install MySQL on Client PC
1. Download & install **MySQL Server 8.0** or **XAMPP** on your client's computer.
2. During setup, set the root password (e.g. `Ranjith@2660` or custom password).

---

### Step 2: Configure Environment (.env)
Open the `.env` file in the application folder and set your client's MySQL password:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_client_mysql_password
DB_NAME=janani_hospital_db
DB_PORT=3306
```

---

### Step 3: Start Application (1-Click Launch)
Your client just needs to double-click:
📄 **`Start-Hospital-Software.bat`**

When launched:
1. The backend API connects to MySQL and **automatically creates the database `janani_hospital_db` and all 11 tables** from `database/schema.sql`.
2. The web application opens automatically in their browser at `http://localhost:5173`.

---

## 🛠 Features Handed Over to Client:
- **OPD Patient Registration** with Aadhar Number support & print slips.
- **IPD Patient Admission** & discharge management.
- **Doctor Consultation Module** with diagnosis, prescription & lab/scan ordering.
- **Radiology & Scan Center** with report uploads & print slips.
- **Medical & Pharmacy Operations** counter & inventory.
- **Lab Diagnostics** management.
- **Hospital Expense Tracking** & financial monitoring.
- **MySQL Database Storage** with full data persistence.
