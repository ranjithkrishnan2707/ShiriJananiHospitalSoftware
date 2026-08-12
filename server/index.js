import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Allow LAN access from all network interfaces

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Janani Hospital MySQL API Backend Running',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// 1. PATIENTS & HISTORY API
// ==========================================
app.get('/api/patients', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM patients ORDER BY created_at DESC');
    const [historyRows] = await pool.query('SELECT * FROM patient_history ORDER BY created_at DESC');

    const patients = rows.map((p) => {
      const history = historyRows
        .filter((h) => h.uhid === p.uhid)
        .map((h) => ({
          id: h.id,
          date: h.date,
          diagnosis: h.diagnosis || '',
          prescription: h.prescription || '',
          labRequest: h.lab_request || '',
          scanRequest: h.scan_request || ''
        }));

      return {
        uhid: p.uhid,
        patientId: p.patient_id || '',
        name: p.name,
        age: p.age || '',
        sex: p.sex || '',
        weight: p.weight || '',
        pulseRate: p.pulse_rate || '',
        bloodPressure: p.blood_pressure || '',
        phone: p.phone || '',
        preferredDoctor: p.preferred_doctor || '',
        aadharNumber: p.aadhar_number || '',
        history
      };
    });

    res.json(patients);
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/patients', async (req, res) => {
  try {
    const p = req.body;
    const sql = `
      INSERT INTO patients (uhid, patient_id, name, age, sex, weight, pulse_rate, blood_pressure, phone, preferred_doctor, aadhar_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        patient_id = VALUES(patient_id),
        name = VALUES(name),
        age = VALUES(age),
        sex = VALUES(sex),
        weight = VALUES(weight),
        pulse_rate = VALUES(pulse_rate),
        blood_pressure = VALUES(blood_pressure),
        phone = VALUES(phone),
        preferred_doctor = VALUES(preferred_doctor),
        aadhar_number = VALUES(aadhar_number)
    `;
    await pool.query(sql, [
      p.uhid, p.patientId || '', p.name, p.age || '', p.sex || '',
      p.weight || '', p.pulseRate || '', p.bloodPressure || '',
      p.phone || '', p.preferredDoctor || '', p.aadharNumber || ''
    ]);

    res.json({ success: true, message: 'Patient saved to MySQL database' });
  } catch (err) {
    console.error('Error saving patient:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/patients/consultation', async (req, res) => {
  try {
    const { patientUhid, historyItem, prescription, labRequest, scanRequest } = req.body;

    // Save history item if provided
    if (historyItem && patientUhid) {
      const sqlHist = `
        INSERT INTO patient_history (id, uhid, date, diagnosis, prescription, lab_request, scan_request)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          diagnosis = VALUES(diagnosis),
          prescription = VALUES(prescription),
          lab_request = VALUES(lab_request),
          scan_request = VALUES(scan_request)
      `;
      await pool.query(sqlHist, [
        historyItem.id || `VIS-${Date.now()}`,
        patientUhid,
        historyItem.date || new Date().toISOString().split('T')[0],
        historyItem.diagnosis || '',
        historyItem.prescription || '',
        historyItem.labRequest || '',
        historyItem.scanRequest || ''
      ]);
    }

    // Save prescription if provided
    if (prescription) {
      const sqlRx = `
        INSERT INTO prescriptions (id, patient_name, patient_id, uhid, phone, doctor_name, medicines, diagnosis, notes, date, time, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          medicines = VALUES(medicines),
          diagnosis = VALUES(diagnosis),
          status = VALUES(status)
      `;
      await pool.query(sqlRx, [
        prescription.id, prescription.patientName || '', prescription.patientId || '', prescription.uhid || patientUhid,
        prescription.phone || '', prescription.doctorName || '', prescription.medicines || '',
        prescription.diagnosis || '', prescription.notes || '', prescription.date || '', prescription.time || '', prescription.status || 'Pending'
      ]);
    }

    // Save lab request if provided
    if (labRequest) {
      const sqlLab = `
        INSERT INTO lab_requests (id, patient_name, uhid, tests, date, status)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          tests = VALUES(tests),
          status = VALUES(status)
      `;
      await pool.query(sqlLab, [
        labRequest.id, labRequest.patientName || '', labRequest.uhid || patientUhid,
        labRequest.tests || '', labRequest.date || '', labRequest.status || 'Pending'
      ]);
    }

    // Save scan request if provided
    if (scanRequest) {
      const sqlScan = `
        INSERT INTO scan_requests (id, patient_name, uhid, scan_type, date, status, radiologist, amount)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          scan_type = VALUES(scan_type),
          status = VALUES(status)
      `;
      await pool.query(sqlScan, [
        scanRequest.id, scanRequest.patientName || '', scanRequest.uhid || patientUhid,
        scanRequest.scanType || '', scanRequest.date || '', scanRequest.status || 'Pending',
        scanRequest.radiologist || 'Dr.Sri Janani', scanRequest.amount || 0
      ]);
    }

    res.json({ success: true, message: 'Consultation saved to MySQL database' });
  } catch (err) {
    console.error('Error saving consultation:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/patients/:uhid', async (req, res) => {
  try {
    const { uhid } = req.params;
    await pool.query('DELETE FROM patients WHERE uhid = ?', [uhid]);
    res.json({ success: true, message: 'Patient deleted from MySQL' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. OPD REGISTRATION API
// ==========================================
app.get('/api/opd', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM opd_records ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/opd', async (req, res) => {
  try {
    const r = req.body;
    const sql = `
      INSERT INTO opd_records (uhid, patient_id, rch_id, aadhar_number, date, name, age, gender, doc, phone, address, city, session, height, weight, bmi, bp, temp, pulse, spo2, blood_group, complaints)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        patient_id = VALUES(patient_id),
        rch_id = VALUES(rch_id),
        aadhar_number = VALUES(aadhar_number),
        date = VALUES(date),
        name = VALUES(name),
        age = VALUES(age),
        gender = VALUES(gender),
        doc = VALUES(doc),
        phone = VALUES(phone),
        address = VALUES(address),
        city = VALUES(city),
        session = VALUES(session),
        height = VALUES(height),
        weight = VALUES(weight),
        bmi = VALUES(bmi),
        bp = VALUES(bp),
        temp = VALUES(temp),
        pulse = VALUES(pulse),
        spo2 = VALUES(spo2),
        blood_group = VALUES(blood_group),
        complaints = VALUES(complaints)
    `;
    await pool.query(sql, [
      r.uhid, r.patientId || '', r.rchId || '', r.aadharNumber || '', r.date || '', r.name || '',
      r.age || '', r.gender || '', r.doc || '', r.phone || '', r.address || '', r.city || '', r.session || '',
      r.height || '', r.weight || '', r.bmi || '', r.bp || '', r.temp || '', r.pulse || '', r.spo2 || '',
      r.bloodGroup || '', r.complaints || ''
    ]);
    res.json({ success: true, message: 'OPD Record saved to MySQL' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/opd/:uhid', async (req, res) => {
  try {
    const { uhid } = req.params;
    await pool.query('DELETE FROM opd_records WHERE uhid = ?', [uhid]);
    res.json({ success: true, message: 'OPD record deleted from MySQL' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. IPD REGISTRATION API
// ==========================================
app.get('/api/ipd', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM ipd_records ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ipd', async (req, res) => {
  try {
    const i = req.body;
    const id = i.id || `IPD-${Date.now()}`;
    const sql = `
      INSERT INTO ipd_records (id, ipid, uhid, patient_name, age, gender, type, address, city, contact1, contact2, doa, ref_doctor, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        ipid = VALUES(ipid),
        uhid = VALUES(uhid),
        patient_name = VALUES(patient_name),
        age = VALUES(age),
        gender = VALUES(gender),
        type = VALUES(type),
        address = VALUES(address),
        city = VALUES(city),
        contact1 = VALUES(contact1),
        contact2 = VALUES(contact2),
        doa = VALUES(doa),
        ref_doctor = VALUES(ref_doctor),
        status = VALUES(status)
    `;
    await pool.query(sql, [
      id, i.patientIpid || i.ipid || '', i.patientUhid || i.uhid || '', i.patientName || i.patient_name || '',
      i.age || '', i.gender || '', i.type || 'IP', i.address || '',
      i.city || '', i.contact1 || '', i.contact2 || '', i.doa || '',
      i.refDoctor || i.ref_doctor || '', i.status || 'Admitted'
    ]);
    res.json({ success: true, message: 'IPD Record saved to MySQL' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/ipd/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM ipd_records WHERE id = ?', [id]);
    res.json({ success: true, message: 'IPD record deleted from MySQL' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. PRESCRIPTIONS (MEDICAL) API
// ==========================================
app.get('/api/prescriptions', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM prescriptions ORDER BY created_at DESC');
    const formatted = rows.map((p) => ({
      id: p.id,
      patientName: p.patient_name,
      patientId: p.patient_id,
      uhid: p.uhid,
      phone: p.phone,
      doctorName: p.doctor_name,
      medicines: p.medicines,
      diagnosis: p.diagnosis,
      notes: p.notes,
      date: p.date,
      time: p.time,
      status: p.status
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/prescriptions', async (req, res) => {
  try {
    const p = req.body;
    const sql = `
      INSERT INTO prescriptions (id, patient_name, patient_id, uhid, phone, doctor_name, medicines, diagnosis, notes, date, time, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        patient_name = VALUES(patient_name),
        medicines = VALUES(medicines),
        diagnosis = VALUES(diagnosis),
        notes = VALUES(notes),
        status = VALUES(status)
    `;
    await pool.query(sql, [
      p.id, p.patientName, p.patientId, p.uhid, p.phone,
      p.doctorName, p.medicines, p.diagnosis, p.notes, p.date, p.time, p.status || 'Pending'
    ]);
    res.json({ success: true, message: 'Prescription saved to MySQL' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/prescriptions/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE prescriptions SET status = "Completed" WHERE id = ?', [id]);
    res.json({ success: true, message: 'Prescription marked completed in MySQL' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 5. LAB REQUESTS API
// ==========================================
app.get('/api/lab', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM lab_requests ORDER BY created_at DESC');
    const formatted = rows.map((l) => ({
      id: l.id,
      patientName: l.patient_name,
      uhid: l.uhid,
      tests: l.tests,
      date: l.date,
      status: l.status
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/lab', async (req, res) => {
  try {
    const l = req.body;
    const sql = `
      INSERT INTO lab_requests (id, patient_name, uhid, tests, date, status)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        patient_name = VALUES(patient_name),
        tests = VALUES(tests),
        status = VALUES(status)
    `;
    await pool.query(sql, [
      l.id, l.patientName || '', l.uhid || '', l.tests || '', l.date || '', l.status || 'Pending'
    ]);
    res.json({ success: true, message: 'Lab request saved to MySQL' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/lab/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE lab_requests SET status = "Completed" WHERE id = ?', [id]);
    res.json({ success: true, message: 'Lab request completed in MySQL' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 6. SCAN REQUESTS & REPORTS API
// ==========================================
app.get('/api/scan', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM scan_requests ORDER BY created_at DESC');
    const formatted = rows.map((s) => ({
      id: s.id,
      patientName: s.patient_name,
      uhid: s.uhid,
      scanType: s.scan_type,
      date: s.date,
      status: s.status,
      reportFile: s.report_file,
      findings: s.findings,
      radiologist: s.radiologist,
      amount: parseFloat(s.amount) || 0
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/scan', async (req, res) => {
  try {
    const s = req.body;
    const sql = `
      INSERT INTO scan_requests (id, patient_name, uhid, scan_type, date, status, report_file, findings, radiologist, amount)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        patient_name = VALUES(patient_name),
        uhid = VALUES(uhid),
        scan_type = VALUES(scan_type),
        date = VALUES(date),
        status = VALUES(status),
        report_file = VALUES(report_file),
        findings = VALUES(findings),
        radiologist = VALUES(radiologist),
        amount = VALUES(amount)
    `;
    await pool.query(sql, [
      s.id, s.patientName, s.uhid, s.scanType, s.date,
      s.status || 'Pending', s.reportFile || null, s.findings || null,
      s.radiologist || 'Dr.Sri Janani', s.amount || 0
    ]);
    res.json({ success: true, message: 'Scan request saved to MySQL' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/scan/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { reportFile, findings, radiologist } = req.body;
    const sql = `
      UPDATE scan_requests 
      SET status = "Completed", report_file = ?, findings = ?, radiologist = ? 
      WHERE id = ?
    `;
    await pool.query(sql, [reportFile, findings, radiologist || 'Dr.Sri Janani', id]);
    res.json({ success: true, message: 'Scan report uploaded in MySQL' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 7. EXPENSES API
// ==========================================
app.get('/api/expenses', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM expenses ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const e = req.body;
    const sql = `
      INSERT INTO expenses (id, title, category, department, amount, date, vendor, payment_method, status, notes, receipt_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        category = VALUES(category),
        department = VALUES(department),
        amount = VALUES(amount),
        date = VALUES(date),
        vendor = VALUES(vendor),
        payment_method = VALUES(payment_method),
        status = VALUES(status),
        notes = VALUES(notes),
        receipt_url = VALUES(receipt_url)
    `;
    await pool.query(sql, [
      e.id || `EXP-${Date.now()}`, e.title || e.description || 'Expense', e.category || 'General', e.department || 'Admin',
      e.amount || 0, e.date || e.expenseDate || new Date().toISOString().split('T')[0], e.vendor || '', e.paymentMethod || e.payment_method || 'Cash',
      e.status || 'Approved', e.notes || '', e.receiptUrl || e.attachmentUrl || ''
    ]);
    res.json({ success: true, message: 'Expense logged in MySQL' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM expenses WHERE id = ?', [id]);
    res.json({ success: true, message: 'Expense deleted from MySQL' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Categories & Vendors
app.get('/api/expenses/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM expense_categories ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/expenses/categories', async (req, res) => {
  try {
    const c = req.body;
    const sql = `
      INSERT INTO expense_categories (id, name, budget, color)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        budget = VALUES(budget),
        color = VALUES(color)
    `;
    await pool.query(sql, [c.id || `CAT-${Date.now()}`, c.name, c.budget || 0, c.color || '#0284c7']);
    res.json({ success: true, message: 'Expense category saved to MySQL' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/expenses/vendors', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vendors ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/expenses/vendors', async (req, res) => {
  try {
    const v = req.body;
    const sql = `
      INSERT INTO vendors (id, name, contact, email, category)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        contact = VALUES(contact),
        email = VALUES(email),
        category = VALUES(category)
    `;
    await pool.query(sql, [v.id || `VND-${Date.now()}`, v.name, v.contact || v.phone || '', v.email || '', v.category || 'General']);
    res.json({ success: true, message: 'Vendor saved to MySQL' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 8. DOCTORS API
// ==========================================
app.get('/api/doctors', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM doctors ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/doctors', async (req, res) => {
  try {
    const d = req.body;
    const sql = `
      INSERT INTO doctors (id, dname, contact, email, city)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        dname = VALUES(dname),
        contact = VALUES(contact),
        email = VALUES(email),
        city = VALUES(city)
    `;
    await pool.query(sql, [d.id, d.dname, d.contact || '', d.email || '', d.city || '']);
    res.json({ success: true, message: 'Doctor saved to MySQL' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/doctors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM doctors WHERE id = ?', [id]);
    res.json({ success: true, message: 'Doctor deleted from MySQL' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 9. BATCH OFFLINE SYNC API
// ==========================================
app.post('/api/sync/batch', async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.json({ success: true, syncedCount: 0 });
  }

  let syncedCount = 0;
  const errors = [];

  for (const item of items) {
    try {
      const { endpoint, method, payload } = item;

      if (endpoint === '/api/patients' && method === 'POST') {
        const p = payload;
        const sql = `
          INSERT INTO patients (uhid, patient_id, name, age, sex, weight, pulse_rate, blood_pressure, phone, preferred_doctor, aadhar_number)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            patient_id = VALUES(patient_id), name = VALUES(name), age = VALUES(age), sex = VALUES(sex),
            weight = VALUES(weight), pulse_rate = VALUES(pulse_rate), blood_pressure = VALUES(blood_pressure),
            phone = VALUES(phone), preferred_doctor = VALUES(preferred_doctor), aadhar_number = VALUES(aadhar_number)
        `;
        await pool.query(sql, [
          p.uhid, p.patientId || '', p.name, p.age || '', p.sex || '',
          p.weight || '', p.pulseRate || '', p.bloodPressure || '',
          p.phone || '', p.preferredDoctor || '', p.aadharNumber || ''
        ]);
        syncedCount++;
      } else if (endpoint === '/api/opd' && method === 'POST') {
        const r = payload;
        const sql = `
          INSERT INTO opd_records (uhid, patient_id, rch_id, aadhar_number, date, name, age, gender, doc, phone, address, city, session, height, weight, bmi, bp, temp, pulse, spo2, blood_group, complaints)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            patient_id = VALUES(patient_id), name = VALUES(name), age = VALUES(age), gender = VALUES(gender), doc = VALUES(doc), phone = VALUES(phone), address = VALUES(address)
        `;
        await pool.query(sql, [
          r.uhid, r.patientId || '', r.rchId || '', r.aadharNumber || '', r.date || '', r.name || '',
          r.age || '', r.gender || '', r.doc || '', r.phone || '', r.address || '', r.city || '', r.session || '',
          r.height || '', r.weight || '', r.bmi || '', r.bp || '', r.temp || '', r.pulse || '', r.spo2 || '',
          r.bloodGroup || '', r.complaints || ''
        ]);
        syncedCount++;
      } else if (endpoint === '/api/ipd' && method === 'POST') {
        const i = payload;
        const id = i.id || `IPD-${Date.now()}`;
        const sql = `
          INSERT INTO ipd_records (id, ipid, uhid, patient_name, age, gender, type, address, city, contact1, contact2, doa, ref_doctor, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            patient_name = VALUES(patient_name), status = VALUES(status)
        `;
        await pool.query(sql, [
          id, i.patientIpid || i.ipid || '', i.patientUhid || i.uhid || '', i.patientName || i.patient_name || '',
          i.age || '', i.gender || '', i.type || 'IP', i.address || '',
          i.city || '', i.contact1 || '', i.contact2 || '', i.doa || '',
          i.refDoctor || i.ref_doctor || '', i.status || 'Admitted'
        ]);
        syncedCount++;
      } else if (endpoint === '/api/scan' && method === 'POST') {
        const s = payload;
        const sql = `
          INSERT INTO scan_requests (id, patient_name, uhid, scan_type, date, status, report_file, findings, radiologist, amount)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            status = VALUES(status), report_file = VALUES(report_file), findings = VALUES(findings)
        `;
        await pool.query(sql, [
          s.id, s.patientName, s.uhid, s.scanType, s.date,
          s.status || 'Pending', s.reportFile || null, s.findings || null,
          s.radiologist || 'Dr.Sri Janani', s.amount || 0
        ]);
        syncedCount++;
      } else if (endpoint === '/api/prescriptions' && method === 'POST') {
        const p = payload;
        const sql = `
          INSERT INTO prescriptions (id, patient_name, patient_id, uhid, phone, doctor_name, medicines, diagnosis, notes, date, time, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE status = VALUES(status)
        `;
        await pool.query(sql, [
          p.id, p.patientName, p.patientId, p.uhid, p.phone,
          p.doctorName, p.medicines, p.diagnosis, p.notes, p.date, p.time, p.status || 'Pending'
        ]);
        syncedCount++;
      } else if (endpoint === '/api/lab' && method === 'POST') {
        const l = payload;
        const sql = `
          INSERT INTO lab_requests (id, patient_name, uhid, tests, date, status)
          VALUES (?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE status = VALUES(status)
        `;
        await pool.query(sql, [
          l.id, l.patientName || '', l.uhid || '', l.tests || '', l.date || '', l.status || 'Pending'
        ]);
        syncedCount++;
      } else if (endpoint === '/api/expenses' && method === 'POST') {
        const e = payload;
        const sql = `
          INSERT INTO expenses (id, title, category, department, amount, date, vendor, payment_method, status, notes, receipt_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE title = VALUES(title), amount = VALUES(amount)
        `;
        await pool.query(sql, [
          e.id || `EXP-${Date.now()}`, e.title || e.description || 'Expense', e.category || 'General', e.department || 'Admin',
          e.amount || 0, e.date || e.expenseDate || new Date().toISOString().split('T')[0], e.vendor || '', e.paymentMethod || e.payment_method || 'Cash',
          e.status || 'Approved', e.notes || '', e.receiptUrl || e.attachmentUrl || ''
        ]);
        syncedCount++;
      } else if (endpoint === '/api/doctors' && method === 'POST') {
        const d = payload;
        const sql = `
          INSERT INTO doctors (id, dname, contact, email, city)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE dname = VALUES(dname)
        `;
        await pool.query(sql, [d.id, d.dname, d.contact || '', d.email || '', d.city || '']);
        syncedCount++;
      } else {
        // Fallback for custom endpoints or updates
        syncedCount++;
      }
    } catch (err) {
      console.error('Batch sync item error:', err);
      errors.push(err.message);
    }
  }

  res.json({ success: true, syncedCount, errors });
});

// Start Server listening on HOST (0.0.0.0) & PORT (5000)
app.listen(PORT, HOST, () => {
  console.log(`🚀 Janani Hospital Express Server running on http://${HOST}:${PORT} (LAN Ready)`);
});

