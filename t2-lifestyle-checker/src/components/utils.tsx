// Parses dates in the format dd-mm-yyyy to Date objects
export const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const calculateAge = (dob: Date): number => {
    const today = new Date();
    const timeDifference = today.getTime() - dob.getTime();
    const ageInMilliseconds = new Date(timeDifference);
  
    // UTC year "1970" is used as a base year to calculate the age
    return Math.abs(ageInMilliseconds.getUTCFullYear() - 1970);
  };
