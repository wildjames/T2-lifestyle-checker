import { parseDate, calculateAge } from './utils';

describe('Utils Test Suite', () => {

  describe('parseDate function', () => {
    it('should correctly parse date strings in the format dd-mm-yyyy', () => {
      const testDate = '14-01-2000';
      const result = parseDate(testDate);
      expect(result.getDate()).toBe(14);
      expect(result.getMonth()).toBe(0);
      expect(result.getFullYear()).toBe(2000);
    });

    it('should handle single digit days and months', () => {
      const testDate = '02-03-2000';
      const result = parseDate(testDate);
      expect(result.getDate()).toBe(2);
      expect(result.getMonth()).toBe(2);
      expect(result.getFullYear()).toBe(2000);
    });
  });

  describe('calculateAge function', () => {
    it('should correctly calculate age based on the current date', () => {
      const dob = new Date(2000, 0, 14); // Jan 14, 2000
      const age = calculateAge(dob);
      expect(age).toBe(new Date().getFullYear() - 2000);
    });

    it('should handle leap years', () => {
      const dob = new Date(2000, 1, 29); // Feb 29, 2000 (leap year)
      const age = calculateAge(dob);
      expect(age).toBe(new Date().getFullYear() - 2000);
    });

    it('should handle ages less than a year', () => {
      const dob = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1); // One day ahead of current date
      const age = calculateAge(dob);
      expect(age).toBe(0);
    });
  });

});
