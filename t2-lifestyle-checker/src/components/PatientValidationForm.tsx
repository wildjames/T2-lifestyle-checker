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
    // Resetting the error message at each new submission
    setErrorMessage("");

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

    // The NHS number is a 9-digit number. Strip out spaces, trim the string, and check this
    const cleaned_nhsNumber = nhsNumber.replace(/\s/g, "").trim();
    // Then use a quick bit of regex to ensure it's a 9-digit number
    const nhsNumberRegex = /^\d{9}$/;
    if (!nhsNumberRegex.test(cleaned_nhsNumber)) {
      setErrorMessage("Please enter a valid NHS number");
      return;
    }

    try {
      // Provide the API token in the header
      // TODO: potentially worth moving to an /api/ folder and an axiosConfig file
      const apiKey = process.env.REACT_APP_API_SUBSCRIPTION_KEY;
      if (!apiKey) {
        throw new Error("API subscription key not found");
      }
      axios.defaults.headers.common["Ocp-Apim-Subscription-Key"] = apiKey;

      const response = await axios.get(
        `https://al-tech-test-apim.azure-api.net/tech-test/t2/patients/${nhsNumber}`
      );

      const response_surname = response.data.name
        .split(",")[0]
        .trim()
        .toUpperCase();
      // Since dates in less civilised countries are yyyy-mm-dd, we need to parse the date from UK format.
      const response_dob = parseDate(response.data.born);

      const user_surname = surname.trim().toUpperCase();
      const user_dob = new Date(dob);

      const user_age = calculateAge(response_dob);
      console.log("The user reports being " + user_age + " years old");

      // Check the response data matches the inputted data
      if (
        // Does the name match?
        response_surname !== user_surname ||
        // Does the DOB match?
        response_dob.toLocaleDateString() !== user_dob.toLocaleDateString()
      ) {
        setErrorMessage("Your details could not be found");
        if (response_surname !== user_surname) {
          console.log("Surname mismatch");
        }
        if (response_dob !== user_dob) {
          console.log("DOB mismatch");
        }
      } else if (user_age < 16) {
        setErrorMessage("You are not eligible for this service");
      } else {
        console.log(response);
        // Proceed to the next part (Lifestyle Questions)
        setErrorMessage("Validation successful");
        props.onValidationSuccess(user_age);
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