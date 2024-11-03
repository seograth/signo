# SigniFi FE

Welcome to the documentation for the Signifi, a React web application built with TypeScript. This document will provide you with detailed information on how to set up, configure, and use the application across different environments: development, staging, and production.

## Prerequisites

Before running the frontend, ensure that the following dependencies are installed on your machine:

- Node.js: [Download and install Node.js](https://nodejs.org/en/download/) based on your operating system.
- Git (optional): [Download and install Git](https://git-scm.com/downloads) if you want to clone the repository using Git.

## Setup Instructions

To set up the frontend locally, follow the steps below:

1. Clone the repository: If you have Git installed, open your command line interface (CLI) and execute the following command:

   ```bash
   git clone <repository-url>
   ```

   If you don't have Git installed, you can download the repository as a ZIP file from the  
    repository's webpage and extract it. To find the repository url you just need to navigate to Repos tab (files sub tab) and find the clone button in the top right corner of the page.

2. Navigate to the frontend directory: In your CLI, change your current working directory to the frontend directory of the project.

   ```bash
   cd <frontend-folder-path-name>
   ```

3. Install dependencies: Run the following command to install the required dependencies for the frontend:

   ```bash
   npm install
   ```

   This will download and install all the necessary packages defined in the package.json file.

4. Start the server: Once the dependencies are installed, execute the following command to start the development server:
   ```bash
   npm start
   ```
   This will start the frontend application on a local development server. You can access it in your web browser at http://localhost:3000.

## Available Scripts

The `package.json` file includes several scripts that can be executed for various purposes. Here are some of the commonly used scripts:

- `npm start`: Starts the development server and runs the frontend in the development mode.
- `npm run build`: Builds the frontend for production by creating an optimised production-ready bundle.

Feel free to explore the `package.json` file to find more custom scripts that might be available for running the app in different environments or performing specific tasks.

## Prettier & ESLint Setup

In order for this set up to work you need to install **Prettier** on your VS Code or IDE.

To have a controlled codebase with same coding styles and rules we have set up a prettier and eslint files. All rules about identation, line length etc. can be found
at `.prettierrc.js` and `.eslintrc.json` for Javascript/Typescript files.

For styles .CSS files we have `.stylelintrc.json` with rules.

There is also an ignore file for compiled files and you can add new files/folders at `.prettierignore`.

## Conclusion

You have successfully set up and run the frontend locally. By following the instructions provided in this documentation, you should be able to start developing and testing the frontend of the project. Feel free to explore the codebase and make any necessary changes to suit your needs. If you encounter any issues or have further questions, please refer to the project's documentation or reach out to the development team for assistance.
