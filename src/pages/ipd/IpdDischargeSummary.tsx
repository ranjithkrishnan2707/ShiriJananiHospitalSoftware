import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Save, Printer, ArrowLeft } from 'lucide-react';
import './IpdDischargeSummary.css';

export interface MedicationRowItem {
  id: number;
  injName: string;
  drug: string;
  dose: string;
  route: string;
  frequency: string;
}

export interface AdviceRowItem {
  id: number;
  tabletName: string;
  mg: string;
  timing: string;
  days: string;
}

const IpdDischargeSummary: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);

  const [medicationRows, setMedicationRows] = useState<MedicationRowItem[]>([
    { id: 1, injName: ' ', drug: ' ', dose: ' ', route: ' ', frequency: ' ' },
  ]);

  const [adviceRows, setAdviceRows] = useState<AdviceRowItem[]>([
    { id: 1, tabletName: ' ', mg: ' ', timing: ' ', days: ' ' },
    
  ]);

  const addMedicationRow = () => {
    const nextId = medicationRows.length ? Math.max(...medicationRows.map(r => r.id)) + 1 : 1;
    setMedicationRows(prev => [...prev, { id: nextId, injName: '', drug: '', dose: '', route: '', frequency: '' }]);
  };

  const removeMedicationRow = (id: number) => {
    setMedicationRows(prev => prev.filter(r => r.id !== id));
  };

  const addAdviceRow = () => {
    const nextId = adviceRows.length ? Math.max(...adviceRows.map(r => r.id)) + 1 : 1;
    setAdviceRows(prev => [...prev, { id: nextId, tabletName: '', mg: '', timing: ' ', days: '' }]);
  };

  const removeAdviceRow = (id: number) => {
    setAdviceRows(prev => prev.filter(r => r.id !== id));
  };

  const handleSaveSummary = () => {
    alert("IP Discharge Summary Saved Successfully!");
  };

  const renderTab1 = () => (
    <div className="discharge-form-card">
      <h3 className="form-section-title">General Information</h3>
      <div className="grid-2-col">
        <div className="discharge-form-group">
          <label>NAME</label>
          <input type="text" defaultValue=" " />
        </div>
        <div className="grid-2-col">
          <div className="discharge-form-group">
            <label>AGE</label>
            <input type="text" defaultValue=" " />
          </div>
          <div className="discharge-form-group">
            <label>SEX</label>
            <input type="text" defaultValue=" " />
          </div>
        </div>
      </div>
      
      <div className="discharge-form-group">
        <label>ADDRESS</label>
        <textarea defaultValue=" "></textarea>
      </div>

      <div className="grid-3-col">
        <div className="discharge-form-group">
          <label>MRD NO</label>
          <input type="text" defaultValue=" " />
        </div>
        <div className="discharge-form-group">
          <label>IP NO</label>
          <input type="text" defaultValue=" " />
        </div>
        <div className="discharge-form-group">
          <label>R NO</label>
          <input type="text" defaultValue=" " />
        </div>
      </div>

      <div className="grid-3-col">
        <div className="discharge-form-group">
          <label>DOA</label>
          <input type="date" defaultValue=" " />
        </div>
        <div className="discharge-form-group">
          <label>DOS</label>
          <input type="date" defaultValue=" " />
        </div>
        <div className="discharge-form-group">
          <label>DOD</label>
          <input type="date" defaultValue=" " />
        </div>
      </div>

      <div className="grid-2-col">
        <div className="discharge-form-group">
          <label>CONSULTANT</label>
          <input type="text" defaultValue=" " />
        </div>
        <div className="discharge-form-group">
          <label>ICD CODE</label>
          <input type="text" defaultValue=" " />
        </div>
      </div>

      <div className="discharge-form-group">
        <label>DIAGNOSIS</label>
        <textarea defaultValue=" "></textarea>
      </div>
      
      <div className="discharge-form-group">
        <label>PROCEDURE DONE</label>
        <textarea defaultValue=" "></textarea>
      </div>

      <div className="discharge-form-group">
        <label>PRESENT COMPLAINTS</label>
        <textarea defaultValue=""></textarea>
      </div>

      <div className="discharge-form-group">
        <label>PAST HISTORY</label>
        <textarea defaultValue=" "></textarea>
      </div>

      <div className="discharge-form-group">
        <label>COURSE IN THE HOSPITAL</label>
        <textarea style={{minHeight: '100px'}} defaultValue=" "></textarea>
      </div>
    </div>
  );

  const renderTab2 = () => (
    <div className="discharge-form-card">
      <h3 className="form-section-title">On Examination</h3>
      <div className="grid-2-col">
        <div className="discharge-form-group">
          <label>PATIENT CONSCIOUS, ORIENTED, AFEBRILE</label>
          <input type="text" defaultValue=" " />
        </div>
        <div className="discharge-form-group">
          <label>PATIENT NOT ANAEMIC</label>
          <input type="text" defaultValue=" " />
        </div>
        <div className="discharge-form-group">
          <label>CVS</label>
          <input type="text" defaultValue=" " />
        </div>
        <div className="discharge-form-group">
          <label>RS</label>
          <input type="text" defaultValue=" " />
        </div>
        <div className="discharge-form-group">
          <label>CNS</label>
          <input type="text" defaultValue=" " />
        </div>
        <div className="discharge-form-group">
          <label>P/A</label>
          <input type="text" defaultValue=" " />
        </div>
      </div>

      <h3 className="form-section-title" style={{ marginTop: '24px' }}>Vitals at Discharge</h3>
      <div className="grid-3-col">
        <div className="discharge-form-group">
          <label>WEIGHT (KG)</label>
          <input type="text" defaultValue=" " />
        </div>
        <div className="discharge-form-group">
          <label>BP (mmHg)</label>
          <input type="text" defaultValue=" " />
        </div>
        <div className="discharge-form-group">
          <label>PR (b/min)</label>
          <input type="text" defaultValue="" />
        </div>
        <div className="discharge-form-group">
          <label>TEMP (°F)</label>
          <input type="text" defaultValue=" " />
        </div>
        <div className="discharge-form-group">
          <label>SPO2 (%)</label>
          <input type="text" defaultValue=" " />
        </div>
      </div>
    </div>
  );

  const renderTab3 = () => (
    <div className="discharge-form-card">
      <h3 className="form-section-title">Baby Details</h3>
      <div className="grid-3-col">
        <div className="discharge-form-group">
          <label>AN ALIVE TERM</label>
          <input type="text" defaultValue="FEMALE BABY" />
        </div>
        <div className="discharge-form-group">
          <label>WEIGHT (KG)</label>
          <input type="text" defaultValue="3.1" />
        </div>
        <div className="discharge-form-group">
          <label>BY</label>
          <input type="text" defaultValue="FTND" />
        </div>
      </div>
      <div className="grid-2-col">
        <div className="discharge-form-group">
          <label>DATE AND TIME</label>
          <input type="datetime-local" defaultValue={new Date().toISOString().slice(0, 16)} />
        </div>
        <div className="discharge-form-group">
          <label>BABY CRIED IMMEDIATELY AFTER BIRTH</label>
          <select defaultValue="YES">
            <option value="YES">YES</option>
            <option value="NO">NO</option>
          </select>
        </div>
        <div className="discharge-form-group">
          <label>APGAR SCORE</label>
          <input type="text" defaultValue="8/10, 9/10" />
        </div>
        <div className="discharge-form-group">
          <label>LIQUOR</label>
          <input type="text" defaultValue="CLEAR" />
        </div>
      </div>

      <h3 className="form-section-title" style={{ marginTop: '24px' }}>Given In-Hospital Medication</h3>
      <table className="medication-table">
        <thead>
          <tr>
            <th>INJ / DRUG NAME</th>
            <th>MOLECULE</th>
            <th>DOSE</th>
            <th>ROUTE</th>
            <th>FREQUENCY</th>
            <th style={{ width: '40px' }}>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {medicationRows.map((row) => (
            <tr key={row.id}>
              <td><input type="text" defaultValue={row.injName} onChange={e => row.injName = e.target.value} /></td>
              <td><input type="text" defaultValue={row.drug} onChange={e => row.drug = e.target.value} /></td>
              <td><input type="text" defaultValue={row.dose} onChange={e => row.dose = e.target.value} /></td>
              <td><input type="text" defaultValue={row.route} onChange={e => row.route = e.target.value} /></td>
              <td><input type="text" defaultValue={row.frequency} onChange={e => row.frequency = e.target.value} /></td>
              <td>
                <button className="btn-icon" style={{ color: 'var(--color-error)' }} onClick={() => removeMedicationRow(row.id)} title="Delete row">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-row-btn" type="button" onClick={addMedicationRow} style={{ marginTop: '8px' }}>
        <Plus size={16} /> Add Medication Row
      </button>

      <div className="discharge-form-group" style={{ marginTop: '24px' }}>
        <label>CONDITION AT DISCHARGE</label>
        <textarea defaultValue="MOTHER AND BABY ARE STABLE AND FIT FOR DISCHARGE"></textarea>
      </div>
    </div>
  );

  const renderTab4 = () => (
    <div className="discharge-form-card">
      <h3 className="form-section-title">Advice at Discharge</h3>
      
      <h4 style={{ marginBottom: '8px', color: '#475569' }}>MOTHER MEDICATIONS:</h4>
      <table className="medication-table">
        <thead>
          <tr>
            <th>TABLET NAME</th>
            <th>MG</th>
            <th>TIMING (AF / BF)</th>
            <th>NO. OF DAYS</th>
            <th style={{ width: '40px' }}>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {adviceRows.map((row) => (
            <tr key={row.id}>
              <td><input type="text" defaultValue={row.tabletName} onChange={e => row.tabletName = e.target.value} /></td>
              <td><input type="text" defaultValue={row.mg} onChange={e => row.mg = e.target.value} /></td>
              <td>
                <select defaultValue={row.timing} onChange={e => row.timing = e.target.value} style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }}>
                  <option value="AF">AF (After Food)</option>
                  <option value="BF">BF (Before Food)</option>
                </select>
              </td>
              <td><input type="text" defaultValue={row.days} onChange={e => row.days = e.target.value} /></td>
              <td>
                <button className="btn-icon" style={{ color: 'var(--color-error)' }} onClick={() => removeAdviceRow(row.id)} title="Delete row">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-row-btn" type="button" onClick={addAdviceRow} style={{ marginBottom: '24px', marginTop: '8px' }}>
        <Plus size={16} /> Add Advice Row
      </button>

      <div className="discharge-form-group">
        <label>OINTMENT</label>
        <input type="text" defaultValue="MUPIWIK OINTMENT (EXTERNAL USE ONLY)" />
      </div>

      <div className="discharge-form-group">
        <label>CONTINUE TABLETS</label>
        <input type="text" defaultValue="TO CONTINUE TAB.CALCIUM & IRON TABLETS FOR 3 MONTHS" />
      </div>

      <h4 style={{ marginBottom: '8px', color: '#475569', marginTop: '16px' }}>GENERAL INSTRUCTIONS:</h4>
      <ul style={{ marginBottom: '24px', paddingLeft: '20px', lineHeight: '1.8' }}>
        <li>LOW FAT, HIGH PROTEIN DIET</li>
        <li>PLENTY OF ORAL FLUIDS (3-4 LITERS/DAY)</li>
        <li>POSTNATAL EXERCISES AFTER 2 WEEKS</li>
        <li>IMMUNISE BABY AS PER SCHEDULE</li>
        <li>EXCLUSIVE BREAST FEEDING FOR 6 MONTHS</li>
        <li>ADVICE ABOUT CONTRACEPTION</li>
      </ul>

      <div className="discharge-form-group">
        <label>REVIEW AFTER ONE WEEK ON DATE</label>
        <input type="date" defaultValue={new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]} style={{ maxWidth: '200px' }} />
      </div>

      <div style={{ backgroundColor: '#fef2f2', padding: '16px', borderRadius: '6px', marginTop: '24px', border: '1px solid #fecaca' }}>
        <h4 style={{ color: '#ef4444', margin: '0 0 12px 0' }}>IN CASE OF ANY EMERGENCY CALL:</h4>
        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>90801 22772, 85258 22772</p>
        <p style={{ margin: '0 0 4px 0', fontSize: '13px' }}>DR. SARANYA (PEDIATRICIAN) CELL NO: 94866 40452</p>
        <p style={{ margin: '0', fontSize: '13px' }}>DR. MENAGA (LACTATION COUNSELING DOCTOR) CELL NO: 97886 64197</p>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '48px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ borderBottom: '1px solid #333', width: '220px', marginBottom: '8px' }}></div>
          <p style={{ margin: '0', fontWeight: 'bold' }}>SIGNATURE OF THE DOCTOR</p>
          <p style={{ margin: '0', fontSize: '12px', color: '#64748b' }}>DR. G. SRI JANANI MD (OG)</p>
          <p style={{ margin: '0', fontSize: '12px', color: '#64748b' }}>REG NO: 85720</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="discharge-container page-transition">
      <div className="discharge-header">
        <h2>Discharge Summary - Shri Janani Hospitals</h2>
        <div>
          <button className="btn-secondary" onClick={() => navigate(-1)} style={{ marginRight: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>

      <div className="discharge-tabs">
        <button 
          className={`tab-btn ${activeTab === 1 ? 'active' : ''}`}
          onClick={() => setActiveTab(1)}
        >
          General Info
        </button>
        <button 
          className={`tab-btn ${activeTab === 2 ? 'active' : ''}`}
          onClick={() => setActiveTab(2)}
        >
          Examination & Notes
        </button>
        <button 
          className={`tab-btn ${activeTab === 3 ? 'active' : ''}`}
          onClick={() => setActiveTab(3)}
        >
          Baby Details & In-Hospital Rx
        </button>
        <button 
          className={`tab-btn ${activeTab === 4 ? 'active' : ''}`}
          onClick={() => setActiveTab(4)}
        >
          Discharge Advice
        </button>
      </div>

      <div className="tab-content">
        <div style={{ display: activeTab === 1 ? 'block' : 'none' }}>
          {renderTab1()}
        </div>
        <div style={{ display: activeTab === 2 ? 'block' : 'none' }}>
          {renderTab2()}
        </div>
        <div style={{ display: activeTab === 3 ? 'block' : 'none' }}>
          {renderTab3()}
        </div>
        <div style={{ display: activeTab === 4 ? 'block' : 'none' }}>
          {renderTab4()}
        </div>
      </div>

      <div className="discharge-action-bar">
        <button className="action-btn" type="button" onClick={() => navigate('/ipd')}>Cancel</button>
        <button className="action-btn" type="button" onClick={handleSaveSummary} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Save size={16} /> Save Summary
        </button>
        <button className="btn-print" type="button" onClick={() => window.print()} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Printer size={16} /> Print
        </button>
      </div>
    </div>
  );
};

export default IpdDischargeSummary;
