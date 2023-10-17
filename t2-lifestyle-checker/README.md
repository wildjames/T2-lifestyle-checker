# T2-lifestyle-checker

A solution to the problem here: https://github.com/airelogic/tech-test-portal/tree/main/T2-Lifestyle-Checker

For these kinds of interview-code-challenges, I generally keep some more stream-of-conciousness notes than I otherwise would. As I see it, the goal here is atypical - you want to see how I work and think, rather than for me to build something deployable, or that can be handed off to other developers. As such, these notes may be more casual than is normally acceptable! These notes will be [here](../notes.md)


## Installation

1. **Clone the repository:**
   ```bash
   git clone git@github.com:wildjames/T2-lifestyle-checker.git
   cd t2-lifestyle-checker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   - Create a `.env` file in the app directory, `t2-lifestyle-checker`.
   - Add the API subscription key, i.e. the contents of `./t2-lifestyle-checker/.env` will be:
     ```
     REACT_APP_API_SUBSCRIPTION_KEY=your_api_subscription_key
     ```

## Running the Application

- **Development Mode:**
  ```bash
  npm start
  ```
  Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

- **Running Tests:**
  ```bash
  npm test
  ```

- **Build the Application for Production:**
  ```bash
  npm run build
  ```
  Builds the app for production to the `build` folder.
