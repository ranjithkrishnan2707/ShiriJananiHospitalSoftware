# 🏥 SHRI JANANI HOSPITAL SOFTWARE - CLIENT HANDOVER GUIDE

This guide explains how to install and deliver the **Shri Janani Hospital Software** to your client.

---

## 🚀 Simple Client Installation (2 Steps)

### Step 1: Install MySQL Server (One-Time)
1. Download & install **MySQL Server 8.0** or **XAMPP** on your client's Admin PC.
2. Set the root password during setup (e.g. `Ranjith@2660` or custom password).

---

### Step 2: Run 1-Click Automated Setup
1. Copy the software folder to your client's PC.
2. Double-click ⚙️ **`Install-And-Setup-Hospital-Software.bat`**.
3. Type the client's MySQL password when prompted and press Enter.

**Done!** The installer will automatically:
- Configure `.env` with the MySQL password.
- Install dependencies & build production bundle.
- **Create a Desktop Icon "Shri Janani Hospital"** on your client's Windows Desktop!
- Auto-create database `janani_hospital_db` and all 11 tables.

From now on, your client simply double-clicks the **"Shri Janani Hospital"** icon on their Windows Desktop to run the software!

---*(Alternative Browser Mode: Double-click `Start-Hospital-Software.bat`)*

---

## 🌐 Multi-Device LAN Setup (Admin, Doctor, Scan, Lab, Medical)

1. **Admin PC (Server)**:
   - Hosts MySQL Database (`janani_hospital_db`) and Express Backend Server.
   - Run `Start-Hospital-Software.bat` on the Admin PC.
   - Admin PC LAN IP address can be checked via `ipconfig` in Command Prompt (e.g. `192.168.1.100`).

2. **Client Devices (Doctor, Scan, Lab, Medical PCs)**:
   - Connect client PCs to the same local network / router using LAN cable or Wi-Fi.
   - Open browser on client PC and navigate to `http://<ADMIN_SERVER_IP>:5173`.
   - Click the **Server Online / Offline Pill** at the top right of the application header to enter the Admin PC's LAN IP address (e.g. `192.168.1.100`) and click **Test Connection**.

---

## ⚡ Offline Local Storage & Automatic MySQL Sync

- **When Admin PC is OFF**:
  - All client PCs (Doctor, Scan, Lab, Medical) continue to function without interruption.
  - Any new patient registrations, consultations, prescriptions, scan reports, or expenses are stored safely in local storage on each device.
  - Top header status displays `🔴 Offline Mode (X pending syncs)`.

- **When Admin PC turns back ON**:
  - Client devices automatically detect the Admin PC server within 5 seconds.
  - Top header status displays `🟢 Server Online`.
  - All pending local records automatically sync and move into the Admin PC MySQL database seamlessly without any manual data entry!

---

## 🛠 Features Handed Over to Client:
- **Multi-Device LAN Access** (Admin, Doctor, Scan, Lab, Medical).
- **Offline Storage & Auto-Sync Engine** when Admin PC is powered off.
- **OPD Patient Registration** with Aadhar Number support & print slips.
- **IPD Patient Admission** & discharge management.
- **Doctor Consultation Module** with diagnosis, prescription & lab/scan ordering.
- **Radiology & Scan Center** with report uploads & print slips.
- **Medical & Pharmacy Operations** counter & inventory.
- **Lab Diagnostics** management.
- **Hospital Expense Tracking** & financial monitoring.
- **MySQL Database Storage** with auto-schema creation and data persistence.

