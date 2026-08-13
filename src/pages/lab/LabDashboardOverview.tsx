import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHospital, type LabRequest } from '../../context/HospitalContext';
import {
  TestTube2, Search, FileText, CheckCircle, Clock,
  Printer, X, Plus, ArrowLeft, Eye, Receipt, UserPlus, ClipboardCheck
} from 'lucide-react';
import './LabDashboardOverview.css';

const LabDashboardOverview: React.FC = () => {
  const navigate = useNavigate();
  const { patients, labRequests, addLabRequest, markLabComplete, doctors } = useHospital();

  // Filter and tab state
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [showNewLabModal, setShowNewLabModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLab, setSelectedLab] = useState<LabRequest | null>(null);

  // Result Entry / Findings Modal State
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultFindings, setResultFindings] = useState('');

  // New Lab Entry Modal Form State
  const [newUhid, setNewUhid] = useState('');
  const [newPatientName, setNewPatientName] = useState('');
  const [newTestGroup, setNewTestGroup] = useState('Complete Blood Count (CBC)');
  const [newRefDoctor, setNewRefDoctor] = useState('DR.SRI JANANI,MD.,OG.,');
  const [newAmount, setNewAmount] = useState('450');

  // Filtered Lab Requests List
  const filteredLabRequests = useMemo(() => {
    return labRequests.filter(req => {
      // Tab filter
      if (activeTab === 'pending' && req.status !== 'Pending') return false;
      if (activeTab === 'completed' && req.status !== 'Completed') return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        return (
          req.patientName.toLowerCase().includes(query) ||
          req.uhid.toLowerCase().includes(query) ||
          req.tests.toLowerCase().includes(query) ||
          req.id.toLowerCase().includes(query) ||
          (req.refDoctor && req.refDoctor.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [labRequests, activeTab, searchQuery]);

  // Statistics calculation
  const totalOrders = labRequests.length;
  const pendingCount = labRequests.filter(l => l.status === 'Pending').length;
  const completedCount = labRequests.filter(l => l.status === 'Completed').length;
  const totalRevenue = labRequests.reduce((sum, l) => sum + (l.amount || 450), 0);

  // Handlers
  const handleOpenViewModal = (req: LabRequest) => {
    setSelectedLab(req);
    setShowViewModal(true);
  };

  const handleOpenResultModal = (req: LabRequest) => {
    setSelectedLab(req);
    setResultFindings(req.findings || '');
    setShowResultModal(true);
  };

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLab) {
      markLabComplete(selectedLab.id);
      if (resultFindings) {
        selectedLab.findings = resultFindings;
      }
      alert(`Lab Result completed successfully for ${selectedLab.patientName}!`);
    }
    setShowResultModal(false);
  };

  const handleCreateNewLab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) {
      alert('Please select or enter Patient Name');
      return;
    }

    const newReq: LabRequest = {
      id: `LAB-${Math.floor(3600 + Math.random() * 900)}`,
      patientName: newPatientName,
      uhid: newUhid || `UHID-${Math.floor(1000 + Math.random() * 9000)}`,
      tests: newTestGroup,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      amount: parseFloat(newAmount) || 450,
      refDoctor: newRefDoctor,
      sampleType: 'Whole Blood / EDTA'
    };

    addLabRequest(newReq);
    alert(`Lab Test Order created successfully for ${newPatientName}!`);
    setShowNewLabModal(false);

    // Reset Form
    setNewUhid('');
    setNewPatientName('');
  };

  const handleSelectPatientForNewLab = (p: any) => {
    setNewUhid(p.uhid);
    setNewPatientName(p.name);
  };

  return (
    <div className="lab-overview-container page-transition">

      {/* Header Banner */}
      <div className="lab-overview-header">
        <div>
          <h2>PATHOLOGY & LAB DIAGNOSTICS CENTER</h2>
          <p>Lab Orders, Pathology Sample Processing, Test Reports, and Diagnostic Billing</p>
        </div>
        <div className="lab-overview-header-actions">
          <button
            type="button"
            className="btn-overview-action"
            style={{ backgroundColor: '#0284c7', color: 'white' }}
            onClick={() => navigate('/lab/detailed')}
            title="Open Detailed Lab Counter & Master Workspace"
          >
            <TestTube2 size={16} /> Detailed Lab Workspace
          </button>

          <button
            type="button"
            className="btn-overview-action"
            onClick={() => navigate('/admin/expenses/add?dept=Lab&from=lab')}
            style={{ background: 'linear-gradient(135deg, #be185d 0%, #db2777 100%)', color: 'white' }}
          >
            <Plus size={16} /> Add Expense
          </button>

          <button
            type="button"
            className="btn-overview-back"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>

      {/* Overview Stats Bar */}
      <div className="lab-stats-grid">
        <div className="lab-stat-card">
          <div className="lab-stat-icon blue"><TestTube2 size={24} /></div>
          <div className="lab-stat-info">
            <h4>Total Lab Orders</h4>
            <div className="stat-value">{totalOrders}</div>
          </div>
        </div>

        <div className="lab-stat-card">
          <div className="lab-stat-icon orange"><Clock size={24} /></div>
          <div className="lab-stat-info">
            <h4>Pending Results</h4>
            <div className="stat-value">{pendingCount}</div>
          </div>
        </div>

        <div className="lab-stat-card">
          <div className="lab-stat-icon green"><CheckCircle size={24} /></div>
          <div className="lab-stat-info">
            <h4>Reports Ready</h4>
            <div className="stat-value">{completedCount}</div>
          </div>
        </div>

        <div className="lab-stat-card">
          <div className="lab-stat-icon purple"><Receipt size={24} /></div>
          <div className="lab-stat-info">
            <h4>Total Lab Revenue</h4>
            <div className="stat-value">₹{totalRevenue.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Lab Records List & Controls */}
      <div className="lab-main-card">
        <div className="lab-controls-bar">
          <div className="lab-tabs">
            <button
              className={`lab-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Lab Orders ({totalOrders})
            </button>
            <button
              className={`lab-tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending Results ({pendingCount})
            </button>
            <button
              className={`lab-tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Reports Ready ({completedCount})
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="lab-search-wrapper">
              <Search className="lab-search-icon" size={16} />
              <input
                type="text"
                placeholder="Search patient, UHID, or test name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn-new-lab-order"
              onClick={() => setShowNewLabModal(true)}
            >
              <Plus size={16} /> Quick Lab Entry
            </button>
          </div>
        </div>

        {/* Lab Requests Data Table */}
        <div className="lab-table-wrapper">
          <table className="lab-data-table">
            <thead>
              <tr>
                <th>Test ID</th>
                <th>Patient UHID</th>
                <th>Patient Name</th>
                <th>Tests Ordered</th>
                <th>Date</th>
                <th>Ref Doctor</th>
                <th>Amount (₹)</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLabRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                    No lab test records match the criteria.
                  </td>
                </tr>
              ) : (
                filteredLabRequests.map((row) => (
                  <tr key={row.id}>
                    <td style={{ fontWeight: 700, color: '#2563eb' }}>{row.id}</td>
                    <td><span className="badge-uhid">UHID: {row.uhid}</span></td>
                    <td style={{ fontWeight: 600 }}>{row.patientName}</td>
                    <td><span className="badge-test-name">{row.tests}</span></td>
                    <td>{row.date}</td>
                    <td>{row.refDoctor || 'DR.SRI JANANI,MD.,OG.,'}</td>
                    <td style={{ fontWeight: 600 }}>₹{(row.amount || 450).toLocaleString()}</td>
                    <td>
                      {row.status === 'Completed' ? (
                        <span className="lab-badge completed">
                          <CheckCircle size={14} /> Report Ready
                        </span>
                      ) : (
                        <span className="lab-badge pending">
                          <Clock size={14} /> Sample Pending
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {row.status === 'Pending' ? (
                          <button
                            className="tbl-btn tbl-btn-enter"
                            onClick={() => navigate('/lab/detailed?tab=test-result', { state: { testId: row.id, tab: 'test-result' } })}
                            title="Open Detailed Lab Workspace to Enter Test Results"
                          >
                            <ClipboardCheck size={14} /> Enter Result
                          </button>
                        ) : (
                          <button
                            className="tbl-btn tbl-btn-view"
                            onClick={() => handleOpenViewModal(row)}
                            title="View Lab Report"
                          >
                            <Eye size={14} /> View Report
                          </button>
                        )}
                        <button
                          className="tbl-btn tbl-btn-print"
                          onClick={() => handleOpenViewModal(row)}
                          title="Print Lab Slip"
                        >
                          <Printer size={14} /> Slip
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL 1: NEW QUICK LAB ENTRY MODAL --- */}
      {showNewLabModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3><Plus size={20} /> Create Quick Lab Order</h3>
              <button className="close-btn" onClick={() => setShowNewLabModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateNewLab}>
              <div className="modal-form-group">
                <label>Select Registered Patient (Optional)</label>
                <select
                  className="form-control"
                  value=""
                  onChange={(e) => {
                    const found = patients.find(p => p.name === e.target.value);
                    if (found) handleSelectPatientForNewLab(found);
                  }}
                >
                  <option value="">-- Choose Existing Patient --</option>
                  {patients.map((p, idx) => (
                    <option key={idx} value={p.name}>
                      {p.name} (UHID: {p.uhid} | Ph: {p.phone || 'N/A'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-grid-2">
                <div className="modal-form-group">
                  <label>Patient UHID <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={newUhid}
                    onChange={(e) => setNewUhid(e.target.value)}
                    placeholder="e.g. 3648"
                    required
                  />
                </div>

                <div className="modal-form-group">
                  <label>Patient Name <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    placeholder="Full patient name"
                    required
                  />
                </div>
              </div>

              <div className="modal-grid-2">
                <div className="modal-form-group">
                  <label>Test Package / Test Name</label>
                  <select
                    className="form-control"
                    value={newTestGroup}
                    onChange={(e) => {
                      setNewTestGroup(e.target.value);
                      if (e.target.value.includes('CBC')) setNewAmount('410');
                      else if (e.target.value.includes('Thyroid')) setNewAmount('475');
                      else if (e.target.value.includes('Lipid')) setNewAmount('735');
                      else if (e.target.value.includes('Creatinine')) setNewAmount('500');
                    }}
                  >
                    <option value="Complete Blood Count (CBC), Urine Routine">Complete Blood Count (CBC), Urine Routine</option>
                    <option value="Serum Creatinine, Blood Urea, FBS & PPBS">Serum Creatinine, Blood Urea, FBS & PPBS</option>
                    <option value="Thyroid Profile (T3, T4, TSH)">Thyroid Profile (T3, T4, TSH)</option>
                    <option value="Lipid Profile, Liver Function Test (LFT)">Lipid Profile, Liver Function Test (LFT)</option>
                    <option value="Hemoglobin (Hb%), Blood Grouping & Rh">Hemoglobin (Hb%), Blood Grouping & Rh</option>
                  </select>
                </div>

                <div className="modal-form-group">
                  <label>Test Charges (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-form-group">
                <label>Referring Doctor</label>
                <input
                  type="text"
                  className="form-control"
                  value={newRefDoctor}
                  onChange={(e) => setNewRefDoctor(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowNewLabModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit"><Plus size={16} /> Save Lab Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: ENTER RESULT MODAL --- */}
      {showResultModal && selectedLab && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3><ClipboardCheck size={20} /> Enter Pathology Test Results</h3>
              <button className="close-btn" onClick={() => setShowResultModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveResult}>
              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
                <div><strong>Patient:</strong> {selectedLab.patientName} (UHID: {selectedLab.uhid})</div>
                <div style={{ marginTop: '4px' }}><strong>Test Ordered:</strong> {selectedLab.tests}</div>
              </div>

              <div className="modal-form-group">
                <label>Test Findings / Result Values Summary</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={resultFindings}
                  onChange={(e) => setResultFindings(e.target.value)}
                  placeholder="Enter test result findings (e.g. Hemoglobin: 12.5 g/dL, WBC: 7800 /cumm...)"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowResultModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit"><CheckCircle size={16} /> Save & Complete Report</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: VIEW LAB REPORT & SLIP MODAL --- */}
      {showViewModal && selectedLab && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ width: '680px' }}>
            <div className="modal-header">
              <h3><FileText size={20} /> Diagnostic Lab Report</h3>
              <button className="close-btn" onClick={() => setShowViewModal(false)}><X size={20} /></button>
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', background: '#ffffff', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #2563eb', paddingBottom: '10px', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ margin: 0, color: '#1e293b', fontSize: '18px' }}>SHIRI JANANI HOSPITALS</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>Department of Pathology & Clinical Diagnostics</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: '#2563eb', fontSize: '15px' }}>{selectedLab.id}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Date: {selectedLab.date}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px', marginBottom: '16px', background: '#f8fafc', padding: '12px', borderRadius: '6px' }}>
                <div><strong>Patient Name:</strong> {selectedLab.patientName}</div>
                <div><strong>UHID:</strong> {selectedLab.uhid}</div>
                <div><strong>Ref Doctor:</strong> {selectedLab.refDoctor || 'DR.SRI JANANI,MD.,OG.,'}</div>
                <div><strong>Sample Type:</strong> {selectedLab.sampleType || 'Blood / Serum'}</div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#334155', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>TESTS PERFORMED</h5>
                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>{selectedLab.tests}</div>
              </div>

              <div>
                <h5 style={{ margin: '0 0 8px 0', color: '#334155', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>TEST FINDINGS & LABORATORY OBSERVATIONS</h5>
                <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#334155', background: '#fafafa', padding: '12px', borderRadius: '6px', whiteSpace: 'pre-line' }}>
                  {selectedLab.findings || 'Sample analyzed according to standard ISO laboratory protocols. Parameters within expected clinical reference ranges.'}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '12px', borderTop: '1px dashed #cbd5e1' }}>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Status: <strong style={{ color: '#16a34a' }}>{selectedLab.status}</strong></div>
                <div style={{ textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                  Verified By: Pathologist / Radiologist
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setShowViewModal(false)}>Close</button>
              <button type="button" className="btn-submit" onClick={() => window.print()}><Printer size={16} /> Print Official Lab Slip</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LabDashboardOverview;
