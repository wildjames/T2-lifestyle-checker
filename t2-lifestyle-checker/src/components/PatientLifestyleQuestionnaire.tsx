import React, { useState, FormEvent } from "react";

interface PatientLifestyleQuestionnaireProps {
  patientAge: number;
}

type ScoreValues = {
  q1: number;
  q2: number;
  q3: number;
};

type Scores = {
  [ageGroup: string]: ScoreValues;
};

type QuestionKeys = "q1" | "q2" | "q3";

type Answers = {
  q1: string;
  q2: string;
  q3: string;
};

const PatientLifestyleQuestionnaire: React.FC<
  PatientLifestyleQuestionnaireProps
> = (props) => {
  const [answers, setAnswers] = useState<Answers>({ q1: "", q2: "", q3: "" });
  const [resultMessage, setResultMessage] = useState("");

  const questions = [
    "Do you smoke?",
    "Do you drink alcohol?",
    "Do you exercise regularly?",
  ];

  const question_keys: QuestionKeys[] = ["q1", "q2", "q3"];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // I key this by letters rather than strings, for extensibility
    const scores: Scores = {
      A: { q1: 1, q2: 2, q3: 1 },
      B: { q1: 2, q2: 2, q3: 3 },
      C: { q1: 3, q2: 2, q3: 2 },
      D: { q1: 3, q2: 3, q3: 1 },
    };

    console.log("Patient supplied age: ", props.patientAge);
    let ageGroup: string = "";
    if (props.patientAge >= 16 && props.patientAge <= 21) ageGroup = "A";
    else if (props.patientAge >= 22 && props.patientAge <= 40) ageGroup = "B";
    else if (props.patientAge >= 41 && props.patientAge < 64) ageGroup = "C";
    else if (props.patientAge >= 64) ageGroup = "D";
    console.log("Making them age group: ", ageGroup);

    let score: number = 0;
    score += answers.q1 === "yes" ? scores[ageGroup].q1 : 0;
    console.log("Score after q1: ", score);
    score += answers.q2 === "yes" ? scores[ageGroup].q2 : 0;
    console.log("Score after q2: ", score);
    score += answers.q3 === "no" ? scores[ageGroup].q3 : 0;
    console.log("Score after q3: ", score);

    console.log("Final score: ", score);

    const message =
      score <= 3
        ? "Thank you for answering our questions, we don't need to see you at this time. Keep up the good work!"
        : "We think there are some simple things you could do to improve your quality of life, please phone to book an appointment";

    setResultMessage(message);
  };

  return (
    <form onSubmit={handleSubmit} className="nhsuk-form-group">
      {question_keys.map((q, index) => (
        <div className="nhsuk-form-group" key={q}>
          <label htmlFor={q} className="nhsuk-label">
            Q{index + 1}. {questions[index]}
          </label>
          <select
            id={q}
            value={answers[q]}
            onChange={(e) => setAnswers({ ...answers, [q]: e.target.value })}
            required
            className="nhsuk-select"
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      ))}

      <div>
        <button type="submit" className="nhsuk-button">
          Submit
        </button>
      </div>

      {resultMessage && <p className="nhsuk-error-message">{resultMessage}</p>}
    </form>
  );
};

export default PatientLifestyleQuestionnaire;
