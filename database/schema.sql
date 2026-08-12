-- =========================================================
-- SHRI JANANI HOSPITAL SOFTWARE - MYSQL DATABASE SCHEMA
-- Database Name: janani_hospital_db
-- =========================================================

CREATE DATABASE IF NOT EXISTS janani_hospital_db;
USE janani_hospital_db;

-- ---------------------------------------------------------
-- 1. PATIENTS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS patients (
  uhid VARCHAR(50) PRIMARY KEY,
  patient_id VARCHAR(50),
  name VARCHAR(255) NOT NULL,
  age VARCHAR(20),
  sex VARCHAR(20),
  weight VARCHAR(20),
  pulse_rate VARCHAR(20),
  blood_pressure VARCHAR(20),
  phone VARCHAR(50),
  preferred_doctor VARCHAR(255),
  aadhar_number VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------
-- 2. PATIENT HISTORY TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS patient_history (
  id VARCHAR(50) PRIMARY KEY,
  uhid VARCHAR(50) NOT NULL,
  date VARCHAR(50),
  diagnosis TEXT,
  prescription TEXT,
  lab_request TEXT,
  scan_request TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uhid) REFERENCES patients(uhid) ON DELETE CASCADE
);

-- ---------------------------------------------------------
-- 3. OPD REGISTRATION RECORDS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS opd_records (
  uhid VARCHAR(50) PRIMARY KEY,
  patient_id VARCHAR(50),
  rch_id VARCHAR(50),
  aadhar_number VARCHAR(50),
  date VARCHAR(50),
  name VARCHAR(255) NOT NULL,
  age VARCHAR(20),
  gender VARCHAR(20),
  doc VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  session VARCHAR(50),
  height VARCHAR(20),
  weight VARCHAR(20),
  bmi VARCHAR(20),
  bp VARCHAR(20),
  temp VARCHAR(20),
  pulse VARCHAR(20),
  spo2 VARCHAR(20),
  blood_group VARCHAR(20),
  complaints TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------
-- 4. IPD REGISTRATION RECORDS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS ipd_records (
  id VARCHAR(50) PRIMARY KEY,
  ipid VARCHAR(50),
  uhid VARCHAR(50),
  patient_name VARCHAR(255) NOT NULL,
  age VARCHAR(20),
  gender VARCHAR(20),
  type VARCHAR(50) DEFAULT 'IP',
  address TEXT,
  city VARCHAR(100),
  contact1 VARCHAR(50),
  contact2 VARCHAR(50),
  doa VARCHAR(50),
  ref_doctor VARCHAR(255),
  status VARCHAR(50) DEFAULT 'Admitted',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------
-- 5. PRESCRIPTIONS (MEDICAL / PHARMACY) TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS prescriptions (
  id VARCHAR(50) PRIMARY KEY,
  patient_name VARCHAR(255) NOT NULL,
  patient_id VARCHAR(50),
  uhid VARCHAR(50),
  phone VARCHAR(50),
  doctor_name VARCHAR(255),
  medicines TEXT,
  diagnosis TEXT,
  notes TEXT,
  date VARCHAR(50),
  time VARCHAR(50),
  status ENUM('Pending', 'Completed') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------
-- 6. LAB REQUESTS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS lab_requests (
  id VARCHAR(50) PRIMARY KEY,
  patient_name VARCHAR(255) NOT NULL,
  uhid VARCHAR(50),
  tests TEXT,
  date VARCHAR(50),
  status ENUM('Pending', 'Completed') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------
-- 7. SCAN & RADIOLOGY REQUESTS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS scan_requests (
  id VARCHAR(50) PRIMARY KEY,
  patient_name VARCHAR(255) NOT NULL,
  uhid VARCHAR(50),
  scan_type VARCHAR(255) NOT NULL,
  date VARCHAR(50),
  status ENUM('Pending', 'Completed') DEFAULT 'Pending',
  report_file VARCHAR(255),
  findings TEXT,
  radiologist VARCHAR(255),
  amount DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------
-- 8. DOCTORS DIRECTORY TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS doctors (
  id VARCHAR(50) PRIMARY KEY,
  dname VARCHAR(255) NOT NULL,
  contact VARCHAR(50),
  email VARCHAR(100),
  city VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------
-- 9. HOSPITAL EXPENSES TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS expenses (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date VARCHAR(50) NOT NULL,
  vendor VARCHAR(255),
  payment_method VARCHAR(50) DEFAULT 'Cash',
  status VARCHAR(50) DEFAULT 'Approved',
  notes TEXT,
  receipt_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------
-- 10. EXPENSE CATEGORIES TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS expense_categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  budget DECIMAL(10,2) DEFAULT 0.00,
  color VARCHAR(50) DEFAULT '#0284c7',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------
-- 11. VENDORS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS vendors (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact VARCHAR(50),
  email VARCHAR(100),
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------
-- 12. INITIAL SEED DATA
-- ---------------------------------------------------------

-- Initial Doctors
INSERT INTO doctors (id, dname, contact, email, city) VALUES
('1', 'DR.SRI JANANI,MD.,OG.,', '9876543210', 'srijanani@hospital.com', 'Chennai'),
('2', 'DR.G.PRASANNA BALAJ, MD...', '9876543211', 'prasanna@hospital.com', 'Chennai'),
('3', 'DR.PRIYA DHARSHINI, MBBS...', '9876543212', 'priya@hospital.com', 'Chennai'),
('4', 'DR. SARANYA MBBS., DCH.', '9585822111', 'saranya@hospital.com', 'Chennai')
ON DUPLICATE KEY UPDATE dname=VALUES(dname);

-- Initial Patients
INSERT INTO patients (uhid, patient_id, name, age, sex, weight, pulse_rate, blood_pressure, phone, preferred_doctor, aadhar_number) VALUES
('3490', '1210', 'JAYA SUDHA W/O RAMESH', '29', 'Female', '62', '72', '120/80', '9876543210', 'Dr.Sri Janani', '9876 5432 1098'),
('3491', '1211', 'DEEPIKA W/O KANAN', '26', 'Female', '58', '76', '110/70', '9876543211', 'Dr.Sri Janani', '8765 4321 0987'),
('3492', '1212', 'MUNESHWARI W/O SEKAR', '21', 'Female', '54', '74', '115/75', '9876543212', 'Dr.Sri Janani', '7654 3210 9876')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Initial Scan Requests
INSERT INTO scan_requests (id, patient_name, uhid, scan_type, date, status, report_file, findings, radiologist, amount) VALUES
('SCN-101', 'JAYA SUDHA W/O RAMESH', '3490', 'Obstetric Anomaly USG Scan', '2026-08-09', 'Pending', NULL, NULL, 'Dr.Sri Janani', 2500.00),
('SCN-102', 'DEEPIKA W/O KANAN', '3491', 'Abdomen & Pelvis USG Scan', '2026-08-09', 'Completed', 'USG_Pelvis_Report_3491.pdf', 'Single live intrauterine gestation of ~28 weeks. Normal fetal cardiac activity & liquor volume.', 'Dr.Sri Janani', 1800.00)
ON DUPLICATE KEY UPDATE patient_name=VALUES(patient_name);
