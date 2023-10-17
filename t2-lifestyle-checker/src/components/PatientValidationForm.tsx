import React, { useState, FormEvent } from "react";
import axios from "axios";

const PatientValidationForm: React.FC = () => {
  const [nhsNumber, setNhsNumber] = useState("");
  const [surname, setSurname] = useState("");
  const [dob, setDob] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Resetting the error message at each new submission
    setErrorMessage("");

    // The NHS number is a 10-digit number. Strip out spaces, trim the string, and check this
    const cleaned_nhsNumber = nhsNumber.replace(/\s/g, "").trim()
    // Then use a quick bit of regex to ensure it's a 10-digit number
    const nhsNumberRegex = /^\d{10}$/;
    if (!nhsNumberRegex.test(cleaned_nhsNumber)) {
      setErrorMessage("Please enter a valid NHS number");
      return;
    }

    try {
      // Provide the API token in the header
      // TODO: potentially worth moving to an /api/ folder and an axiosConfig file
      const apiKey = process.env.REACT_APP_API_SUBSCRIPTION_KEY;
      axios.defaults.headers.common["Ocp-Apim-Subscription-Key"] = apiKey;

      const response = await axios.get(
        `https://al-tech-test-apim.azure-api.net/tech-test/t2/patients/${nhsNumber}`
      );

      // Check the response data matches the inputted data
      if (
        // Does the name match?
        response.data.name.split(",")[1].trim().toUpperCase() !==
          surname.toUpperCase() ||

        // Does the DOB match?
        new Date(response.data.born).toLocaleDateString() !==
          new Date(dob).toLocaleDateString()
      ) {
        setErrorMessage("Your details could not be found");
        
      } else if (calculateAge(response.data.born) < 16) {
        setErrorMessage("You are not eligible for this service");
      
      } else {
        // Proceed to the next part (Lifestyle Questions)
        // TODO: This will open the next component (redirect, or swap active component?)
      }
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setErrorMessage("Your details could not be found");

      } else {
        setErrorMessage("An unexpected error occurred");
      }
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
      {errorMessage && <p className="nhsuk-error-message">{errorMessage}</p>}
      <button type="submit" className="nhsuk-button">
        Submit
      </button>
    </form>
  );
};

export default PatientValidationForm;

// Utility function to calculate age from DOB
const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const ageDifference = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifference);

  return Math.abs(ageDate.getUTCFullYear() - 1970);
};
