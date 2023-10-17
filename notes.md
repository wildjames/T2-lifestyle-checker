# Notes

I've gone with a React app. I've been using the tool for around a month or two now, and really enjoying how easy it tends to make development, so this seems like a good fit for something where time is a factor, but future expansion might be necessary.

I'll plan out for the following components:
- Patient Validation Form
  - Takes user input, sends it to the API endpoint, and handles the checks (both before and after the request)
- Patient Lifestyle Form
  - Takes user input on three questions and computes a score

I'll note that the lifestyle questions are all yes/no, so I think a dropdown box is appropriate. The scientist in me is screaming for more granularity in the responses, but unfortunately that's out of my hands.


### Patient validation form

Fairly simple component created. I wasted a bit of time grabbing the CSS file straight from the NHS homepage, skimming it, and skinning my component to use their classes - just for vanity, whilst I was waiting for access to the API endpoint and didn't fancy writing the functions I needed. Looks nice, in my opinion.

Date parsing is slightly tricky, since we're using UK dates and the `Date` objects requires its format. Handled fine though. For the age calculation function, I added some logic to check birthdays, so we don't accidentally catch people who haven't had theirs yet this year. Probably could have done this differently/better? Possible TODO.

Wrote some tests for the form. Only a handful though, as I've not as much time as I'd like - just enough to get a flavour for it. I think there needs to be more coverage of success conditions, and age verification, in particular. I may come back to this part later.
Partially ignore that, I added the age verification tests anyway. They're important.

Really, I feel that I should probably test with the actual API endpoint, rather than my synthetic data. However, I'm not sure what the best practice is here, so I'll fall back on local tests. Subject to change!

### Patient lifestyle questionnaire

Second component. If this was more complex, I would set up a dev switch to just dump me straight in the component, but for now I've already memorised John Doe's details, so I'll leave it. 

Simple form. I used lists and dictionaries to store the questions, answers, and scores so that adding new ones should be a bit easier. I think this one turned out quite nicely, actually, I'm pretty pleased with the structure here. However, some thoughts. It can only handle yes/no questions. This is fine for the given questions, but if this is extended then some tweaks will be necessary to add other user inputs - or even just other dropdown options. Also, the upper age threshold is 64 - I would have expected 65, so normally I would check that this isn't a typo. Finally, I corrected a typo in the message that is given back to the user, "you" to "your".

No tests yet!! I'm still getting the hang of React tests, so I'm leaving them to where I have something that has basic functionality, then I'll test around it. Might be tricky to test scores, I'll hand-craft a few expected outcomes.

Writing tests, noticed that the age bands are "41-65", "64+". Again, I would usually clarify with whoever wrote the spec, but I will assume this is supposed to be 41-65 and 65+.

Some tests written. Needs more coverage. However, I'm calling it here or the project will get away from me.


### Further development

> How could the code be implemented in such a way that the scoring mechanism could be altered without requiring the code to be recompiled and re-deployed? This could be a change to age groups or scores for individual questions.

As I've written my solution, the questions and scoring mechanism is stored on the component, like this:
```typescript
  const questions = [
    "Do you smoke?",
    "Do you drink alcohol?",
    "Do you exercise regularly?",
  ];

  // I key this by letters rather than strings, for extensibility
  const scores: Scores = {
    A: { q1: 1, q2: 2, q3: 1 },
    B: { q1: 2, q2: 2, q3: 3 },
    C: { q1: 3, q2: 2, q3: 2 },
    D: { q1: 3, q2: 3, q3: 1 },
  };
```

To avoid needing to redeploy the whole app if these change, we need to move this configuration out of the code. The most obvious, simple solution to me would be to put this all in a JSON/YML file, something like:
```json
{
    "questions": ["question 1", "question 2"],
    "scores": {"A": {"q1": 1, "q2": 2}, "B": {"q1": 2, "q2": 1}}
}
```
Note that the code I've written will need some refactoring in how the JSX is rendered, and the question answers parsed in order to achieve this. Other external storage would work as well, though a full-fat database feels like overkill. Similarly, the scoring scheme could be fetched from an API endpoint, though it should be noted that this will slow the load time of the page somewhat.

This is particularly obvious with my age group logic!
```TypeScript
    let ageGroup: string = "";
    if (props.patientAge >= 16 && props.patientAge <= 21) ageGroup = "A";
    else if (props.patientAge >= 22 && props.patientAge <= 40) ageGroup = "B";
    else if (props.patientAge >= 41 && props.patientAge < 65) ageGroup = "C";
    else if (props.patientAge >= 65) ageGroup = "D";
    console.log("Making them age group: ", ageGroup);
```
This is, in my opinion, ugly, but it's how it fell out of my brain so there we are. This could be specified with some JSON like
```json
{
    "ageBoundaries": {
        "A": [16, 21],
        "B": [22, 40],
        "C": [41, 64],
        "D": [65, 999]
    }
}
```
and code:
```typescript
let ageGroup: string = "";

Object.keys(ageBoundariesJson.ageBoundaries).forEach((group) => {
  const [minAge, maxAge] = ageBoundariesJson.ageBoundaries[group];
  if (props.patientAge >= minAge && props.patientAge <= maxAge) {
    ageGroup = group;
  }
});

console.log("Assigned age group: ", ageGroup);
```