# Contributing to Signo 🤟

Thank you for your interest in contributing to **Signo**! We welcome bug fixes, accessibility enhancements, internationalization updates, and machine learning optimizations.

---

## Developer Certificate of Origin (DCO)

By contributing to this project, you certify that your contribution complies with the **Developer Certificate of Origin (DCO 1.1)**:

```text
Developer Certificate of Origin
Version 1.1

By making a contribution to this project, I certify that:

(a) The contribution was created in whole or in part by me and I have the right to submit it under the open source license indicated in the file; or
(b) The contribution is based upon previous work that, to the best of my knowledge, is covered under an appropriate open source license; or
(c) The contribution was provided directly to me by some other person who certified (a), (b) or (c) and I have not modified it.
(d) I understand and agree that this project and the contribution are public.
```

Please sign off all commits using `git commit -s -m "feat: description of change"`.

---

## Local Development Workflow

1. **Fork and Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/signifi.git
   cd signifi
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run Code Quality Checks:**
   ```bash
   # TypeScript Typechecking
   npx tsc --noEmit

   # ESLint
   npm run lint

   # Code Formatting
   npm run format

   # Unit Tests
   npm run test
   ```

4. **Pull Request Guidelines:**
   - Ensure all automated checks and Vitest unit tests pass.
   - Maintain adherence to WCAG AAA visual feedback standards and non-auditory design cues.
   - Keep pull requests focused on a single logical change.
