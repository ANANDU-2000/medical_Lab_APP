import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, AlertCircle, Save, X, Package } from 'lucide-react';
import { useAuthStore } from '../../store';
import { getProfiles, getTestsMaster, addProfile } from '../../features/shared/dataService';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';
import './ProfileManager.css';

const ProfileManager = () => {
  const { role } = useAuthStore();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [allTests, setAllTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    packagePrice: '',
    testIds: []
  });

  const [testSearch, setTestSearch] = useState('');

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProfiles(getProfiles());
    setAllTests(getTestsMaster());
  };

  // Permission check
  if (role !== 'admin') {
    return (
      <div className="unauthorized-container">
        <AlertCircle size={64} color="#DC2626" />
        <h2>Access Denied</h2>
        <p>Admin access only. You do not have permission to view this page.</p>
        <Button variant="primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const filteredProfiles = profiles.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableTests = allTests.filter(test =>
    !formData.testIds.includes(test.testId) &&
    test.name.toLowerCase().includes(testSearch.toLowerCase())
  );

  const selectedTests = allTests.filter(test => formData.testIds.includes(test.testId));

  const handleAddProfile = () => {
    if (!formData.name || formData.testIds.length === 0) {
      toast.error('Profile name and at least one test are required');
      return;
    }

    try {
      const profileData = {
        ...formData,
        packagePrice: parseFloat(formData.packagePrice) || 0
      };

      if (editingProfile) {
        // Update existing profile
        const allProfiles = JSON.parse(localStorage.getItem('healit_profiles') || '[]');
        const index = allProfiles.findIndex(p => p.profileId === editingProfile.profileId);
        if (index !== -1) {
          allProfiles[index] = { ...allProfiles[index], ...profileData };
          localStorage.setItem('healit_profiles', JSON.stringify(allProfiles));
          toast.success('Profile updated successfully');
        }
      } else {
        // Add new profile
        addProfile(profileData);
        toast.success('Profile added successfully');
      }

      resetForm();
      loadData();
      setShowAddModal(false);
    } catch (error) {
      toast.error('Failed to save profile');
      console.error(error);
    }
  };

  const handleEditProfile = (profile) => {
    setEditingProfile(profile);
    setFormData({
      name: profile.name,
      description: profile.description || '',
      packagePrice: profile.packagePrice || '',
      testIds: [...profile.testIds]
    });
    setShowAddModal(true);
  };

  const handleDeleteProfile = (profileId) => {
    if (!confirm('Are you sure you want to deactivate this profile?')) return;

    try {
      const allProfiles = JSON.parse(localStorage.getItem('healit_profiles') || '[]');
      const index = allProfiles.findIndex(p => p.profileId === profileId);
      if (index !== -1) {
        allProfiles[index].active = false;
        localStorage.setItem('healit_profiles', JSON.stringify(allProfiles));
        toast.success('Profile deactivated successfully');
        loadData();
      }
    } catch (error) {
      toast.error('Failed to deactivate profile');
    }
  };

  const addTestToProfile = (testId) => {
    setFormData({
      ...formData,
      testIds: [...formData.testIds, testId]
    });
    setTestSearch('');
  };

  const removeTestFromProfile = (testId) => {
    setFormData({
      ...formData,
      testIds: formData.testIds.filter(id => id !== testId)
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      packagePrice: '',
      testIds: []
    });
    setEditingProfile(null);
    setTestSearch('');
  };

  const calculateTotalPrice = () => {
    return selectedTests.reduce((sum, test) => sum + (test.price || 0), 0);
  };

  return (
    <div className="profile-manager-page">
      <div className="page-header">
        <div>
          <h1>Profile Manager</h1>
          <p className="subtitle">Create and manage test profile packages</p>
        </div>
        <Button icon={Plus} onClick={() => { resetForm(); setShowAddModal(true); }}>
          Add New Profile
        </Button>
      </div>

      {/* Search */}
      <Card className="filters-card">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search profiles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Profiles Grid */}
      <div className="profiles-grid">
        {filteredProfiles.map(profile => (
          <Card key={profile.profileId} className="profile-card">
            <div className="profile-card-header">
              <div className="profile-icon">
                <Package size={24} />
              </div>
              <div className="profile-info">
                <h3>{profile.name}</h3>
                {profile.description && <p className="profile-desc">{profile.description}</p>}
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-label">Tests</span>
                <span className="stat-value">{profile.testIds.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Package Price</span>
                <span className="stat-value">₹{profile.packagePrice || 0}</span>
              </div>
            </div>

            <div className="profile-actions">
              <Button
                variant="outline"
                size="small"
                icon={Edit2}
                onClick={() => handleEditProfile(profile)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="small"
                icon={Trash2}
                onClick={() => handleDeleteProfile(profile.profileId)}
              >
                Deactivate
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => { setShowAddModal(false); resetForm(); }}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProfile ? 'Edit Profile' : 'Add New Profile'}</h2>
              <button className="close-btn" onClick={() => { setShowAddModal(false); resetForm(); }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-section">
                <h3>Profile Details</h3>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Profile Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Complete Blood Count (CBC)"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of this profile"
                      rows="2"
                    />
                  </div>

                  <div className="form-group">
                    <label>Package Price (₹)</label>
                    <input
                      type="number"
                      value={formData.packagePrice}
                      onChange={(e) => setFormData({ ...formData, packagePrice: e.target.value })}
                      placeholder="Total package price"
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Individual Tests Total</label>
                    <input
                      type="text"
                      value={`₹${calculateTotalPrice()}`}
                      disabled
                      className="readonly-input"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Tests in Profile ({selectedTests.length})</h3>
                
                {selectedTests.length > 0 ? (
                  <div className="selected-tests-list">
                    {selectedTests.map(test => (
                      <div key={test.testId} className="selected-test-item">
                        <div className="test-details">
                          <strong>{test.name}</strong>
                          <span className="test-code">{test.code}</span>
                          <span className="test-price">₹{test.price || 0}</span>
                        </div>
                        <button
                          className="remove-test-btn"
                          onClick={() => removeTestFromProfile(test.testId)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-state">No tests added yet. Search and add tests below.</p>
                )}
              </div>

              <div className="form-section">
                <h3>Add Tests</h3>
                <div className="search-box">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="Search tests to add..."
                    value={testSearch}
                    onChange={(e) => setTestSearch(e.target.value)}
                  />
                </div>

                {testSearch && (
                  <div className="available-tests-list">
                    {availableTests.length > 0 ? (
                      availableTests.slice(0, 10).map(test => (
                        <div
                          key={test.testId}
                          className="available-test-item"
                          onClick={() => addTestToProfile(test.testId)}
                        >
                          <div>
                            <strong>{test.name}</strong>
                            <span className="test-category">{test.category}</span>
                          </div>
                          <span className="test-price">₹{test.price || 0}</span>
                        </div>
                      ))
                    ) : (
                      <p className="no-results">No tests found</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <Button variant="ghost" onClick={() => { setShowAddModal(false); resetForm(); }}>
                Cancel
              </Button>
              <Button icon={Save} onClick={handleAddProfile}>
                {editingProfile ? 'Update Profile' : 'Create Profile'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileManager;
