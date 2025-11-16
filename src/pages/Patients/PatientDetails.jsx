import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { usePatientStore } from '../../store';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPatientById } = usePatientStore();
  const patient = getPatientById(id);

  if (!patient) {
    return <div>Patient not found</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Button variant="ghost" onClick={() => navigate('/patients')} icon={ArrowLeft} style={{ marginBottom: '1rem' }}>
        Back
      </Button>

      <Card title={`Patient: ${patient.name}`}>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div><strong>Age:</strong> {patient.age} years</div>
          <div><strong>Gender:</strong> {patient.gender}</div>
          <div><strong>Phone:</strong> {patient.phone}</div>
          <div><strong>Referred By:</strong> {patient.referredBy || 'N/A'}</div>
          <div><strong>Test Package:</strong> {patient.testPackage}</div>
          <div><strong>Created:</strong> {new Date(patient.createdAt).toLocaleString()}</div>
          <div><strong>Status:</strong> {patient.status}</div>
        </div>
      </Card>
    </div>
  );
};

export default PatientDetails;
