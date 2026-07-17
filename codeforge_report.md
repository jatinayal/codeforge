# CodeForge: Comprehensive Architecture & Project Report

This report provides a deep-dive analysis of the CodeForge project, prepared for an experienced software engineer preparing for technical interviews. It covers the system from a high-level architectural view down to specific implementation details.

---

## 1. Overall Purpose

**CodeForge** is a full-stack, production-ready LeetCode clone designed for competitive programming and coding practice. 
* **Problem it solves:** It provides a platform for developers to practice algorithmic problems, submit code for automated evaluation, interact with an AI assistant for hints, view editorial solutions, and compete on leaderboards.
* **Target Users:** Software engineers preparing for interviews, students practicing data structures and algorithms, and competitive programmers.
* **Core Features:** User authentication, role-based access control (Admin/User), problem browsing and filtering, an in-browser code editor (Monaco), secure code execution against hidden test cases, an AI-powered coding assistant (Google GenAI), premium-only features (Solutions and Editorials), and user performance tracking (Streaks, Leaderboards).

---

## 2. High-Level Architecture

CodeForge follows a modern, decoupled **Client-Server Architecture**:
* **Frontend (Client):** A Single Page Application (SPA) built with React and Vite. It heavily relies on client-side routing and global state management, communicating with the backend via RESTful APIs.
* **Backend (API Server):** A Node.js and Express server that handles business logic, authentication, and database interactions.
* **Database Layer:** MongoDB serves as the primary NoSQL datastore for users, problems, and submissions. Redis is utilized for caching and reducing database load.
* **External Services:** 
  * **Judge0 (or similar API):** Used for secure, containerized compilation and execution of user-submitted code in multiple languages (C++, Java, JavaScript).
  * **Cloudinary:** Manages media uploads (user profile pictures and solution videos).
  * **Google GenAI (Gemini):** Powers the conversational AI that helps users debug their code.

---

## 3. Project Structure

The codebase is logically separated into two main directories: `CFFrontend` and `CodeForge` (Backend).

### Backend (`CodeForge/src/`)
* **`index.js`:** The main entry point. Initializes Express, configures CORS, connects to MongoDB and Redis, and registers route middlewares.
* **`config/`:** Contains database configuration strings and Redis setup.
* **`models/`:** Mongoose schemas defining the data structure (`user.js`, `problem.js`, `submissions.js`, `solutionVideo.js`).
* **`controllers/`:** Contains the core business logic (e.g., `userSubmission.js` handles code evaluation logic, `chatAi.js` manages Gemini API interactions).
* **`routes/`:** Express routers mapping HTTP endpoints to controller functions (e.g., `submit.js`, `userAuth.js`, `problemRouter.js`).
* **`middleware/`:** Custom middleware functions (e.g., JWT-based authentication guards like `userMiddleware.js`).
* **`utils/`:** Helper functions (e.g., `ProblemUtility.js` formats requests for the code execution engine).

### Frontend (`CFFrontend/src/`)
* **`main.jsx` & `App.jsx`:** The React entry points. `App.jsx` configures `react-router-dom` and defines public, protected, and admin-only routes.
* **`pages/`:** Contains all the view components (e.g., `ProblemPage.jsx`, `Homepage.jsx`, `AdminPanel.jsx`).
* **`store/`:** Redux configuration and slices (e.g., `authSlice.js` for managing user login state persistently).
* **`utils/`:** Contains `axiosClient.js` for centralized API requests (handling base URLs and attaching credentials).
* **`assets/`:** Static files like logos and images.

---

## 4. Tech Stack Detail

### Frontend
* **React 19 & Vite:** Chosen for fast development server startup (HMR), optimized production builds, and a strong components ecosystem.
* **Redux Toolkit (`@reduxjs/toolkit`):** Simplifies global state management, specifically used for user authentication state across the app.
* **Tailwind CSS & DaisyUI:** Tailwind provides utility-first rapid styling, while DaisyUI supplies pre-built, themeable semantic components (buttons, cards, navbars).
* **React Router v7:** Handles client-side routing, enabling a seamless SPA experience without page reloads.
* **Monaco Editor (`@monaco-editor/react`):** The exact editor engine that powers VS Code. Chosen to give users a familiar, high-performance coding environment with syntax highlighting right in the browser.
* **React Resizable Panels:** Allows users to adjust the size of the problem description and code editor dynamically.

