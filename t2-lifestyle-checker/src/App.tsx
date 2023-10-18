import './App.css';
import React, { useState } from 'react';
import PatientValidationForm from './components/PatientValidationForm';
import PatientLifestyleQuestionnaire from './components/PatientLifestyleQuestionnaire';

function App() {
  const [isPatientValidated, setIsPatientValidated] = useState(false);
  const [patientAge, setPatientAge] = useState(0);

  const handlePatientValidationSuccess = (age: number) => {
    setIsPatientValidated(true);
    setPatientAge(age);
  };

  return (
    <div className="nhsuk-u-margin-5 dev-container">
      <h1 className="nhsuk-heading-xl">T2 - Lifestyle Checker</h1>
      <div className="nhsuk-width-container">
        {!isPatientValidated ? (
          <PatientValidationForm onValidationSuccess={handlePatientValidationSuccess} />
        ) : (
          <PatientLifestyleQuestionnaire patientAge={patientAge} />
        )}
      </div>
    </div>
  );
}

export default App;
