/**
 * This file is a workaround for the "Cannot find module 'metro-core'" error
 * that occurs with Expo projects. It exports a mock implementation of metro-core
 * that should be sufficient for basic functionality.
 */

// Basic implementation of Terminal class from metro-core
class Terminal {
  constructor(options) {
    this.options = options || {};
  }

  log(message) {
    console.log(message);
  }

  error(message) {
    console.error(message);
  }

  info(message) {
    console.info(message);
  }

  warn(message) {
    console.warn(message);
  }

  status(message) {
    console.log(message);
  }

  clear() {
    // No-op in this mock
  }
}

// Export the Terminal class as part of metro-core
module.exports = {
  Terminal
}; 