### Backend
* **Node.js & Express (v5.x):** Highly scalable, non-blocking I/O event-driven architecture, perfect for handling thousands of concurrent lightweight API requests.
* **MongoDB & Mongoose:** A NoSQL database is a great fit here because the structure of a "Problem" (which has deeply nested arrays of varying test cases and code snippets) maps naturally to JSON documents.
* **Redis:** In-memory data store used to cache frequent queries (e.g., the leaderboard or problem lists) to alleviate database bottlenecks.
* **JWT & bcrypt:** Industry standards for securely hashing passwords and issuing stateless authentication tokens.

---

## 5. Application Flow

### Authentication Flow
1. User submits login credentials on the frontend.
2. The Node.js backend uses `bcrypt` to compare the password hash.
3. If valid, the backend issues a JWT, usually setting it as an `HttpOnly` cookie or returning it in the payload.
4. The frontend Redux `authSlice` captures the user data, triggering a re-render that unlocks protected routes (e.g., `/profile`, `/problem/:id`).

### Code Execution Flow (The "Run" vs "Submit" Lifecycle)
1. **User Action:** The user types code into the Monaco editor and clicks "Run" or "Submit".
2. **API Call:** The frontend posts the raw code string, selected language, and `problemId` to `/submission/run/:id` (for visible test cases) or `/submission/submit/:id` (for hidden test cases).
3. **Backend Processing:** 
   * The backend finds the Problem in MongoDB.
   * It extracts the relevant test cases (visible or hidden).
   * It maps the code and test cases into an array of execution payloads.
4. **Execution Engine:** `submitBatch` sends the array to the external execution API (e.g., Judge0) to compile and run asynchronously. It receives batch tokens in return.
5. **Polling/Resolution:** `submitToken` is used to fetch the exact status (Accepted, Wrong Answer, Compilation Error, Runtime/Memory usage) for each token limit.
6. **Database Persistence:** If it was a "Submit" action, a `Submission` document is created in MongoDB tracking whether the user passed all test cases. If successful, the `problemId` is appended to the user's `problemSolved` array.
7. **Response:** The backend returns the execution summary to the frontend to update the UI (showing green text for Accepted, or the exact Error Message).

---

## 6. Key Components and Modules

* **`ProblemPage.jsx`:** The most critical frontend component. It manages complex horizontal and vertical resizable panels. It houses multiple tabs (Description, Editorial, Solutions, Submissions, ChatAi). It acts as the orchestrator for fetching problem data, managing the Monaco editor state, maintaining a stopwatch timer, and handling execution API responses.
* **`ChatAi.js` (Backend):** Serves as a prompt engineering wrapper around Google's Gemini Flash model. It constructs a highly contextual prompt string combining the user's explicit question, the specific problem description, and their current dirty code to ask the LLM for a structured, beginner-friendly hint (specifically instructed *not* to just give the final answer).
* **Role-Based Routing:** `App.jsx` cleanly segregates routes. Only users with `role === 'admin'` can access `<AdminPanel />`, `<CreateProblem />`, or `<AdminVideo />`.

---

## 7. Database Design

The MongoDB schema leans on document embedding and references:
* **User (`user.js`):** Stores basic info, role (`user`/`admin`), and a `problemSolved` array (Mongoose `ObjectId` references to Problem documents). Contains a pre-delete hook: deleting a user cascades and deletes all their submissions.
* **Problem (`problem.js`):** A massive document containing `title`, `description`, `difficulty` (enum), `tags` (enum). Crucially, it embeds arrays for `visibleTestCases`, `hiddenTestCases`, `startCode` (boilerplates for different languages), and `referenceSolution` (for premium users).
* **Submission (`submissions.js`):** A transactional ledger mapping `userId` and `problemId`. Tracks the submitted `code`, `language`, `status` (accepted, wrong, error), `runtime`, `memory`, and test case pass rates. Includes a compound index `({userId:1, problemId:1})` to drastically speed up queries attempting to find if a user has solved a specific problem.

---

## 8. Coding Patterns & Practices

**Good Practices:**
* **Centralized API Client:** The frontend uses an `axiosClient` wrapper, making it easy to manage base URLs and interceptors globally.
* **Secure Deletion:** Mongoose middleware (`post('findOneAndDelete')`) ensures orphan submissions don't litter the database when a user is deleted.
* **Decoupled Execution:** The server does not execute untrusted code locally (which is a massive security risk). It delegates to an external compilation API.
* **Monetization Architecture:** The UI elegantly checks `user?.isPaid` to gate premium features (Editorials/Solutions) behind paywalls while leaving the core engine free.

