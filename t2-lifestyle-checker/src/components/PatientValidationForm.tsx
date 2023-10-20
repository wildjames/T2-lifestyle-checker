import React, { useState, FormEvent } from "react";
import axios from "axios";
import { parseDate, calculateAge } from "./utils";

interface PatientValidationFormProps {
  onValidationSuccess: (patientAge: number) => void;
}

const PatientValidationForm: React.FC<PatientValidationFormProps> = (props) => {
  const [nhsNumber, setNhsNumber] = useState("");
  const [surname, setSurname] = useState("");
  const [dob, setDob] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // First check the user inputs are valid
    const validationErrors = validateInputs();
    if (validationErrors) {
      setErrorMessage(validationErrors);
      return;
    }

    try {
      // Fetch the patient data from the API, and ensure it matches the user inputs
      const response = await fetchPatientData();
      const isValidationSuccessful = comparePatientData(response);

      // And handle the result
      if (isValidationSuccessful) {
        setErrorMessage("Validation successful");
        props.onValidationSuccess(calculateAge(parseDate(response.data.born)));
      } else {
        setErrorMessage("Your details could not be found");
      }
    } catch (error: any) {
      handleApiErrors(error);
    }
  };

  const validateInputs = () => {
    // Check that the user has entered all the inputs
    if (!nhsNumber) {
      setErrorMessage("Please enter your NHS number");
      return;
    }
    if (!surname) {
      setErrorMessage("Please enter your surname");
      return;
    }
    if (!dob) {
      setErrorMessage("Please enter your date of birth");
      return;
    }

    // Quick check that the NHS number is valid, or can be made valid.
    const cleanedNhsNumber = nhsNumber.replace(/\s/g, "").trim();
    const nhsNumberRegex = /^\d{9}$/;
    if (!nhsNumberRegex.test(cleanedNhsNumber)) {
      return "Please enter a valid NHS number";
    }

    // Check that the user is at least 16 years old
    const userDob = new Date(dob);
    if (calculateAge(userDob) < 16) {
      return "You are not eligible for this service";
    }
  };

  const fetchPatientData = async () => {
    /// Fetch the patient data from the API. Returns the response object.
    const apiKey = process.env.REACT_APP_API_SUBSCRIPTION_KEY;
    if (!apiKey) {
      throw new Error("API subscription key not found");
    }
    axios.defaults.headers.common["Ocp-Apim-Subscription-Key"] = apiKey;

    const response = await axios.get(
      `https://al-tech-test-apim.azure-api.net/tech-test/t2/patients/${nhsNumber}`
    );
    return response;
  };

  const comparePatientData = (response: any) => {
    /// Compare the user inputs with the response from the API. 
    /// Also check that the patient is at least 16 years old.
    /// Returns true if the data is okay, false otherwise.
    const responseSurname = response.data.name
      .split(",")[0]
      .trim()
      .toUpperCase();
    const responseDob = parseDate(response.data.born);

    const userSurname = surname.trim().toUpperCase();
    const userDob = new Date(dob);

    return (
      responseSurname === userSurname &&
      responseDob.toLocaleDateString() === userDob.toLocaleDateString() &&
      calculateAge(responseDob) >= 16
    );
  };

  const handleApiErrors = (error: any) => {
    if (error.response && error.response.status === 404) {
      setErrorMessage("Your details could not be found");
    } else {
      setErrorMessage("An unexpected error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="nhsuk-form-group">
      <div className="nhsuk-form-group">
        <label htmlFor="nhsNumber" className="nhsuk-label">
          NHS Number:
        </label>
        <input
          type="text"
          id="nhsNumber"
          value={nhsNumber}
          onChange={(e) => setNhsNumber(e.target.value)}
          required
          className="nhsuk-input"
        />
      </div>
      <div className="nhsuk-form-group">
        <label htmlFor="surname" className="nhsuk-label">
          Surname:
        </label>
        <input
          type="text"
          id="surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          required
          className="nhsuk-input"
        />
      </div>
      <div className="nhsuk-form-group">
        <label htmlFor="dob" className="nhsuk-label">
          Date of Birth:
        </label>
        <input
          type="date"
          id="dob"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
          className="nhsuk-input"
        />
      </div>

      <div>
        <button type="submit" className="nhsuk-button">
          Submit
        </button>
      </div>

      <div>
        {errorMessage && <p className="nhsuk-error-message">{errorMessage}</p>}
      </div>
    </form>
  );
};

export default PatientValidationForm;
