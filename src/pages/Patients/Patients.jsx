import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Calendar, Phone, User } from 'lucide-react';
import { getPatients, getProfileById } from '../../features/shared/dataService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import './Patients.css';

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Load patients from localStorage
  useEffect(() => {
    const patientsData = getPatients();
    setPatients(patientsData);
  }, []);

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );

  return (
    <div className="patients-page">
      <Card
        title="All Patients"
        actions={
          <Button onClick={() => navigate('/patients/add-patient')} icon={Plus}>
            Add New Patient
          </Button>
        }
      >
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {filteredPatients.length === 0 ? (
          <div className="empty-state">
            <User size={64} className="empty-icon" />
            <h3>No patients found</h3>
            <p>Add your first patient to get started</p>
            <Button onClick={() => navigate('/patients/add-patient')} icon={Plus} variant="primary">
              Add Patient
            </Button>
          </div>
        ) : (
          <div className="patients-table">
            <table>
              <thead>
                <tr>
                  <th><User size={16} /> Patient Name</th>
                  <th><Calendar size={16} /> Age/Gender</th>
                  <th><Phone size={16} /> Phone</th>
                  <th>Test Profile</th>
                  <th><Calendar size={16} /> Registered Date</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => {
                  const profile = patient.profileId ? getProfileById(patient.profileId) : null;
                  return (
                    <tr key={patient.patientId}>
                      <td className="patient-name">
                        <div className="name-cell">
                          <div className="avatar">{patient.name.charAt(0).toUpperCase()}</div>
                          <span>{patient.name}</span>
                        </div>
                      </td>
                      <td>{patient.age} yrs / {patient.gender}</td>
                      <td className="phone-cell">{patient.phone}</td>
                      <td className="profile-cell">
                        <span className="profile-tag">{profile?.name || 'N/A'}</span>
                      </td>
                      <td>{new Date(patient.createdAt).toLocaleDateString('en-IN', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      })}</td>
                      <td className="text-center">
                        <span className="status-badge">
                          Active
                        </span>
                      </td>
                      <td className="text-center">
                        <Button 
                          size="small" 
                          variant="outline"
                          icon={Eye}
                          onClick={() => navigate(`/patients/${patient.patientId}`)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Patients;
