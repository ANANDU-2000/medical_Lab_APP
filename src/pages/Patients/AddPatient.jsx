import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePatientStore, useAuthStore } from '../../store';
import { TEST_PACKAGES } from '../../data/testMaster';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const AddPatient = () => {
  const navigate = useNavigate();
  const { addPatient } = usePatientStore();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    referredBy: '',
    testPackage: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newPatient = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      createdBy: user?.name || 'Staff',
      status: 'registered'
    };

    addPatient(newPatient);
    toast.success('Patient added successfully!');
    navigate('/patients');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Button variant="ghost" onClick={() => navigate('/patients')} icon={ArrowLeft} style={{ marginBottom: '1rem' }}>
        Back
      </Button>

      <Card title="Add New Patient">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e0e0e0' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e0e0e0' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e0e0e0' }}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Phone *</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e0e0e0' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Test Package *</label>
              <select
                name="testPackage"
                value={formData.testPackage}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e0e0e0' }}
              >
                <option value="">Select Package</option>
                {TEST_PACKAGES.map(pkg => (
                  <option key={pkg.id} value={pkg.id}>{pkg.name} - ₹{pkg.price}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Referred By</label>
              <input
                name="referredBy"
                value={formData.referredBy}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e0e0e0' }}
              />
            </div>

            <Button type="submit" icon={Save} fullWidth>
              Save Patient
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddPatient;
