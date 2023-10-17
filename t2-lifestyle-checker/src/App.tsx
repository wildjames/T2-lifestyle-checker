import React from 'react';
import PatientValidationForm from './components/PatientValidationForm';

function App() {
  return (
    <div className="App nhsuk-u-margin-5">
      <h1 className="nhsuk-heading-xl">T2 - Lifestyle Checker</h1>
      <div className="nhsuk-width-container">
        <PatientValidationForm />
      </div>
      {/* TODO: Add further components */}
    </div>
  );
}

export default App;
