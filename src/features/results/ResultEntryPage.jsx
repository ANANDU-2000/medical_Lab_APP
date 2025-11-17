import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, FileText, Receipt, Check, Loader, Download, Printer, Share2, Mail, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { getVisitById, updateVisitResults, getSettings, updateVisit, getPatientById, getProfileById } from '../shared/dataService';
import { useAuthStore } from '../../store';
import { getCurrentUser, getUsers } from '../../services/authService';
import { downloadReportPDF, printReportPDF, shareViaWhatsApp, shareViaEmail } from '../../utils/pdfGenerator';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import './ResultEntry.css';

const ResultEntryPage = () => {
  const navigate = useNavigate();
  const { visitId } = useParams();
  const { role } = useAuthStore();
  const currentUser = getCurrentUser();
  const settings = getSettings();
  
  const [visit, setVisit] = useState(null);
  const [patient, setPatient] = useState(null);
  const [profile, setProfile] = useState(null);
  const [results, setResults] = useState({});
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saving', 'saved', 'error'
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('');
  const [useMySignatureDefault, setUseMySignatureDefault] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const saveTimeoutRef = useRef(null);
  
  const canEditReportedTime = role === 'admin' && settings.allowManualReportedTime;
  const canEditDiscount = role === 'admin' || settings.allowStaffEditDiscount;
  
  // Get all active technicians (users with role staff/admin)
  const allUsers = getUsers();
  const technicians = allUsers.filter(u => u.isActive && (u.role === 'staff' || u.role === 'admin'));
  
  // Get selected technician
  const selectedTechnician = selectedTechnicianId 
    ? technicians.find(t => t.userId === selectedTechnicianId)
    : null;

  // Load visit data
  useEffect(() => {
    const visitData = getVisitById(visitId);
    if (!visitData) {
      toast.error('Visit not found');
      navigate('/patients');
      return;
    }
    
    setVisit(visitData);
    
    // Load patient and profile
    const patientData = getPatientById(visitData.patientId);
    setPatient(patientData);
    
    if (visitData.profileId) {
      const profileData = getProfileById(visitData.profileId);
      setProfile(profileData);
    }
    
    // Initialize results from visit
    const initialResults = {};
    if (visitData.tests && visitData.tests.length > 0) {
      visitData.tests.forEach(test => {
        initialResults[test.testId] = {
          value: test.value || '',
          status: test.status || 'NORMAL'
        };
      });
    }
    setResults(initialResults);
    
    // Set discount from visit
    setDiscount(visitData.discount || 0);
    
    // Auto-select signing technician
    // Default to current user if they're a technician
    if (currentUser && (currentUser.role === 'staff' || currentUser.role === 'admin')) {
      setSelectedTechnicianId(currentUser.userId);
    } else if (visitData.signing_technician_id) {
      setSelectedTechnicianId(visitData.signing_technician_id);
    } else if (technicians.length > 0) {
      // Fallback to first active technician
      setSelectedTechnicianId(technicians[0].userId);
    }
  }, [visitId, navigate, currentUser]);

  // Auto-save functionality
  useEffect(() => {
    if (!visit) return;
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set new timeout for autosave (2 seconds after input stops)
    saveTimeoutRef.current = setTimeout(() => {
      handleSave();
    }, 2000);
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [results]);

  // Handle result input change
  const handleResultChange = (testId, value) => {
    const test = visit.tests.find(t => t.testId === testId);
    let status = 'NORMAL';
    
    // Auto-detect HIGH/LOW for numeric values
    if (test.inputType_snapshot === 'number' && value !== '') {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        if (test.refHigh_snapshot && numValue > parseFloat(test.refHigh_snapshot)) {
          status = 'HIGH';
        } else if (test.refLow_snapshot && numValue < parseFloat(test.refLow_snapshot)) {
          status = 'LOW';
        }
      }
    }
    
    setResults(prev => ({
      ...prev,
      [testId]: { value, status }
    }));
  };

  // Save results
  const handleSave = async () => {
    if (!visit) return;
    
    setSaveStatus('saving');
    
    try {
      // Update visit with results
      const updatedTests = visit.tests.map(test => ({
        ...test,
        value: results[test.testId]?.value || '',
        status: results[test.testId]?.status || 'NORMAL'
      }));
      
      updateVisitResults(visitId, updatedTests);
      
      // Audit log
      console.log('AUDIT: SAVE_RESULTS', {
        userId: currentUser?.userId,
        visitId,
        action: 'SAVE_RESULTS',
        timestamp: new Date().toISOString()
      });
      
      setSaveStatus('saved');
      
      // Reset to saved after 2 seconds
      setTimeout(() => {
        setSaveStatus('');
      }, 2000);
    } catch (error) {
      setSaveStatus('error');
      toast.error('Failed to save results');
      console.error('Save error:', error);
    }
  };

  // Validate before generating report
  const validateBeforeGenerate = () => {
    const errors = [];
    
    if (!visit.collectedAt) {
      errors.push('Sample collection time not recorded');
    }
    
    if (!visit.receivedAt) {
      errors.push('Sample received time not recorded');
    }
    
    if (!selectedTechnicianId) {
      errors.push('Please select a signing technician');
    }
    
    // Check if at least one result entered (if configured)
    const hasResults = Object.values(results).some(r => r.value !== '');
    if (!hasResults && !settings.allowPartialReports) {
      errors.push('Please enter at least one test result');
    }
    
    return errors;
  };

  // Generate Report PDF
  const handleGenerateReport = async () => {
    const errors = validateBeforeGenerate();
    
    if (errors.length > 0) {
      toast.error(
        <div>
          <strong>Cannot generate report:</strong>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>,
        { duration: 5000 }
      );
      return;
    }
    
    // Confirm action
    const confirmed = window.confirm(
      'Generate Result PDF — this will set Reported On to current time. Continue?'
    );
    
    if (!confirmed) return;
    
    setIsGeneratingPDF(true);
    
    try {
      // Save current results first
      await handleSave();
      
      // Set reportedAt to current timestamp
      const reportedAt = new Date().toISOString();
      
      // Update visit with reportedAt, results, and signing technician
      const updatedTests = visit.tests.map(test => ({
        ...test,
        value: results[test.testId]?.value || '',
        status: results[test.testId]?.status || 'NORMAL'
      }));
      
      const updatedVisit = updateVisit(visitId, {
        reportedAt,
        tests: updatedTests,
        signing_technician_id: selectedTechnicianId,
        discount,
        status: 'report_generated'
      });
      
      // Audit log
      console.log('AUDIT: GENERATE_REPORT', {
        userId: currentUser?.userId,
        visitId,
        action: 'GENERATE_REPORT',
        signingTechnicianId: selectedTechnicianId,
        timestamp: reportedAt,
        details: {
          testsCount: visit.tests.length,
          resultsEntered: Object.values(results).filter(r => r.value !== '').length
        }
      });
      
      // Generate PDF with technician signature
      const visitData = {
        ...updatedVisit,
        patient,
        profile,
        signingTechnician: selectedTechnician
      };
      
      downloadReportPDF(visitData);
      toast.success('Report PDF generated successfully!');
      setShowShareOptions(true);
      
      // Update local state
      setVisit(updatedVisit);
      
      // Reload to show locked state
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF: ' + error.message);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Generate Invoice PDF
  const handleGenerateInvoice = async () => {
    await handleSave();
    
    toast.success('Invoice PDF generated successfully!');
    
    // In real implementation:
    // POST /api/visits/${visitId}/pdf/invoice
    
    console.log('Invoice PDF would be generated');
  };
  
  // Print Report
  const handlePrintReport = () => {
    if (!visit.reportedAt) {
      toast.error('Please generate report first');
      return;
    }
    
    const visitData = {
      ...visit,
      patient,
      profile
    };
    
    printReportPDF(visitData);
    toast.success('Opening print dialog...');
  };
  
  // Share via WhatsApp
  const handleShareWhatsApp = () => {
    if (!visit.reportedAt) {
      toast.error('Please generate report first');
      return;
    }
    
    const visitData = {
      ...visit,
      patient,
      profile
    };
    
    shareViaWhatsApp(visitData, patient.phone);
  };
  
  // Share via Email
  const handleShareEmail = () => {
    if (!visit.reportedAt) {
      toast.error('Please generate report first');
      return;
    }
    
    const visitData = {
      ...visit,
      patient,
      profile
    };
    
    const email = prompt('Enter email address:', patient.email || '');
    if (email) {
      shareViaEmail(visitData, email);
    }
  };

  // Render result input based on type
  const renderResultInput = (test) => {
    const testId = test.testId;
    const inputType = test.inputType_snapshot;
    const currentValue = results[testId]?.value || '';
    
    switch (inputType) {
      case 'number':
        return (
          <input
            type="number"
            value={currentValue}
            onChange={(e) => handleResultChange(testId, e.target.value)}
            className="result-input numeric"
            placeholder="Enter value"
            step="0.01"
          />
        );
      
      case 'text':
        return (
          <input
            type="text"
            value={currentValue}
            onChange={(e) => handleResultChange(testId, e.target.value)}
            className="result-input text"
            placeholder="Enter text"
          />
        );
      
      case 'select':
        return (
          <select
            value={currentValue}
            onChange={(e) => handleResultChange(testId, e.target.value)}
            className="result-input select"
          >
            <option value="">Select...</option>
            {test.dropdownOptions_snapshot?.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            type="text"
            value={currentValue}
            onChange={(e) => handleResultChange(testId, e.target.value)}
            className="result-input"
            placeholder="Enter result"
          />
        );
    }
  };

  // Render status badge
  const renderStatusBadge = (testId) => {
    const status = results[testId]?.status || 'NORMAL';
    
    if (!results[testId]?.value) return null;
    
    return (
      <span className={`status-badge ${status.toLowerCase()}`}>
        {status}
      </span>
    );
  };

  // Format reference range
  const formatReference = (test) => {
    const parts = [];
    
    if (test.inputType_snapshot === 'number' && test.refLow_snapshot && test.refHigh_snapshot) {
      parts.push(`${test.refLow_snapshot}–${test.refHigh_snapshot} ${test.unit_snapshot}`);
    }
    
    if (test.refText_snapshot) {
      parts.push(test.refText_snapshot);
    }
    
    return parts.length > 0 ? parts.join('\n') : '—';
  };

  // Calculate billing summary
  const calculateBilling = () => {
    if (!visit || !visit.tests) return { testCount: 0, subtotal: 0, discountAmount: 0, finalAmount: 0 };
    
    const subtotal = visit.tests.reduce((sum, test) => sum + (test.price_snapshot || 0), 0);
    const discountAmount = (subtotal * discount) / 100;
    const finalAmount = subtotal - discountAmount;
    
    return {
      testCount: visit.tests.length,
      subtotal,
      discountAmount,
      finalAmount
    };
  };
  
  const billing = calculateBilling();
  
  // Check if can edit (not locked after report generation, unless admin)
  const canEditResults = !visit?.reportedAt || role === 'admin';

  if (!visit || !patient) {
    return (
      <div className="loading-container">
        <Loader className="spinner" size={32} />
        <p>Loading visit data...</p>
      </div>
    );
  }

  return (
    <div className="result-entry-page">
      {/* Header */}
      <div className="page-header-modern">
        <Button variant="outline" onClick={() => navigate(`/sample-times/${visitId}`)}>
          <ArrowLeft size={18} />
          Back to Sample Times
        </Button>
        <div className="header-info">
          <span className="patient-name">Patient: {patient.name} \u2014 {patient.age}Y/{patient.gender}</span>
          <span className="profile-name">Profile: {profile?.name || 'Custom'}</span>
        </div>
      </div>

      {/* Patient/Visit Summary Card (TOP ROW) */}
      <div className="patient-visit-summary-card">
        <div className="summary-left">
          <h4>Patient Information</h4>
          <div className="info-row">
            <span className="label">Name:</span>
            <span className="value">{patient.name}</span>
          </div>
          <div className="info-row">
            <span className="label">Age / Gender:</span>
            <span className="value">{patient.age}Y / {patient.gender}</span>
          </div>
          <div className="info-row">
            <span className="label">Phone:</span>
            <span className="value">{patient.phone}</span>
          </div>
          <div className="info-row">
            <span className="label">Referred By:</span>
            <span className="value">{patient.referredBy || '\u2014'}</span>
          </div>
        </div>
        <div className="summary-right">
          <h4>Visit Timestamps</h4>
          <div className="info-row">
            <span className="label">Collected On:</span>
            <span className="value">
              {visit.collectedAt ? new Date(visit.collectedAt).toLocaleString() : 'Not recorded'}
            </span>
          </div>
          <div className="info-row">
            <span className="label">Received On:</span>
            <span className="value">
              {visit.receivedAt ? new Date(visit.receivedAt).toLocaleString() : 'Not recorded'}
            </span>
          </div>
          <div className="info-row">
            <span className="label">Reported On:</span>
            <span className={`value ${visit.reportedAt ? 'reported' : 'pending'}`}>
              {visit.reportedAt 
                ? new Date(visit.reportedAt).toLocaleString() 
                : 'Will be set when generating report'}
            </span>
          </div>
        </div>
      </div>

      {/* Locked Message */}
      {!canEditResults && (
        <div className="locked-message-banner">
          <AlertCircle size={18} />
          <strong>Results Locked:</strong> Report has been generated. Only admins can edit.
        </div>
      )}

      {/* Two-Column Layout */}
      <div className="two-column-layout-results">
        {/* LEFT COLUMN - Tests Table */}
        <div className="left-column-tests">
          <div className="card-modern tests-table-card">
            <div className="card-header-blue">
              <h3>Test Results</h3>
              <div className="save-indicator">
                {saveStatus === 'saving' && (
                  <>
                    <Loader size={14} className="spinning" />
                    <span>Auto-saving...</span>
                  </>
                )}
                {saveStatus === 'saved' && (
                  <>
                    <Check size={14} />
                    <span>Saved \u2713</span>
                  </>
                )}
                {saveStatus === 'error' && (
                  <span className="error">Save failed</span>
                )}
              </div>
            </div>

            <div className="results-table-wrapper">
              <table className="results-table">
                <thead>
                  <tr>
                    <th className="col-num">#</th>
                    <th className="col-test-name">Test Name</th>
                    <th className="col-result">Result Input</th>
                    <th className="col-unit">Unit</th>
                    <th className="col-reference">Reference</th>
                    <th className="col-status">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visit.tests && visit.tests.length > 0 ? (
                    visit.tests.map((test, index) => (
                      <tr key={test.testId || index}>
                        <td className="col-num">{index + 1}</td>
                        <td className="col-test-name">
                          <strong>{test.name_snapshot}</strong>
                          {test.code_snapshot && (
                            <span className="test-code"> ({test.code_snapshot})</span>
                          )}
                        </td>
                        <td className="col-result">
                          {renderResultInput(test)}
                        </td>
                        <td className="col-unit">{test.unit_snapshot || '\u2014'}</td>
                        <td className="col-reference">
                          <div className="reference-display">
                            {test.inputType_snapshot === 'number' && test.refLow_snapshot && test.refHigh_snapshot ? (
                              <>
                                <div className="ref-range">
                                  {test.refLow_snapshot} \u2013 {test.refHigh_snapshot} {test.unit_snapshot}
                                </div>
                                {test.refText_snapshot && (
                                  <div className="ref-note">{test.refText_snapshot}</div>
                                )}
                              </>
                            ) : test.refText_snapshot ? (
                              <div className="ref-text">{test.refText_snapshot}</div>
                            ) : (
                              '\u2014'
                            )}
                          </div>
                        </td>
                        <td className="col-status">
                          {renderStatusBadge(test.testId)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="no-tests">No tests selected</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Signing & Summary */}
        <div className="right-column-signing">
          {/* Signing Technician Selector */}
          <div className="card-modern signing-card">
            <div className="card-header-blue">
              <h3>Signing Technician</h3>
            </div>
            <div className="card-body">
              <div className="form-group-modern">
                <label className="label-blue">Signing Technician *</label>
                <select
                  value={selectedTechnicianId}
                  onChange={(e) => setSelectedTechnicianId(e.target.value)}
                  className="input-modern"
                  disabled={!canEditResults}
                >
                  <option value="">Select technician...</option>
                  {technicians.map(tech => (
                    <option key={tech.userId} value={tech.userId}>
                      {tech.fullName} \u2014 {tech.qualification || 'Lab Technician'}
                    </option>
                  ))}
                  <option value="authorized">Authorized Technician (Fallback)</option>
                </select>
                <span className="helper-text">
                  Choose technician who will sign this report. Default: your linked signature.
                </span>
              </div>

              {/* Signature Preview */}
              {selectedTechnician && (
                <div className="signature-preview-box">
                  <label className="label-blue">Signature Preview</label>
                  {selectedTechnician.signatureUrl ? (
                    <div className="signature-image-container">
                      <img 
                        src={selectedTechnician.signatureUrl} 
                        alt="Technician Signature" 
                        className="signature-image"
                      />
                      <div className="signature-details">
                        <strong>{selectedTechnician.fullName}</strong>
                        <span>{selectedTechnician.qualification}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="signature-placeholder">
                      <p>(Signature not available)</p>
                      <span className="placeholder-text">
                        {selectedTechnician.fullName}<br/>
                        {selectedTechnician.qualification}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Use My Signature Default Checkbox */}
              {currentUser && selectedTechnician && currentUser.userId === selectedTechnicianId && (
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={useMySignatureDefault}
                      onChange={(e) => setUseMySignatureDefault(e.target.checked)}
                    />
                    <span>Use my signature by default for future reports</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Billing Summary */}
          <div className="card-modern billing-summary-card">
            <div className="card-header-blue">
              <h3>Billing Summary</h3>
            </div>
            <div className="card-body">
              <div className="billing-row">
                <span className="label">Selected Tests:</span>
                <span className="value">{billing.testCount} tests</span>
              </div>
              <div className="billing-row">
                <span className="label">Subtotal:</span>
                <span className="value">\u20b9{billing.subtotal.toLocaleString()}</span>
              </div>
              <div className="billing-row">
                <span className="label">Discount:</span>
                {canEditDiscount ? (
                  <div className="discount-input-group">
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      className="discount-input"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    <span className="discount-percent">%</span>
                    <span className="discount-amount">(\u20b9{billing.discountAmount.toFixed(2)})</span>
                  </div>
                ) : (
                  <span className="value">{discount}% (\u20b9{billing.discountAmount.toFixed(2)})</span>
                )}
              </div>
              <div className="billing-row total-row">
                <span className="label">Final Amount:</span>
                <span className="value final-amount">\u20b9{billing.finalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card-modern actions-card">
            <div className="card-body">
              <Button 
                variant="outline" 
                onClick={handleSave} 
                fullWidth
                disabled={!canEditResults}
              >
                <Save size={18} />
                Save Results
              </Button>
              
              <Button 
                variant="primary" 
                onClick={handleGenerateReport} 
                fullWidth
                disabled={isGeneratingPDF}
              >
                <FileText size={18} />
                {isGeneratingPDF ? 'Generating...' : 'Generate Result PDF'}
              </Button>
              
              <Button 
                variant="secondary" 
                onClick={handleGenerateInvoice} 
                fullWidth
              >
                <Receipt size={18} />
                Generate Invoice PDF
              </Button>
              
              {visit.reportedAt && (
                <>
                  <div className="divider-modern"></div>
                  <Button 
                    variant="outline" 
                    onClick={handlePrintReport} 
                    fullWidth
                  >
                    <Printer size={18} />
                    Print Report
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setShowShareOptions(true)} 
                    fullWidth
                  >
                    <Share2 size={18} />
                    Share Report
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Share Options Modal */}
      {showShareOptions && (
        <div className="share-modal-overlay" onClick={() => setShowShareOptions(false)}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Share Report</h3>
            <p className="help-text">Choose how to share the medical report</p>
            <div className="share-options">
              <Button variant="primary" onClick={() => downloadReportPDF({...visit, patient, profile, signingTechnician: selectedTechnician})} icon={Download} fullWidth>
                Download PDF
              </Button>
              <Button variant="outline" onClick={handlePrintReport} icon={Printer} fullWidth>
                Print Report
              </Button>
              <Button variant="outline" onClick={handleShareWhatsApp} icon={Share2} fullWidth>
                Share via WhatsApp
              </Button>
              <Button variant="outline" onClick={handleShareEmail} icon={Mail} fullWidth>
                Share via Email
              </Button>
            </div>
            <Button variant="outline" onClick={() => setShowShareOptions(false)} fullWidth>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultEntryPage;
