// // jest.setup.js
import '@testing-library/jest-dom'; // Optional but recommended for better assertions

// module.exports = {
//     setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],  // Adjust path if necessary
//   };
  
module.exports = {
    setupFilesAfterEnv: ['./src/_test_/setupTests.js'],
  };
  