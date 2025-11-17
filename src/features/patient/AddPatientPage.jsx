/**
 * AddPatientPage.jsx
 * 
 * ALL-IN-ONE Patient Registration & Test Selection Page
 * 
 * This is the first step in the streamlined patient workflow:
 * 1. AddPatientPage (this) - Register patient + Select profile + Edit tests
 * 2. SampleTimePage - Enter sample collection/received times
 * 3. ResultEntryPage - Enter test results
 * 4. PDF Generation - Generate report and invoice
 * 
 * FEATURES:
 * - Left column: Patient details form (Name, Age, Gender, Phone, Address, Referred By)
 * - Right column: Profile selection + Test list table
 * - Integrated test search (SearchAddTest component)
 * - Manual custom test creation modal
 * - Inline test editing (name, unit, price, references)
 * - Include/exclude/remove tests
 * - Auto-calculate subtotal and total with discount
 * - Create immutable test snapshots on visit creation
 * - Permission-based UI (Admin vs Staff)
 * 
 * WORKFLOW:
 * User fills patient info → Selects profile → Tests auto-load → User can search/add/edit tests
 * → Click "Continue" → Creates patient + visit with test snapshots → Navigate to Sample Time page
 * 
 * @version 2.0
 * @since 2025-11-17
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, UserCheck, Plus, X, AlertCircle, Search, Edit3 } from 'lucide-react';
import { addPatient, getProfiles, addProfile, getProfileById, createVisit, getProfileWithTests, searchTests, addTestToMaster, getSettings } from '../shared/dataService';
import { useAuthStore } from '../../store';
import { getCurrentUser } from '../../services/authService';
import Button from '../../components/ui/Button';
import SearchAddTest from '../../components/tests/SearchAddTest/SearchAddTest';
import toast from 'react-hot-toast';
import './AddPatient.css';

const AddPatientPage = () => {
  const navigate = useNavigate();
  const nameInputRef = useRef(null);
  const { role, user } = useAuthStore();
  const currentUser = getCurrentUser();
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    address: '',
    referredBy: ''
  });

  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profilePrice, setProfilePrice] = useState(0);
  const [customPrice, setCustomPrice] = useState('');
  const [profiles, setProfiles] = useState([]);
  
  // Tests from selected profile
  const [tests, setTests] = useState([]);
  const [discount, setDiscount] = useState(0);
  
  // Manual Add Test Modal
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
  
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '',
    description: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Permission check
  const settings = getSettings();
  const canEditPrice = role === 'admin' || settings.allowStaffEditPrice;
  const canCreateCustom = role === 'admin' || settings.allowManualTests;

  // Auto-focus on Full Name field
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);
  
  // Load profiles
  useEffect(() => {
    setProfiles(getProfiles());
  }, []);
  
  // Handle profile selection
  useEffect(() => {
    if (selectedProfileId) {
      const profile = getProfileById(selectedProfileId);
      setSelectedProfile(profile);
      setProfilePrice(profile?.packagePrice || 0);
      setCustomPrice('');
      
      // Load tests from profile with getProfileWithTests
      const profileWithTests = getProfileWithTests(selectedProfileId);
      if (profileWithTests && profileWithTests.tests) {
        const testsWithIncluded = profileWithTests.tests.map((test, idx) => ({
          ...test,
          id: `${test.testId}_${idx}`,
          included: true
        }));
        setTests(testsWithIncluded);
      }
    } else {
      setSelectedProfile(null);
      setProfilePrice(0);
      setCustomPrice('');
      setTests([]);
    }
  }, [selectedProfileId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!formData.age || formData.age < 0 || formData.age > 120) {
      newErrors.age = 'Age must be between 0 and 120';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }
    
    if (!selectedProfileId) {
      newErrors.profile = 'Select a test profile to continue';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateProfile = () => {
    if (!newProfile.name.trim()) {
      toast.error('Please enter profile name');
      return;
    }

    const profile = addProfile({
      name: newProfile.name,
      description: newProfile.description,
      testIds: [],
      packagePrice: null
    });

    setProfiles(getProfiles());
    setSelectedProfileId(profile.profileId);
    setShowCreateProfile(false);
    setNewProfile({ name: '', description: '' });
    toast.success('Profile created successfully!');
  };

  const handleToggleInclude = (id) => {
    setTests(tests.map(test =>
      test.id === id ? { ...test, included: !test.included } : test
    ));
  };
  
  const handleTestPriceChange = (id, newPrice) => {
    if (!canEditPrice) return;
    setTests(tests.map(test =>
      test.id === id ? { ...test, price: parseFloat(newPrice) || 0 } : test
    ));
  };
  
  const handleRemoveTest = (id) => {
    setTests(tests.filter(test => test.id !== id));
  };
  
  // Add test from search results
  const handleAddTestFromSearch = (test) => {
    // Check if test already added
    const exists = tests.find(t => t.testId === test.testId);
    if (exists) {
      toast.error('Test already added to the list');
      return;
    }

    const newTestEntry = {
      ...test,
      id: `${test.testId}_${Date.now()}`,
      included: true
    };
    setTests([...tests, newTestEntry]);
    toast.success(`${test.name} added successfully`);
  };
  
  // Manual add test
  const handleManualTestAdd = () => {
    if (!newTest.name.trim() || !newTest.unit.trim()) {
      toast.error('Test name and unit are required');
      return;
    }

    const customTest = {
      testId: `CUSTOM_${Date.now()}`,
      id: `CUSTOM_${Date.now()}`,
      name: newTest.name,
      code: newTest.code || '',
      unit: newTest.unit,
      inputType: newTest.inputType,
      refLow: newTest.refLow || null,
      refHigh: newTest.refHigh || null,
      refText: newTest.refText || '',
      price: parseFloat(newTest.price) || 0,
      category: newTest.category,
      active: true,
      included: true,
      isCustom: true
    };

    // If allowed, add to master test database
    if (canCreateCustom) {
      addTestToMaster(customTest);
      toast.success('Custom test added to master database');
    } else {
      toast.success('Custom test added for this patient only');
    }

    setTests([...tests, customTest]);
    setShowManualAdd(false);
    
    // Reset form
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
  
  // Handle test field edits
  const handleTestFieldChange = (id, field, value) => {
    setTests(tests.map(test =>
      test.id === id ? { ...test, [field]: value } : test
    ));
  };
  
  const calculateSubtotal = () => {
    return tests
      .filter(t => t.included)
      .reduce((sum, test) => sum + (parseFloat(test.price) || 0), 0);
  };
  
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = (subtotal * discount) / 100;
    return subtotal - discountAmount;
  };

  const getFinalPrice = () => {
    if (customPrice !== '') {
      return parseFloat(customPrice) || 0;
    }
    return profilePrice;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create patient
      const patientData = {
        ...formData,
        age: parseInt(formData.age),
        profileId: selectedProfileId,
        profileName: selectedProfile?.name,
        created_by_user_id: currentUser?.userId
      };
      
      const patient = addPatient(patientData);
      
      // Create visit with test snapshots
      const includedTests = tests.filter(t => t.included);
      
      // Create complete test snapshots
      const testSnapshots = includedTests.map(test => ({
        testId: test.testId,
        name_snapshot: test.name,
        code_snapshot: test.code || '',
        unit_snapshot: test.unit || '',
        inputType_snapshot: test.inputType || 'number',
        refLow_snapshot: test.refLow || null,
        refHigh_snapshot: test.refHigh || null,
        refText_snapshot: test.refText || '',
        price_snapshot: parseFloat(test.price) || 0,
        category_snapshot: test.category || '',
        isCustom: test.isCustom || test.testId?.startsWith('CUSTOM'),
        dropdownOptions_snapshot: test.dropdownOptions || null,
        included: true
      }));
      
      const visit = createVisit({
        patientId: patient.patientId,
        profileId: selectedProfileId,
        tests: testSnapshots,
        subtotal: calculateSubtotal(),
        discount: discount,
        finalAmount: calculateTotal(),
        created_by_user_id: currentUser?.userId
      });

      toast.success('Patient registered successfully!');
      
      // Navigate to Sample Times page (skip SelectEditTests since we did it here)
      navigate(`/sample-times/${visit.visitId}`);
    } catch (error) {
      console.error('Error creating patient:', error);
      toast.error('Failed to create patient. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-patient-page">
      {/* Page Header */}
      <div className="page-header-modern">
        <div>
          <h1>Add New Patient</h1>
          <p className="subtitle">Register patient and select test profile</p>
        </div>
      </div>

      {/* Two-Column Layout */}
      <form onSubmit={handleSubmit} className="two-column-layout">
        {/* LEFT CARD - Patient Details */}
        <div className="card-modern patient-details-card">
          <div className="card-header-blue">
            <User size={20} />
            <h3>Patient Details</h3>
          </div>
          
          <div className="card-body">
            {/* Full Name */}
            <div className="form-group-modern">
              <label className="label-blue">Full Name *</label>
              <input
                ref={nameInputRef}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter patient full name"
                className={`input-modern ${errors.name ? 'input-error' : ''}`}
                autoComplete="off"
              />
              {errors.name && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {errors.name}
                </span>
              )}
            </div>

            {/* Age & Gender Row */}
            <div className="form-row-modern">
              <div className="form-group-modern">
                <label className="label-blue">Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  className={`input-modern ${errors.age ? 'input-error' : ''}`}
                  min="0"
                  max="120"
                />
                {errors.age && (
                  <span className="error-message">
                    <AlertCircle size={14} />
                    {errors.age}
                  </span>
                )}
              </div>

              <div className="form-group-modern">
                <label className="label-blue">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="input-modern"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Phone Number */}
            <div className="form-group-modern">
              <label className="label-blue">Phone Number *</label>
              <div className="input-with-icon-modern">
                <Phone size={18} className="input-icon" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className={`input-modern with-icon ${errors.phone ? 'input-error' : ''}`}
                  maxLength="10"
                />
              </div>
              {errors.phone && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {errors.phone}
                </span>
              )}
            </div>

            {/* Address */}
            <div className="form-group-modern">
              <label className="label-blue">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full address (optional)"
                className="input-modern textarea-modern"
                rows="3"
              />
            </div>

            {/* Referred By */}
            <div className="form-group-modern">
              <label className="label-blue">Referred By</label>
              <div className="input-with-icon-modern">
                <UserCheck size={18} className="input-icon" />
                <input
                  type="text"
                  name="referredBy"
                  value={formData.referredBy}
                  onChange={handleChange}
                  placeholder="Doctor name (optional)"
                  className="input-modern with-icon"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CARD - Profile Selection & Tests */}
        <div className="card-modern profile-selection-card">
          <div className="card-header-blue">
            <h3>Test Profile & Tests</h3>
          </div>
          
          <div className="card-body">
            {/* Profile Dropdown */}
            <div className="form-group-modern">
              <label className="label-blue">Select Profile *</label>
              <select
                value={selectedProfileId}
                onChange={(e) => setSelectedProfileId(e.target.value)}
                className={`input-modern profile-select ${errors.profile ? 'input-error' : ''}`}
              >
                <option value="">Select Profile ▼</option>
                <option value="" disabled>────────────────</option>
                {profiles.map((profile) => (
                  <option key={profile.profileId} value={profile.profileId}>
                    {profile.name}
                  </option>
                ))}
              </select>
              {errors.profile && (
                <span className="error-message">
                  <AlertCircle size={14} />
                  {errors.profile}
                </span>
              )}
            </div>

            {/* Profile Badge */}
            {selectedProfile && (
              <div className="profile-badge-modern">
                <div className="badge-icon">✓</div>
                <div className="badge-content">
                  <h4>{selectedProfile.name}</h4>
                  {selectedProfile.description && (
                    <p>{selectedProfile.description}</p>
                  )}
                </div>
              </div>
            )}

            {/* Tests Table */}
            {tests.length > 0 && (
              <>
                <div className="tests-section-header">
                  <h4>Tests in Profile ({tests.filter(t => t.included).length} selected)</h4>
                  <div className="test-actions-row">
                    <SearchAddTest 
                      onAddTest={handleAddTestFromSearch}
                      onAddManual={() => setShowManualAdd(true)}
                    />
                  </div>
                </div>
                <div className="tests-table-container">
                  <table className="tests-table-modern">
                    <thead>
                      <tr>
                        <th width="40">Include</th>
                        <th>Test Name</th>
                        <th width="100">Unit</th>
                        <th width="120">Price (₹)</th>
                        <th width="60">Edit Ref</th>
                        <th width="60">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tests.map((test) => (
                        <tr key={test.id} className={!test.included ? 'test-excluded' : ''}>
                          <td>
                            <input
                              type="checkbox"
                              checked={test.included}
                              onChange={() => handleToggleInclude(test.id)}
                              className="checkbox-modern"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={test.name}
                              onChange={(e) => handleTestFieldChange(test.id, 'name', e.target.value)}
                              className="test-name-input"
                              disabled={!canEditPrice}
                            />
                            {test.refText && (
                              <div className="test-ref-text">{test.refText}</div>
                            )}
                          </td>
                          <td>
                            <input
                              type="text"
                              value={test.unit || ''}
                              onChange={(e) => handleTestFieldChange(test.id, 'unit', e.target.value)}
                              className="unit-input-small"
                              placeholder="Unit"
                              disabled={!canEditPrice}
                            />
                          </td>
                          <td>
                            {canEditPrice ? (
                              <input
                                type="number"
                                value={test.price || 0}
                                onChange={(e) => handleTestPriceChange(test.id, e.target.value)}
                                className="price-input-small"
                                min="0"
                                step="0.01"
                              />
                            ) : (
                              <span>₹{test.price || 0}</span>
                            )}
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => setShowManualAdd(true)}
                              className="btn-edit-ref"
                              title="Edit reference ranges"
                            >
                              <Edit3 size={14} />
                            </button>
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => handleRemoveTest(test.id)}
                              className="btn-remove-test"
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

                {/* Price Summary */}
                <div className="price-summary-modern">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span className="summary-value">₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Discount (%):</span>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      className="discount-input"
                      min="0"
                      max="100"
                      step="1"
                      disabled={!canEditPrice}
                    />
                  </div>
                  <div className="summary-row total-row">
                    <span><strong>Total Amount:</strong></span>
                    <span className="summary-total">₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}

            {/* Create New Profile Button */}
            {!selectedProfileId && (
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setShowCreateProfile(true)}
                className="create-profile-btn"
                icon={Plus}
              >
                Create New Profile
              </Button>
            )}
          </div>
        </div>
      </form>

      {/* Action Buttons */}
      <div className="form-actions-modern">
        <Button 
          type="button"
          variant="outline" 
          onClick={() => navigate('/dashboard')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          variant="primary" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Continue → Sample Time Page'}
        </Button>
      </div>

      {/* Create Profile Modal */}
      {showCreateProfile && (
        <div className="modal-overlay-modern" onClick={() => setShowCreateProfile(false)}>
          <div className="modal-content-modern" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-modern">
              <h3>Create New Profile</h3>
              <button 
                type="button"
                onClick={() => setShowCreateProfile(false)} 
                className="close-button-modern"
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body-modern">
              <div className="form-group-modern">
                <label className="label-blue">Profile Name *</label>
                <input
                  type="text"
                  value={newProfile.name}
                  onChange={(e) => setNewProfile({...newProfile, name: e.target.value})}
                  className="input-modern"
                  placeholder="e.g., Custom Health Package"
                  autoFocus
                />
              </div>
              <div className="form-group-modern">
                <label className="label-blue">Description</label>
                <textarea
                  value={newProfile.description}
                  onChange={(e) => setNewProfile({...newProfile, description: e.target.value})}
                  className="input-modern textarea-modern"
                  rows="3"
                  placeholder="Optional description of this profile"
                />
              </div>
              <p className="info-text-modern">
                💡 You can add tests to this profile in the next step.
              </p>
            </div>
            <div className="modal-footer-modern">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setShowCreateProfile(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button"
                variant="primary" 
                onClick={handleCreateProfile}
              >
                Create Profile
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Manual Add Test Modal */}
      {showManualAdd && (
        <div className="modal-overlay-modern" onClick={() => setShowManualAdd(false)}>
          <div className="modal-content-modern" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-modern">
              <h3>Add Custom Test</h3>
              <button 
                type="button"
                onClick={() => setShowManualAdd(false)} 
                className="close-button-modern"
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body-modern">
              <div className="form-group-modern">
                <label className="label-blue">Test Name *</label>
                <input
                  type="text"
                  value={newTest.name}
                  onChange={(e) => setNewTest({...newTest, name: e.target.value})}
                  className="input-modern"
                  placeholder="e.g., Custom Biomarker"
                  autoFocus
                />
              </div>
              
              <div className="form-row-modern">
                <div className="form-group-modern">
                  <label className="label-blue">Test Code</label>
                  <input
                    type="text"
                    value={newTest.code}
                    onChange={(e) => setNewTest({...newTest, code: e.target.value})}
                    className="input-modern"
                    placeholder="e.g., CBM"
                  />
                </div>
                <div className="form-group-modern">
                  <label className="label-blue">Unit *</label>
                  <input
                    type="text"
                    value={newTest.unit}
                    onChange={(e) => setNewTest({...newTest, unit: e.target.value})}
                    className="input-modern"
                    placeholder="e.g., mg/dL"
                  />
                </div>
              </div>
              
              <div className="form-group-modern">
                <label className="label-blue">Input Type</label>
                <select
                  value={newTest.inputType}
                  onChange={(e) => setNewTest({...newTest, inputType: e.target.value})}
                  className="input-modern"
                >
                  <option value="number">Number (Numeric Input)</option>
                  <option value="text">Text (Free Text)</option>
                  <option value="select">Select (Dropdown)</option>
                </select>
              </div>
              
              {newTest.inputType === 'number' && (
                <div className="form-row-modern">
                  <div className="form-group-modern">
                    <label className="label-blue">Reference Low</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newTest.refLow}
                      onChange={(e) => setNewTest({...newTest, refLow: e.target.value})}
                      className="input-modern"
                      placeholder="Min value"
                    />
                  </div>
                  <div className="form-group-modern">
                    <label className="label-blue">Reference High</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newTest.refHigh}
                      onChange={(e) => setNewTest({...newTest, refHigh: e.target.value})}
                      className="input-modern"
                      placeholder="Max value"
                    />
                  </div>
                </div>
              )}
              
              <div className="form-group-modern">
                <label className="label-blue">Reference Text</label>
                <textarea
                  value={newTest.refText}
                  onChange={(e) => setNewTest({...newTest, refText: e.target.value})}
                  className="input-modern textarea-modern"
                  rows="2"
                  placeholder="e.g., Normal range description"
                />
              </div>
              
              <div className="form-group-modern">
                <label className="label-blue">Price (₹)</label>
                <input
                  type="number"
                  value={newTest.price}
                  onChange={(e) => setNewTest({...newTest, price: e.target.value})}
                  className="input-modern"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div className="form-group-modern">
                <label className="label-blue">Category</label>
                <input
                  type="text"
                  value={newTest.category}
                  onChange={(e) => setNewTest({...newTest, category: e.target.value})}
                  className="input-modern"
                  placeholder="e.g., Biochemistry, Hematology"
                />
              </div>
              
              <p className="info-text-modern">
                💡 {canCreateCustom ? 'This test will be added to the master database and available for future patients.' : 'This custom test will only be available for this patient.'}
              </p>
            </div>
            <div className="modal-footer-modern">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setShowManualAdd(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button"
                variant="primary" 
                onClick={handleManualTestAdd}
              >
                <Plus size={18} />
                Add Test
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPatientPage;
