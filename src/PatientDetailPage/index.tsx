import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';

import { addPatient, useStateValue } from '../state';
import { Patient } from '../types';
import { apiBaseUrl } from '../constants';

const PatientDetailPage = () => {
  const [{ patients }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

  const patient = patients[id];

  React.useEffect(() => {
    const fetchPatient = async () => {
      if (patient) {
        return;
      }

      console.log('fetching patient...');
      const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
      dispatch(addPatient(data));
    };

    void fetchPatient();
  }, []);

  if (!patient) {
    return (
      <div>
        <h2>Patient not found</h2>
      </div>
    );
  }

  const getGenderIcon = () => {
    switch (patient.gender) {
      case 'male':
        return <MaleIcon />;
      case 'female':
        return <FemaleIcon />;
      case 'other':
        return <TransgenderIcon />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h2>
        { patient.name } { getGenderIcon() }
      </h2>
      <p>
        {
          patient.ssn && <>
            ssn: { patient.ssn }
            <br />
          </>
        }
        {
          patient.dateOfBirth && <>
            date of birth: { patient.dateOfBirth }
            <br />
          </>
        }
        occupation: { patient.occupation }
      </p>
    </div>
  );
};

export default PatientDetailPage;