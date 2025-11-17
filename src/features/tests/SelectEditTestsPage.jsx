/**
 * SelectEditTestsPage.jsx
 * 
 * ⚠️ DEPRECATED - This component is no longer used in the main workflow
 * 
 * The test selection and editing functionality has been integrated directly into
 * the AddPatientPage.jsx component. The current workflow is:
 * 
 * 1. AddPatientPage - Register patient + Select profile + Edit tests (all in one)
 * 2. SampleTimePage - Enter sample collection/received times
 * 3. ResultEntryPage - Enter test results
 * 4. PDF Generation - Generate report and invoice
 * 
 * This file is kept for reference only. It may be removed in a future update.
 * 
 * @deprecated since v2.0 - Use AddPatientPage instead
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Plus, X, Save, Search, Trash2, RotateCcw } from 'lucide-react';
import { 
  getPatientById, 
  getProfileById, 
  getProfileWithTests,
  createVisit,
  searchTests,
  addTestToMaster,
  getSettings 
} from '../shared/dataService';
import { useAuthStore } from '../../store';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import './SelectEditTests.css';

const SelectEditTestsPage = () => {
  const { patientId } = useParams();
  const [searchParams] = useSearchParams();
  const profileId = searchParams.get('profileId');
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [profile, setProfile] = useState(null);
  const [tests, setTests] = useState([]);
  const [originalTests, setOriginalTests] = useState([]);
  const [usePackagePrice, setUsePackagePrice] = useState(true);
  const [discount, setDiscount] = useState(0);
  const [customTotal, setCustomTotal] = useState(null); // Allow manual total override
  
  // Search & Add
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  
  // Manual Add
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [newTest, setNewTest] = useState({
    name: '',
    code: '',
    unit: '',
    inputType: 'number',
    refLow: '',
    refHigh: '',
    refText: '',
    price: '',
    category: 'Custom'
  });

  const settings = getSettings();
  const { user, role } = useAuthStore();
  
  // Permission checks
  const canEditPrice = role === 'admin' || settings.allowStaffEditPrice;
  const canCreateCustom = role === 'admin' || settings.allowStaffInlineCreate;

  // Load data on mount
  useEffect(() => {
    const patientData = getPatientById(patientId);
    if (!patientData) {
      toast.error('Patient not found');
      navigate('/patients');
      return;
    }
    setPatient(patientData);

    const profileData = getProfileWithTests(profileId);
    if (!profileData) {
      toast.error('Profile not found');
      return;
    }
    setProfile(profileData);

    // Initialize tests from profile
    const initialTests = profileData.tests.map((test, idx) => ({
      ...test,
      id: `${test.testId}_${idx}`,
      included: true
    }));
    setTests(initialTests);
    setOriginalTests(initialTests);
  }, [patientId, profileId, navigate]);

  // Search tests with debounce
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      const results = await searchTests(searchTerm);
      setSearchResults(results);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Add test from search results
  const handleAddFromSearch = (test) => {
    // Check if test already added
    const exists = tests.find(t => t.testId === test.testId);
    if (exists) {
      toast.error('Test already added');
      return;
    }

    const newTestEntry = {
      ...test,
      id: `${test.testId}_${Date.now()}`,
      included: true
    };
    setTests([...tests, newTestEntry]);
    setSearchTerm('');
    setSearchResults([]);
    setShowSearch(false);
    toast.success(`${test.name} added`);
  };

  // Manual add test
  const handleManualAdd = () => {
    if (!newTest.name || !newTest.unit) {
      toast.error('Please fill test name and unit');
      return;
    }

    const customTest = {
      ...newTest,
      testId: `CUSTOM_${Date.now()}`,
      id: `CUSTOM_${Date.now()}`,
      active: true,
      included: true,
      price: parseFloat(newTest.price) || 0
    };

    // If staff inline create is allowed, add to master
    if (canCreateCustom) {
      addTestToMaster(customTest);
      toast.success('Test added to master and this patient');
    } else {
      toast.success('Custom test added for this patient only');
    }

    setTests([...tests, customTest]);
    setShowManualAdd(false);
    setNewTest({
      name: '',
      code: '',
      unit: '',
      inputType: 'number',
      refLow: '',
      refHigh: '',
      refText: '',
      price: '',
      category: 'Custom'
    });
  };

  // Update test field
  const handleTestChange = (id, field, value) => {
    setTests(tests.map(test => 
      test.id === id ? { ...test, [field]: value } : test
    ));
  };

  // Toggle test inclusion
  const handleToggleInclude = (id) => {
    setTests(tests.map(test =>
      test.id === id ? { ...test, included: !test.included } : test
    ));
  };

  // Remove test
  const handleRemoveTest = (id) => {
    setTests(tests.filter(test => test.id !== id));
  };

  // Reset to profile template
  const handleReset = () => {
    setTests([...originalTests]);
    toast.success('Reset to original profile');
  };

  // Calculate total
  const calculateSubtotal = () => {
    if (usePackagePrice && profile?.packagePrice) {
      return profile.packagePrice;
    }
    return tests
      .filter(t => t.included)
      .reduce((sum, test) => sum + (parseFloat(test.price) || 0), 0);
  };

  const calculateTotal = () => {
    // If custom total is set, use it
    if (customTotal !== null && customTotal !== '') {
      return parseFloat(customTotal) || 0;
    }
    const subtotal = calculateSubtotal();
    return Math.max(0, subtotal - discount);
  };

  // Save and continue
  const handleContinue = () => {
    const includedTests = tests.filter(t => t.included);
    if (includedTests.length === 0) {
      toast.error('Please include at least one test');
      return;
    }

    // Create snapshot
    const testSnapshot = includedTests.map(test => ({
      testId: test.testId,
      name_snapshot: test.name,
      code_snapshot: test.code || '',
      unit_snapshot: test.unit,
      inputType_snapshot: test.inputType,
      refLow_snapshot: test.refLow || null,
      refHigh_snapshot: test.refHigh || null,
      refText_snapshot: test.refText || '',
      price_snapshot: parseFloat(test.price) || 0,
      category_snapshot: test.category || '',
      isCustom: test.testId?.startsWith('CUSTOM'),
      dropdownOptions_snapshot: test.dropdownOptions || null
    }));

    // Create visit
    const visit = createVisit({
      patientId,
      profileId,
      selectedTests: testSnapshot,
      usePackagePrice,
      packagePrice: profile?.packagePrice || null,
      totalAmount: calculateTotal()
    });

    toast.success('Tests saved successfully!');
    navigate(`/sample-times/${visit.visitId}`);
  };

  if (!patient || !profile) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="select-edit-tests-page">
      {/* Header */}
      <div className="page-header">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Back
        </Button>
        <h1>Select & Edit Tests</h1>
      </div>

      <div className="two-column-layout">
        {/* LEFT: Patient Summary Card */}
        <div className="left-column">
          <div className="patient-card">
            <h3>Patient Summary</h3>
            <div className="patient-info">
              <div className="info-row">
                <span className="label">Name:</span>
                <span className="value">{patient.name}</span>
              </div>
              <div className="info-row">
                <span className="label">Age/Gender:</span>
                <span className="value">{patient.age} / {patient.gender}</span>
              </div>
              <div className="info-row">
                <span className="label">Phone:</span>
                <span className="value">{patient.phone}</span>
              </div>
              {patient.referredBy && (
                <div className="info-row">
                  <span className="label">Referred By:</span>
                  <span className="value">{patient.referredBy}</span>
                </div>
              )}
              <div className="info-row profile-badge-row">
                <span className="label">Profile Selected:</span>
                <span className="profile-badge">{profile.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Test Selection Panel */}
        <div className="right-column">
          {/* STEP 1: Selected Profile */}
          <div className="selected-profile-bar">
            <div className="profile-info">
              <span className="label">Selected Profile:</span>
              <span className="profile-badge-blue">{profile.name}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate(`/patients/add-patient`)}>
              Change Profile
            </Button>
          </div>

          {/* STEP 2: Search & Add Test */}
          <div className="search-section">
            <div className="search-row">
              <div className="search-box-wrapper">
                <Search className="search-icon" size={18} />
                <input
                  type="text"
                  placeholder="🔍 Type to search test..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowSearch(true)}
                  className="search-input"
                />
              </div>
              <Button variant="primary" size="sm" onClick={() => setShowManualAdd(true)}>
                <Plus size={16} />
                Add New Test Manual
              </Button>
            </div>
            
            {/* Search Results Dropdown */}
            {showSearch && searchResults.length > 0 && (
              <div className="search-results-dropdown">
                {searchResults.map((test) => (
                  <div
                    key={test.testId}
                    className="search-result-item"
                    onClick={() => handleAddFromSearch(test)}
                  >
                    <div className="result-left">
                      <strong>{test.name}</strong>
                      <span className="result-meta">{test.unit} • {test.refText || 'No reference'}</span>
                    </div>
                    <div className="result-right">
                      <span className="result-price">₹{test.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* STEP 3: Test Table */}
          <div className="toolbar">
            <div className="toolbar-left">
              <h3>Test List ({tests.filter(t => t.included).length} included)</h3>
            </div>
            <div className="toolbar-right">
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw size={16} />
                Reset to Profile
              </Button>
            </div>
          </div>



          {/* Tests Table */}
          <div className="tests-table-container">
            <table className="tests-table">
              <thead>
                <tr>
                  <th style={{width: '40px'}}>✓</th>
                  <th>Test Name</th>
                  <th>Unit</th>
                  <th>Input Type</th>
                  <th>Reference</th>
                  <th style={{width: '100px'}}>Price (₹)</th>
                  <th style={{width: '50px'}}></th>
                </tr>
              </thead>
              <tbody>
                {tests.map((test) => (
                  <tr key={test.id} className={test.included ? '' : 'excluded'}>
                    <td>
                      <input
                        type="checkbox"
                        checked={test.included}
                        onChange={() => handleToggleInclude(test.id)}
                        className="checkbox"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={test.name}
                        onChange={(e) => handleTestChange(test.id, 'name', e.target.value)}
                        className="table-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={test.unit}
                        onChange={(e) => handleTestChange(test.id, 'unit', e.target.value)}
                        className="table-input"
                        style={{width: '80px'}}
                      />
                    </td>
                    <td>
                      <select
                        value={test.inputType}
                        onChange={(e) => handleTestChange(test.id, 'inputType', e.target.value)}
                        className="table-input"
                      >
                        <option value="number">Number</option>
                        <option value="text">Text</option>
                        <option value="select">Select</option>
                      </select>
                    </td>
                    <td>
                      <div className="ref-cell">
                        {test.inputType === 'number' && test.refLow && test.refHigh && (
                          <div className="ref-range-display">
                            {test.refLow}–{test.refHigh} {test.unit}
                          </div>
                        )}
                        {test.refText && (
                          <div className="ref-text-display">{test.refText}</div>
                        )}
                        {/* Edit mode */}
                        <details className="ref-edit">
                          <summary>Edit Reference</summary>
                          <div className="ref-edit-content">
                            {test.inputType === 'number' && (
                              <div className="ref-range">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={test.refLow || ''}
                                  onChange={(e) => handleTestChange(test.id, 'refLow', e.target.value)}
                                  className="table-input small"
                                  placeholder="Low"
                                />
                                <span>-</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={test.refHigh || ''}
                                  onChange={(e) => handleTestChange(test.id, 'refHigh', e.target.value)}
                                  className="table-input small"
                                  placeholder="High"
                                />
                              </div>
                            )}
                            <input
                              type="text"
                              value={test.refText || ''}
                              onChange={(e) => handleTestChange(test.id, 'refText', e.target.value)}
                              className="table-input"
                              placeholder="Reference note"
                            />
                          </div>
                        </details>
                      </div>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={test.price}
                        onChange={(e) => handleTestChange(test.id, 'price', e.target.value)}
                        className="table-input"
                        disabled={!canEditPrice}
                        title={!canEditPrice ? 'Price editing disabled for staff' : ''}
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => handleRemoveTest(test.id)}
                        className="icon-button danger"
                        title="Remove test"
                      >
                        <X size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Package Price Toggle */}
          {profile.packagePrice && (
            <div className="package-price-section">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={usePackagePrice}
                  onChange={(e) => setUsePackagePrice(e.target.checked)}
                />
                Use Package Price (₹{profile.packagePrice})
              </label>
            </div>
          )}

          {/* Price Summary Card */}
          <div className="price-summary-card">
            <h4>Price Summary</h4>
            <div className="summary-row">
              <span>Selected Tests:</span>
              <span>{tests.filter(t => t.included).length} tests</span>
            </div>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{calculateSubtotal()}</span>
            </div>
            <div className="summary-row">
              <span>Discount:</span>
              <input
                type="number"
                value={discount}
                onChange={(e) => {
                  setDiscount(parseFloat(e.target.value) || 0);
                  setCustomTotal(null); // Reset custom total
                }}
                className="discount-input"
                placeholder="0"
                min="0"
              />
            </div>
            <div className="summary-row total">
              <span>Final Amount:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <strong>₹</strong>
                <input
                  type="number"
                  value={customTotal !== null ? customTotal : calculateTotal()}
                  onChange={(e) => setCustomTotal(e.target.value)}
                  className="discount-input"
                  placeholder={calculateTotal().toString()}
                  min="0"
                  step="0.01"
                  style={{ fontWeight: 'bold', color: 'var(--primary)' }}
                  title="Click to edit total amount"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleContinue}>
              <Save size={18} />
              Save & Continue
            </Button>
          </div>
        </div>
      </div>

      {/* Manual Add Modal */}
      {showManualAdd && (
        <div className="modal-overlay" onClick={() => setShowManualAdd(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Test</h3>
              <button onClick={() => setShowManualAdd(false)} className="close-button">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Test Name *</label>
                <input
                  type="text"
                  value={newTest.name}
                  onChange={(e) => setNewTest({...newTest, name: e.target.value})}
                  className="form-input"
                  placeholder="e.g., Custom Biomarker"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Code</label>
                  <input
                    type="text"
                    value={newTest.code}
                    onChange={(e) => setNewTest({...newTest, code: e.target.value})}
                    className="form-input"
                    placeholder="e.g., CBM"
                  />
                </div>
                <div className="form-group">
                  <label>Unit *</label>
                  <input
                    type="text"
                    value={newTest.unit}
                    onChange={(e) => setNewTest({...newTest, unit: e.target.value})}
                    className="form-input"
                    placeholder="e.g., mg/dL"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Input Type</label>
                <select
                  value={newTest.inputType}
                  onChange={(e) => setNewTest({...newTest, inputType: e.target.value})}
                  className="form-input"
                >
                  <option value="number">Number</option>
                  <option value="text">Text</option>
                  <option value="select">Select/Dropdown</option>
                </select>
              </div>
              {newTest.inputType === 'number' && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Ref Low</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newTest.refLow}
                      onChange={(e) => setNewTest({...newTest, refLow: e.target.value})}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Ref High</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newTest.refHigh}
                      onChange={(e) => setNewTest({...newTest, refHigh: e.target.value})}
                      className="form-input"
                    />
                  </div>
                </div>
              )}
              <div className="form-group">
                <label>Reference Text</label>
                <textarea
                  value={newTest.refText}
                  onChange={(e) => setNewTest({...newTest, refText: e.target.value})}
                  className="form-input"
                  rows="2"
                  placeholder="e.g., Normal range description"
                />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  value={newTest.price}
                  onChange={(e) => setNewTest({...newTest, price: e.target.value})}
                  className="form-input"
                />
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="outline" onClick={() => setShowManualAdd(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleManualAdd}>
                Add Test
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectEditTestsPage;
