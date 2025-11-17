import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, AlertCircle, Save, X, Check } from 'lucide-react';
import { useAuthStore } from '../../store';
import { getTestsMaster, addTestToMaster, updateSettings } from '../../features/shared/dataService';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';
import './TestMaster.css';

const TestMaster = () => {
  const { role } = useAuthStore();
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'Biochemistry',
    unit: '',
    inputType: 'number',
    refLow: '',
    refHigh: '',
    refLowFemale: '',
    refHighFemale: '',
    refText: '',
    price: '',
    dropdownOptions: ''
  });

  // Load tests
  useEffect(() => {
    loadTests();
  }, []);

  // Filter tests when search term or category changes
  useEffect(() => {
    filterTests();
  }, [searchTerm, selectedCategory, tests]);

  const loadTests = () => {
    const allTests = getTestsMaster();
    setTests(allTests);
  };

  const filterTests = () => {
    let filtered = [...tests];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(term) ||
        t.code.toLowerCase().includes(term) ||
        t.category.toLowerCase().includes(term)
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }
    
    setFilteredTests(filtered);
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

  const categories = [...new Set(tests.map(t => t.category))];

  const handleAddTest = () => {
    if (!formData.name || !formData.code || !formData.category) {
      toast.error('Name, code, and category are required');
      return;
    }

    try {
      const testData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        refLow: formData.refLow || null,
        refHigh: formData.refHigh || null,
        refLowFemale: formData.refLowFemale || null,
        refHighFemale: formData.refHighFemale || null,
        dropdownOptions: formData.inputType === 'dropdown' 
          ? formData.dropdownOptions.split(',').map(o => o.trim())
          : null
      };

      if (editingTest) {
        // Update existing test
        const allTests = JSON.parse(localStorage.getItem('healit_tests_master') || '[]');
        const index = allTests.findIndex(t => t.testId === editingTest.testId);
        if (index !== -1) {
          allTests[index] = { ...allTests[index], ...testData };
          localStorage.setItem('healit_tests_master', JSON.stringify(allTests));
          toast.success('Test updated successfully');
        }
      } else {
        // Add new test
        addTestToMaster(testData);
        toast.success('Test added successfully');
      }

      resetForm();
      loadTests();
      setShowAddModal(false);
    } catch (error) {
      toast.error('Failed to save test');
      console.error(error);
    }
  };

  const handleEditTest = (test) => {
    setEditingTest(test);
    setFormData({
      name: test.name,
      code: test.code,
      category: test.category,
      unit: test.unit || '',
      inputType: test.inputType,
      refLow: test.refLow || '',
      refHigh: test.refHigh || '',
      refLowFemale: test.refLowFemale || '',
      refHighFemale: test.refHighFemale || '',
      refText: test.refText || '',
      price: test.price || '',
      dropdownOptions: test.dropdownOptions ? test.dropdownOptions.join(', ') : ''
    });
    setShowAddModal(true);
  };

  const handleDeleteTest = (testId) => {
    if (!confirm('Are you sure you want to deactivate this test?')) return;

    try {
      const allTests = JSON.parse(localStorage.getItem('healit_tests_master') || '[]');
      const index = allTests.findIndex(t => t.testId === testId);
      if (index !== -1) {
        allTests[index].active = false;
        localStorage.setItem('healit_tests_master', JSON.stringify(allTests));
        toast.success('Test deactivated successfully');
        loadTests();
      }
    } catch (error) {
      toast.error('Failed to deactivate test');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      category: 'Biochemistry',
      unit: '',
      inputType: 'number',
      refLow: '',
      refHigh: '',
      refLowFemale: '',
      refHighFemale: '',
      refText: '',
      price: '',
      dropdownOptions: ''
    });
    setEditingTest(null);
  };

  return (
    <div className="test-master-page">
      <div className="page-header">
        <div>
          <h1>Test Master</h1>
          <p className="subtitle">Manage all laboratory tests and reference ranges</p>
        </div>
        <Button icon={Plus} onClick={() => { resetForm(); setShowAddModal(true); }}>
          Add New Test
        </Button>
      </div>

      {/* Filters */}
      <Card className="filters-card">
        <div className="filters-row">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by name, code, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Tests Table */}
      <Card title={`Tests (${filteredTests.length})`}>
        <div className="table-container">
          <table className="tests-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Test Name</th>
                <th>Category</th>
                <th>Input Type</th>
                <th>Unit</th>
                <th>Reference Range</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.map(test => (
                <tr key={test.testId}>
                  <td><code>{test.code}</code></td>
                  <td><strong>{test.name}</strong></td>
                  <td><span className="category-badge">{test.category}</span></td>
                  <td>{test.inputType}</td>
                  <td>{test.unit || '-'}</td>
                  <td className="ref-range">
                    {test.inputType === 'number' && test.refLow && test.refHigh ? (
                      <div>
                        <div>M: {test.refLow} - {test.refHigh}</div>
                        {test.refLowFemale && test.refHighFemale && (
                          <div className="female-range">F: {test.refLowFemale} - {test.refHighFemale}</div>
                        )}
                      </div>
                    ) : (
                      <span>{test.refText || '-'}</span>
                    )}
                  </td>
                  <td>₹{test.price || 0}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon"
                        onClick={() => handleEditTest(test)}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDeleteTest(test.testId)}
                        title="Deactivate"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => { setShowAddModal(false); resetForm(); }}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingTest ? 'Edit Test' : 'Add New Test'}</h2>
              <button className="close-btn" onClick={() => { setShowAddModal(false); resetForm(); }}>
                <X size={20} />
              </button>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Test Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Hemoglobin"
                />
              </div>

              <div className="form-group">
                <label>Test Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., HGB"
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Biochemistry">Biochemistry</option>
                  <option value="Hematology">Hematology</option>
                  <option value="Serology">Serology</option>
                  <option value="Urine">Urine</option>
                  <option value="Thyroid">Thyroid</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Input Type *</label>
                <select
                  value={formData.inputType}
                  onChange={(e) => setFormData({ ...formData, inputType: e.target.value })}
                >
                  <option value="number">Number</option>
                  <option value="text">Text</option>
                  <option value="dropdown">Dropdown</option>
                </select>
              </div>

              <div className="form-group">
                <label>Unit</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="e.g., mg/dL, g/dL"
                />
              </div>

              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0"
                  min="0"
                />
              </div>

              {formData.inputType === 'number' && (
                <>
                  <div className="form-group">
                    <label>Ref Low (Male)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.refLow}
                      onChange={(e) => setFormData({ ...formData, refLow: e.target.value })}
                      placeholder="Lower limit"
                    />
                  </div>

                  <div className="form-group">
                    <label>Ref High (Male)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.refHigh}
                      onChange={(e) => setFormData({ ...formData, refHigh: e.target.value })}
                      placeholder="Upper limit"
                    />
                  </div>

                  <div className="form-group">
                    <label>Ref Low (Female)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.refLowFemale}
                      onChange={(e) => setFormData({ ...formData, refLowFemale: e.target.value })}
                      placeholder="Optional"
                    />
                  </div>

                  <div className="form-group">
                    <label>Ref High (Female)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.refHighFemale}
                      onChange={(e) => setFormData({ ...formData, refHighFemale: e.target.value })}
                      placeholder="Optional"
                    />
                  </div>
                </>
              )}

              {formData.inputType === 'dropdown' && (
                <div className="form-group full-width">
                  <label>Dropdown Options (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.dropdownOptions}
                    onChange={(e) => setFormData({ ...formData, dropdownOptions: e.target.value })}
                    placeholder="e.g., Negative, Trace, +, ++, +++"
                  />
                </div>
              )}

              <div className="form-group full-width">
                <label>Reference Text</label>
                <textarea
                  value={formData.refText}
                  onChange={(e) => setFormData({ ...formData, refText: e.target.value })}
                  placeholder="Optional reference text or notes"
                  rows="2"
                />
              </div>
            </div>

            <div className="modal-actions">
              <Button variant="ghost" onClick={() => { setShowAddModal(false); resetForm(); }}>
                Cancel
              </Button>
              <Button icon={Save} onClick={handleAddTest}>
                {editingTest ? 'Update Test' : 'Add Test'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestMaster;
