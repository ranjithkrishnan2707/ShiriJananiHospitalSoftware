# 📦 How to Share Shri Janani Hospital Software v2.0.0

You can share this software with another person or install it on another PC using **3 simple methods**:

---

## 🚀 Method 1: Desktop Installer (.EXE) - Easiest & Recommended

Send the 1-click Windows Installer file to the recipient:

📁 **Location on your PC**:
```
c:\odinfotech\janani hospital software\release\Shree Janani Hospital Software Setup 2.0.0.exe
```

### Steps for Recipient:
1. Copy `Shree Janani Hospital Software Setup 2.0.0.exe` to the recipient's computer via USB Pen Drive, Google Drive, or Email.
2. Double-click the `.exe` file to install.
3. The software will automatically launch and create a desktop shortcut icon on their Windows desktop!

---

## ⚙️ Method 2: Full Source Folder + 1-Click Auto Setup

Send the software folder to the recipient for a complete local MySQL server & web server setup.

### Steps:
1. Copy the `janani hospital software` folder (or compress into a ZIP file) onto a Pen Drive or share via Google Drive.
2. On the recipient's PC, open the folder and double-click:
   👉 **`Install-And-Setup-Hospital-Software.bat`**
3. Type their local MySQL root password when prompted.

**Automated actions performed**:
- Creates the MySQL database `janani_hospital_db` and all required tables.
- Installs dependencies & production build.
- Creates a Windows Desktop Shortcut **"Shri Janani Hospital"**.

---

## 🌐 Method 3: Share Over Local Wi-Fi / Network (LAN Multi-Device)

Use this if you want other PCs (Doctor, Medical Counter, Lab, Scan Center) in the hospital to connect to your main computer without installing anything on their PCs!

### Steps:
1. **On your Main PC (Server)**:
   - Run `Start-Hospital-Software.bat` or launch the app.
   - Note your LAN IP address (e.g., `http://192.168.1.37:5173`).

2. **On Other PCs (Doctor, Lab, Medical, Scan)**:
   - Connect the PC to the same Wi-Fi / LAN router.
   - Open Chrome, Edge, or Firefox browser and type:
     `http://192.168.1.37:5173`
   - In the app header, click **Server Online** and enter `192.168.1.37` to sync data live!
