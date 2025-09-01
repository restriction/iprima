# Prima+ Profile Test Automation

Professional end-to-end test automation framework for Prima+ profile management using Cypress with TypeScript.

## Test Coverage

This test suite provides comprehensive validation of profile management functionality:

### Test Suites

**API - Profile Tests** (`api-profile.cy.ts`)
- Profile creation lifecycle (API-based)
- Adult Male/Female profiles (with and without PIN)
- Kid Male/Female profiles (with and without PIN) 
- Profile verification and cleanup

**UI - Profile Tests** (`ui-profile.cy.ts`)
- Complete UI workflow testing
- Adult Male/Female profiles (with and without PIN)
- Kid Male/Female profiles (with and without PIN)
- Login, creation, navigation, deletion, and verification

### Profile Types Supported
- **Adult profiles**: Male/Female with optional PIN protection
- **Kids profiles**: Boy/Girl with optional PIN protection
- **PIN functionality**: 4-digit PIN setup and authentication

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Valid Prima+ user account

## Installation

```bash
git clone <repository-url>
cd iprima
npm install
```

## Configuration

Set up your test credentials using one of these methods:

**Environment Variables (Recommended)**
```bash
# Windows
set CYPRESS_TEST_EMAIL=your-test-email@example.com
set CYPRESS_TEST_PASSWORD=your-test-password

# macOS/Linux/GitBash
export CYPRESS_TEST_EMAIL=your-test-email@example.com
export CYPRESS_TEST_PASSWORD=your-test-password
```

**Configuration File**
Update `cypress.config.ts`:
```typescript
env: {
  TEST_EMAIL: "your-test-email@example.com",
  TEST_PASSWORD: "your-test-password"
}
```

**Environment File**
Create `cypress.env.json`:
```json
{
  "TEST_EMAIL": "your-test-email@example.com",
  "TEST_PASSWORD": "your-test-password"
}
```

## Running Tests

### Command Line (Headless)

```bash
# Run all tests
npx cypress run

# Run specific test suite
npx cypress run --spec "cypress/e2e/api-profile.cy.ts"
npx cypress run --spec "cypress/e2e/ui-profile.cy.ts"

# Run with specific browser
npx cypress run --browser chrome
npx cypress run --browser firefox

# Generate test reports
npx cypress run --reporter mochawesome
```

### Interactive Mode (Development)

```bash
# Open Cypress Test Runner
npx cypress open

# Then select your desired test file:
# - api-profile.cy.ts (API tests)
# - ui-profile.cy.ts (UI tests)
```

### Test Organization

**API Tests** - Fast, reliable backend validation
- 9 test scenarios
- Direct API calls for profile management
- PIN support via request parameters

**UI Tests** - Complete user workflow validation  
- 8 test scenarios
- Full browser automation
- PIN setup via UI interactions

## Project Structure

```
cypress/
├── api/
│   └── GatewayApi.ts          # Prima+ API integration
├── e2e/
│   ├── api-profile.cy.ts      # API-based tests
│   └── ui-profile.cy.ts       # UI-based tests
├── page/
│   └── IprimaPage.ts          # Page Object Model
├── fixtures/
│   └── testData.json          # Test data configuration
└── support/
    ├── commands.ts            # Custom Cypress commands
    └── e2e.ts                 # Global configuration
```

## API Integration

The `GatewayApi.ts` provides:

```typescript
// Authentication
getAccessToken(email, password) → accessToken

// Profile management
createProfile(name, options, email, password) → profileUlid
removeProfile(ulid, email, password) → success
getProfileUlIds(email, password) → ulid[]

// PIN support in options
{
  pin: "1234",
  updatePin: true
}
```

## Test Features

**Comprehensive Coverage**
- Profile creation with all demographic combinations
- PIN setup and authentication testing
- UI workflow validation
- API functionality verification

**Professional Quality**
- TypeScript for type safety
- Page Object Model for maintainability
- Automatic cleanup to prevent test pollution
- Environment-based configuration
- Detailed logging and reporting

**PIN Testing**
- 4-digit PIN setup during profile creation
- PIN authentication during profile management
- Both UI and API PIN validation

## Troubleshooting

**Authentication Issues**
```bash
# Verify credentials are set
echo $CYPRESS_TEST_EMAIL
# Test login manually at iprima.cz
```

**Network Issues**
```bash
# For corporate networks
npx cypress run --config chromeWebSecurity=false
```

**Debug Mode**
```bash
# Verbose logging
DEBUG=cypress:* npx cypress run

# Interactive debugging
npx cypress open
```

## CI/CD Integration

**GitHub Actions Example**
```yaml
name: Prima+ E2E Tests
on: [push, pull_request]

jobs:
  cypress-run:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v3
      - uses: cypress-io/github-action@v5
        env:
          CYPRESS_TEST_EMAIL: ${{ secrets.TEST_EMAIL }}
          CYPRESS_TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
```

## Technical Details

- **Framework**: Cypress 13.15.0
- **Language**: TypeScript
- **Test Pattern**: Page Object Model
- **Authentication**: OAuth2 token-based
- **Cleanup**: Automatic profile removal
- **Reporting**: Built-in Cypress reports + optional Mochawesome

---

**Test Coverage Summary**
- 17 total test scenarios
- 8 UI workflow tests  
- 9 API integration tests
- Complete PIN functionality coverage
- All profile types (Adult/Kids, Male/Female)
