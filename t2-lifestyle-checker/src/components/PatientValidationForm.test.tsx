import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { addMonths, subYears } from "date-fns";

import PatientValidationForm from "./PatientValidationForm";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const handlePatientValidationSuccess = jest.fn();

describe("PatientValidationForm", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<PatientValidationForm onValidationSuccess={handlePatientValidationSuccess}  />);
  });

  it.each([
    ["123"], // Too short
    ["12345678901"], // Too long
    ["abcdefghij"], // Contains letters
    ["123[5]789"], // Contains special characters
  ])(
    "invalid NHS numbers should show an error message: %s",
    async (nhsNumber) => {
      const { getByLabelText, getByText } = render(<PatientValidationForm onValidationSuccess={handlePatientValidationSuccess}  />);
      const nhsNumberInput = getByLabelText(/NHS Number:/i);
      const surnameInput = getByLabelText(/Surname:/i);
      const dobInput = getByLabelText(/Date of Birth:/i);

      fireEvent.change(nhsNumberInput, { target: { value: nhsNumber } });
      fireEvent.change(surnameInput, { target: { value: "Doe" } });
      fireEvent.change(dobInput, { target: { value: "2005-01-14" } });
      fireEvent.submit(nhsNumberInput);

      await waitFor(() => getByText(/Please enter a valid NHS number/i));
    }
  );

  it("shows an error when the form is partially filled", async () => {
    const { getByLabelText, getByText } = render(<PatientValidationForm onValidationSuccess={handlePatientValidationSuccess}  />);
    const nhsInput = getByLabelText(/NHS Number:/i);
    const surnameInput = getByLabelText(/Surname:/i);
    const dobInput = getByLabelText(/Date of Birth:/i);

    fireEvent.change(nhsInput, { target: { value: "123456789" } });
    fireEvent.change(surnameInput, { target: { value: "" } }); // Leaving surname empty
    fireEvent.change(dobInput, { target: { value: "2005-01-14" } });
    fireEvent.submit(nhsInput);

    await waitFor(() => getByText(/Please enter your surname/i));

    fireEvent.change(nhsInput, { target: { value: "" } }); // Leaving NHS number empty
    fireEvent.change(surnameInput, { target: { value: "Doe" } });
    fireEvent.change(dobInput, { target: { value: "2005-01-14" } });
    fireEvent.submit(nhsInput);

    await waitFor(() => getByText(/Please enter your NHS number/i));

    fireEvent.change(nhsInput, { target: { value: "123456789" } });
    fireEvent.change(surnameInput, { target: { value: "Doe" } });
    fireEvent.change(dobInput, { target: { value: "" } }); // Leaving DOB empty
    fireEvent.submit(nhsInput);

    await waitFor(() => getByText(/Please enter your date of birth/i));
  });

  it("handles form submission with incorrect surname", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { nhsNumber: "111222333", name: "DOE, John", born: "14-01-2005" },
    });

    const { getByLabelText, getByText } = render(<PatientValidationForm onValidationSuccess={handlePatientValidationSuccess}  />);
    const nhsInput = getByLabelText(/NHS Number:/i);
    const surnameInput = getByLabelText(/Surname:/i);
    const dobInput = getByLabelText(/Date of Birth:/i);

    fireEvent.change(nhsInput, { target: { value: "111222333" } });
    fireEvent.change(surnameInput, { target: { value: "Smith" } }); // Incorrect surname
    fireEvent.change(dobInput, { target: { value: "2005-01-14" } });
    fireEvent.submit(nhsInput);

    await waitFor(() => getByText(/Your details could not be found/i));
  });

  it.each([
    ['14 years', false, subYears(new Date(), 14)],
    ['15 years, 11 months', true, subYears(addMonths(new Date(), -1), 16)],
    ['16 years, 1 month', false, addMonths(subYears(new Date(), 16), 1)],
    ['30', true, subYears(new Date(), 30)],
  ])("handles users who are %s years old", async (_, passes, birthDate) => {
    // Get the birth date as a string in the format yyyy-mm-dd
    const birthDateString = birthDate.toISOString().split("T")[0];

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        nhsNumber: "111222333",
        name: "DOE, John",
        // However, the server responds with dates in the format dd-mm-yyyy
        born: birthDateString.split("-").reverse().join("-"),
      },
    });

    const { getByLabelText, getByText } = render(<PatientValidationForm onValidationSuccess={handlePatientValidationSuccess}  />);
    const nhsInput = getByLabelText(/NHS Number:/i);
    const surnameInput = getByLabelText(/Surname:/i);
    const dobInput = getByLabelText(/Date of Birth:/i);

    fireEvent.change(nhsInput, { target: { value: "111222333" } });
    fireEvent.change(surnameInput, { target: { value: "Doe" } });
    fireEvent.change(dobInput, {
      target: { value: birthDateString },
    });
    fireEvent.submit(nhsInput);

    if (passes) {
      await waitFor(() => getByText(/Validation successful/i));
    } else {
      await waitFor(() => getByText(/You are not eligible for this service/i));
    }
  });

  it("handles users under 16 years old", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { nhsNumber: "111222333", name: "DOE, John", born: "14-01-2010" }, // 13 years old (TODO: Future proof this)
    });

    const { getByLabelText, getByText } = render(<PatientValidationForm onValidationSuccess={handlePatientValidationSuccess}  />);
    const nhsInput = getByLabelText(/NHS Number:/i);
    const surnameInput = getByLabelText(/Surname:/i);
    const dobInput = getByLabelText(/Date of Birth:/i);

    fireEvent.change(nhsInput, { target: { value: "111222333" } });
    fireEvent.change(surnameInput, { target: { value: "Doe" } });
    fireEvent.change(dobInput, { target: { value: "2010-01-14" } });
    fireEvent.submit(nhsInput);

    await waitFor(() => getByText(/You are not eligible for this service/i));
  });

  it("handles successful patient validation", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { nhsNumber: "111222333", name: "DOE, John", born: "14-01-2005" },
    });

    const { getByLabelText, getByText } = render(<PatientValidationForm onValidationSuccess={handlePatientValidationSuccess}  />);
    const nhsInput = getByLabelText(/NHS Number:/i);
    const surnameInput = getByLabelText(/Surname:/i);
    const dobInput = getByLabelText(/Date of Birth:/i);

    fireEvent.change(nhsInput, { target: { value: "111222333" } });
    fireEvent.change(surnameInput, { target: { value: "Doe" } });
    fireEvent.change(dobInput, { target: { value: "2005-01-14" } });
    fireEvent.submit(nhsInput);

    await waitFor(() => getByText(/Validation successful/i));
  });
});
