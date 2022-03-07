import React from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import WorkIcon from '@mui/icons-material/Work';

import { Entry, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry } from '../types';
import { useStateValue } from '../state';

const PatientEntry = ({ entry }: { entry: Entry }) => {
  const [{ diagnosis }] = useStateValue();

  return (
    <Box
      sx={{
        border: 2,
        borderRadius: 2,
        p: 2
      }}
    >
      <strong>{ entry.date }</strong> <EntrySymbol entry={entry} />
      <br />
      { entry.description }
      { entry.diagnosisCodes
        ? <List>
          { entry.diagnosisCodes.map((code, i, arr) => 
            <ListItem key={code} divider={i < arr.length - 1} >
              <ArrowRightIcon /><strong>{ code }: </strong> <Box sx={{ ml: 1 }}>{ diagnosis[code].name }</Box>
            </ListItem>
          )}
        </List>
        : <br />
      }
      <EntryDetails entry={entry} /><br />
      Diagnose by { entry.specialist }
    </Box>
  );
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntrySymbol = ({ entry }: {entry: Entry}) => {
  switch (entry.type) {
    case 'Hospital':
      return <LocalHospitalIcon />;
    case 'HealthCheck':
      return <MedicalServicesIcon />;
    case 'OccupationalHealthcare':
      return <WorkIcon />;
    default:
      return assertNever(entry);
  }
};

const EntryDetails: React.FC<{entry: Entry}> = ({ entry }) => {
  switch (entry.type) {
    case 'HealthCheck':
      return <HealthCheckDetails entry={entry} />;
    case 'Hospital':
      return <HospitalDetails entry={entry} />;
    case 'OccupationalHealthcare':
      return <OccupationalDetails entry={entry} />;
    default:
      return assertNever(entry);
  }
};

const HealthCheckDetails = ({ entry }: {entry: HealthCheckEntry}) => (
  <>
    Rating: { entry.healthCheckRating } <FavoriteIcon />
  </>
);

const HospitalDetails = ({ entry }: { entry: HospitalEntry } ) => (
  <>
    Discharged on { entry.discharge.date }.<br />
    Reason of discharge: { entry.discharge.criteria }
  </>
);

const OccupationalDetails = ({ entry }: { entry: OccupationalHealthcareEntry } ) => (
  <>
    Employer: { entry.employerName }
    {
      entry.sickLeave && <><br />
        <strong>Sick leave:</strong> { entry.sickLeave.startDate } - { entry.sickLeave.endDate }
      </>
    }
  </>
);

export default PatientEntry;