**Areas for Refactoring:**
* **Frontend Component Bloat:** `ProblemPage.jsx` is almost 1,000 lines long. The tabs (Chat, Editorial, Description) and the resizable panel logic should be extracted into smaller, separate child components.
* **Controller Bloat:** Controller functions (`userSubmission.js`) mix route validation, database querying, and third-party API orchestration. This strictly violates the Single Responsibility Principle. A separate `ExecutionService` class should be created.
* **Lack of WebSockets/Polling:** If the external execution engine takes 10 seconds to run complex C++ code, the Express server currently block-awaits HTTP calls in a loop. Moving executions to a background queue (BullMQ/RabbitMQ) and notifying the frontend via WebSockets/Server-Sent Events would be dramatically more scalable.

---

## 9. Complex / Critical Logic Explaination

**The AI Prompting System (`chatAi.js`)**
1. **The Goal:** Provide a tailored hint to a stuck user without giving them the direct answer.
2. **The Logic:** When a user types a question in the chat UI, the frontend sends 4 things: The question, the problem details, the code they have written so far, and the language. 
3. **The Assembly:** The backend aggregates this into a strict System Prompt literal string: *"You are CodeForge AI... Problem Details: X... User Code: Y... User Question: Z... Focus on helping the user fix their code... do not give full solution"*.
4. **The Execution:** This massive context block is fed to the Gemini 2.5 Flash model API. Because the LLM receives the exact code the user wrote, its advice is hyper-specific to the user's syntax errors or logical flaws, creating a deeply personalized tutoring experience.

---

## 10. Potential Interview Questions

**Q1: How do you securely execute user-submitted code?**
*Answer:* You never run it directly on your primary Node.js server to avoid remote code execution (RCE) vulnerabilities or infinite loop CPU denial-of-service. You must use sandboxed environments (like isolated Docker containers without network access) or route the code to a specialized third-party engine (like Judge0) as we do in CodeForge.

**Q2: In Mongoose, why use embedded documents for Test Cases but References for Submissions?**
*Answer:* Testcases belong inherently to a Problem; they are bounded in number and are exclusively queried alongside the problem. Submissions, however, grow infinitely per problem and per user. Embedding thousands of submissions into a single Problem or User document would quickly exceed MongoDB's 16MB document size limit.

**Q3: How does your React app handle authorization for Admin routes?**
*Answer:* We use conditional rendering in the router layer (`App.jsx`). We pull the `user` object from Redux global state. A route like `/admin` is defined as `element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/problems" />}`.

**Q4: How would you improve the performance of checking if a user has solved a problem?**
*Answer:* Currently, checking `submission` tables requires DB lookups. I would use Redis to cache a `Set` of `problemId`s solved by each active `userId`. When a user logs in, we load this Set into Redis; checking `SISMEMBER user:123:solved problem:456` takes O(1) time.

---

## 11. Weaknesses & Scalability Improvements

* **Synchronous Code Execution Validation:** As mentioned, HTTP requests to external compilers block the execution flow. **Fix:** Implement an event-driven architecture using Redis Pub/Sub, BullMQ, or WebSockets.
* **Database Indexes:** The Mongoose schemas lack explicit indexing on fields frequently used for filtering, like `Problem.difficulty` or `Problem.tags`. Adding indexes will vastly speed up the Homepage problem table load time at scale.
* **State Management Coupling:** Standard local state (`useState`) and Redux are heavily interwoven in large components. Modern data fetching tools like React Query (TanStack Query) should replace Redux thunks to handle API caching, loading, and error states elegantly, leaving Redux strictly for global UI/Auth state.
* **Rate Limiting:** The backend lacks explicit rate limiting on the `/submission` and `/chat` endpoints. A malicious user could spam the API, eating up Judge0 execution limits or Gemini API billing quotas. `express-rate-limit` must be implemented.

---

## 12. 60-Second Project Summary Pitch

> *"CodeForge is a full-stack, competitive programming platform I analyzed, built on the MERN stack with Vite and React. It acts as a comprehensive LeetCode clone. The frontend features a highly interactive UI with resizable panels, a Monaco code editor, and role-based routing. The backend evaluates untrusted user code in real-time by securely orchestrating batches of unit tests through an external execution engine API. The database is modeled in MongoDB with compound indexing to rapidly query user submission history. One of the standout features is an integrated AI-assistant powered by Google Gemini, which ingests the user's precise code and problem statement to act as a personalized, conversational debugging tutor. To ensure performance, the system incorporates Redis caching, and is architected to cleanly parse business logic through Express controllers guarded by JWT authentications."*
