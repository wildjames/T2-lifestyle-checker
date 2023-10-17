import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import PatientLifestyleQuestionnaire from "./PatientLifestyleQuestionnaire";

describe("PatientLifestyleQuestionnaire", () => {
  it("renders without crashing", () => {
    render(<PatientLifestyleQuestionnaire patientAge={25} />);
  });

  it("displays all questions with yes/no dropdowns", () => {
    render(<PatientLifestyleQuestionnaire patientAge={25} />);
    expect(screen.getByLabelText(/Do you smoke?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Do you drink alcohol?/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Do you exercise regularly?/i)
    ).toBeInTheDocument();
  });

  it("throws an error when age is too low", () => {
    render(<PatientLifestyleQuestionnaire patientAge={15} />);
    expect(screen.getByText(/Invalid age supplied/i)).toBeInTheDocument();
  });

  it.each([
    [16, "A"],
    [21, "A"],
    [22, "B"],
    [40, "B"],
    [41, "C"],
    [64, "C"],
    [65, "D"],
    [100, "D"],
  ])(
    "classifies age group correctly for age %s",
    async (age, expected_group) => {
      render(<PatientLifestyleQuestionnaire patientAge={age} />);
      const consoleSpy = jest.spyOn(console, "log");

      // Fill in the form with whatever responses, doesn't matter here.
      fireEvent.change(screen.getByLabelText(/Do you smoke?/i), {
        target: { value: "yes" },
      });
      fireEvent.change(screen.getByLabelText(/Do you drink alcohol?/i), {
        target: { value: "yes" },
      });
      fireEvent.change(screen.getByLabelText(/Do you exercise regularly?/i), {
        target: { value: "no" },
      });

      fireEvent.click(screen.getByText(/Submit/i));

      // Check the logs
      expect(consoleSpy).toHaveBeenCalledWith(
        "Making them age group: ",
        expected_group
      );
    }
  );

  it.each([
    // Points for "yes" for q1 and q2, "no" for q3
    // A group: 1, 2, 1
    [18, "yes", "yes", "no", true], // Score: 4
    [18, "yes", "no", "yes", false], // Score: 1
    [18, "no", "yes", "yes", false], // Score: 2
    [18, "yes", "no", "no", false], // Score: 2
    [18, "no", "yes", "no", false], // Score: 3
    [18, "no", "no", "yes", false], // Score: 0
    // B  group: 2, 2, 3
    [25, "yes", "yes", "no", true], // Score: 7
    [25, "yes", "no", "yes", false], // Score: 2
    [25, "no", "yes", "yes", false], // Score: 2
    [25, "yes", "no", "no", true], // Score: 5
    [25, "no", "yes", "no", true], // Score: 5
    [25, "no", "no", "yes", false], // Score: 3
    // C group: 3, 2, 2
    [50, "yes", "yes", "no", true], // Score: 7
    [50, "yes", "no", "yes", false], // Score: 3
    [50, "no", "yes", "yes", false], // Score: 2
    [50, "yes", "no", "no", true], // Score: 5
    [50, "no", "yes", "no", true], // Score: 4
    [50, "no", "no", "yes", false], // Score: 2
    // D group: 3, 3, 1
    [70, "yes", "yes", "no", true], // Score: 7
    [70, "yes", "no", "yes", false], // Score: 3
    [70, "no", "yes", "yes", false], // Score: 3
    [70, "yes", "no", "no", true], // Score: 4
    [70, "no", "yes", "no", true], // Score: 4
    [70, "no", "no", "yes", false], // Score: 1
  ])(
    "calculates score correctly based on answers and age group. Age %s, answers: %s, %s, %s, expected score: %s",
    (age: number, a1: string, a2: string, a3: string, can_improve: Boolean) => {
      render(<PatientLifestyleQuestionnaire patientAge={age} />);

      fireEvent.change(screen.getByLabelText(/Do you smoke?/i), {
        target: { value: a1 },
      });
      fireEvent.change(screen.getByLabelText(/Do you drink alcohol?/i), {
        target: { value: a2 },
      });
      fireEvent.change(screen.getByLabelText(/Do you exercise regularly?/i), {
        target: { value: a3 },
      });

      fireEvent.click(screen.getByText(/Submit/i));

      if (can_improve) {
        expect(
          screen.getByText(
            /We think there are some simple things you could do to improve your quality of life, please phone to book an appointment/i
          )
        ).toBeInTheDocument();
      } else {
        expect(
          screen.getByText(
            /Thank you for answering our questions, we don't need to see you at this time. Keep up the good work!/i
          )
        ).toBeInTheDocument();
      }
    }
  );
});
