import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: "https://www.iprima.cz/",
    viewportWidth: 1920,
    viewportHeight: 1080,
    chromeWebSecurity: false,
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.ts",
    video: true,
    videoCompression: false,
    videosFolder: "cypress/report/videos",
    screenshotsFolder: "cypress/report/screenshots",
    downloadsFolder: "cypress/downloads",
    fixturesFolder: "cypress/fixtures",
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 20000,
    pageLoadTimeout: 30000,
    retries: {
      runMode: 2,
      openMode: 0
    },
    env: {
      TEST_EMAIL: "kehego@fxzig.com",
      TEST_PASSWORD: "Test12345*",
      API_BASE_URL: "https://gateway-api.prod.iprima.cz/json-rpc/",
      PROFILE_CLEANUP_TIMEOUT: 30000,
      MAX_TEST_PROFILES: 10
    }
  },
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: true,
    timestamp: 'mmddyyyy_HHMMss'
  }
});