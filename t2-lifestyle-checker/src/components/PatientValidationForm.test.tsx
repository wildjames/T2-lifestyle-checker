import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import PatientValidationForm from './PatientValidationForm';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PatientValidationForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<PatientValidationForm />);
  });

  it.each([
    ['123'], // Too short
    ['12345678901'], // Too long
    ['abcdefghij'], // Contains letters
    ['123[5]789'], // Contains special characters
  ])('invalid NHS numbers should show an error message: %s', async (nhsNumber) => {
    const { getByLabelText, getByText } = render(<PatientValidationForm />);
    const nhsNumberInput = getByLabelText(/NHS Number:/i);
    const surnameInput = getByLabelText(/Surname:/i);
    const dobInput = getByLabelText(/Date of Birth:/i);


    fireEvent.change(nhsNumberInput, { target: { value: nhsNumber } });
    fireEvent.change(surnameInput, { target: { value: 'Doe' } });
    fireEvent.change(dobInput, { target: { value: '2005-01-14' } });
    fireEvent.submit(nhsNumberInput);

    await waitFor(() => getByText(/Please enter a valid NHS number/i));
  });


  it('shows an error when the form is partially filled', async () => {
    const { getByLabelText, getByText } = render(<PatientValidationForm />);
    const nhsInput = getByLabelText(/NHS Number:/i);
    const surnameInput = getByLabelText(/Surname:/i);
    const dobInput = getByLabelText(/Date of Birth:/i);

    fireEvent.change(nhsInput, { target: { value: '123456789' } });
    fireEvent.change(surnameInput, { target: { value: '' } }); // Leaving surname empty
    fireEvent.change(dobInput, { target: { value: '2005-01-14' } });
    fireEvent.submit(nhsInput);

    await waitFor(() => getByText(/Please enter your surname/i));


    fireEvent.change(nhsInput, { target: { value: '' } }); // Leaving NHS number empty
    fireEvent.change(surnameInput, { target: { value: 'Doe' } });
    fireEvent.change(dobInput, { target: { value: '2005-01-14' } });
    fireEvent.submit(nhsInput);

    await waitFor(() => getByText(/Please enter your NHS number/i));


    fireEvent.change(nhsInput, { target: { value: '123456789' } });
    fireEvent.change(surnameInput, { target: { value: 'Doe' } });
    fireEvent.change(dobInput, { target: { value: '' } }); // Leaving DOB empty
    fireEvent.submit(nhsInput);

    await waitFor(() => getByText(/Please enter your date of birth/i));
  });


  it('handles form submission with incorrect surname', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { nhsNumber: '111222333', name: 'DOE, John', born: '14-01-2005' },
    });

    const { getByLabelText, getByText } = render(<PatientValidationForm />);
    const nhsInput = getByLabelText(/NHS Number:/i);
    const surnameInput = getByLabelText(/Surname:/i);
    const dobInput = getByLabelText(/Date of Birth:/i);

    fireEvent.change(nhsInput, { target: { value: '111222333' } });
    fireEvent.change(surnameInput, { target: { value: 'Smith' } }); // Incorrect surname
    fireEvent.change(dobInput, { target: { value: '2005-01-14' } });
    fireEvent.submit(nhsInput);

    await waitFor(() => getByText(/Your details could not be found/i));
  });


  it('handles form submission with incorrect date of birth', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { nhsNumber: '111222333', name: 'DOE, John', born: '14-01-2005' },
    });

    const { getByLabelText, getByText } = render(<PatientValidationForm />);
    const nhsInput = getByLabelText(/NHS Number:/i);
    const surnameInput = getByLabelText(/Surname:/i);
    const dobInput = getByLabelText(/Date of Birth:/i);

    fireEvent.change(nhsInput, { target: { value: '111222333' } });
    fireEvent.change(surnameInput, { target: { value: 'Doe' } });
    fireEvent.change(dobInput, { target: { value: '1995-02-06' } }); // Incorrect DOB
    fireEvent.submit(nhsInput);

    await waitFor(() => getByText(/Your details could not be found/i));
  });


  it('handles users under 16 years old', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { nhsNumber: '111222333', name: 'DOE, John', born: '14-01-2010' }, // 13 years old (TODO: Future proof this)
    });

    const { getByLabelText, getByText } = render(<PatientValidationForm />);
    const nhsInput = getByLabelText(/NHS Number:/i);
    const surnameInput = getByLabelText(/Surname:/i);
    const dobInput = getByLabelText(/Date of Birth:/i);

    fireEvent.change(nhsInput, { target: { value: '111222333' } });
    fireEvent.change(surnameInput, { target: { value: 'Doe' } });
    fireEvent.change(dobInput, { target: { value: '2010-01-14' } });
    fireEvent.submit(nhsInput);

    await waitFor(() => getByText(/You are not eligible for this service/i));
  });


  it('handles successful patient validation', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { nhsNumber: '111222333', name: 'DOE, John', born: '14-01-2005' },
    });

    const { getByLabelText, getByText } = render(<PatientValidationForm />);
    const nhsInput = getByLabelText(/NHS Number:/i);
    const surnameInput = getByLabelText(/Surname:/i);
    const dobInput = getByLabelText(/Date of Birth:/i);

    fireEvent.change(nhsInput, { target: { value: '111222333' } });
    fireEvent.change(surnameInput, { target: { value: 'Doe' } });
    fireEvent.change(dobInput, { target: { value: '2005-01-14' } });
    fireEvent.submit(nhsInput);

    // Assuming that you will redirect or show a success message upon successful validation
    await waitFor(() => getByText(/Validation successful/i));
  });

});
