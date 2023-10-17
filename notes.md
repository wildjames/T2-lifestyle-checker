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

