import IprimaPage from "../page/IprimaPage";
import GatewayApi from "../api/GatewayApi";

describe('UI - Profile Tests', () => {
  const testEmail = Cypress.env('TEST_EMAIL') || 'test@example.com';
  const testPassword = Cypress.env('TEST_PASSWORD') || 'testPassword123';

  before(() => {
    // Validate test credentials
    if (!testEmail || !testPassword) {
      throw new Error('TEST_EMAIL and TEST_PASSWORD environment variables are required');
    }
  });

  beforeEach(() => {
    GatewayApi.intercepts.POST_Request();
  });

  it('should create a new adult profile via UI form - Žena', () => {
    cy.log('Testing adult female profile creation via UI...');
    
    const profileName = `AF${Date.now().toString().slice(-4)}`; // Adult Female + last 4 digits
    const gender = 'Žena';
    const birthYear = '2000';
    const profileType = 'adult';
    
    // Step 1: Login to reach profile selection page
    cy.log(' Step 1: Logging in...');
    IprimaPage.visit();
    IprimaPage.elements.home.linkSignIn().click();
    IprimaPage.elements.login.inputEmail().type(testEmail);
    IprimaPage.elements.login.inputPassword().type(testPassword);
    IprimaPage.elements.login.buttonSubmit().click();
    cy.wait('@POST_Request');
    
    // Step 2: Verify we're at "Kdo se dívá?" page
    cy.log(' Step 2: Verifying profile selection page...');
    IprimaPage.verifyProfileSelectionPage();
    
    // Step 3: Create new profile using UI form
    cy.log(` Step 3: Creating ${profileType} ${gender} profile via UI form...`);
    IprimaPage.createNewProfileViaUI(profileName, gender, birthYear, profileType);
    
    // Step 4: Wait a moment for profile creation
    cy.wait(3000);
    
    // Step 5: Navigate to profile management
    cy.log(` Step 5: Navigating to profile management...`);
    IprimaPage.navigateToProfileManagement(profileName);
    
    // Step 6: Delete the created profile
    cy.log(` Step 6: Deleting created profile...`);
    IprimaPage.deleteProfileViaUI(profileName);
    
    // Step 7: Verify profile was actually deleted
    cy.log(` Step 7: Verifying profile deletion...`);
    IprimaPage.verifyProfileDeleted(profileName);
    
    cy.log(` ${profileType} ${gender} profile lifecycle completed with verification: ${profileName}`);
  });

  it('should create a new adult profile via UI form - Muž', () => {
    cy.log(' Testing adult male profile creation via UI...');
    
    const profileName = `AM${Date.now().toString().slice(-4)}`; // Adult Male + last 4 digits
    const gender = 'Muž';
    const birthYear = '2000';
    const profileType = 'adult';
    
    // Step 1: Login to reach profile selection page
    cy.log(' Step 1: Logging in...');
    IprimaPage.visit();
    IprimaPage.elements.home.linkSignIn().click();
    IprimaPage.elements.login.inputEmail().type(testEmail);
    IprimaPage.elements.login.inputPassword().type(testPassword);
    IprimaPage.elements.login.buttonSubmit().click();
    cy.wait('@POST_Request');
    
    // Step 2: Verify we're at "Kdo se dívá?" page
    cy.log(' Step 2: Verifying profile selection page...');
    IprimaPage.verifyProfileSelectionPage();
    
    // Step 3: Create new profile using UI form
    cy.log(` Step 3: Creating ${profileType} ${gender} profile via UI form...`);
    IprimaPage.createNewProfileViaUI(profileName, gender, birthYear, profileType);
    
    // Step 4: Wait a moment for profile creation
    cy.wait(3000);
    
    // Step 5: Navigate to profile management
    cy.log(` Step 5: Navigating to profile management...`);
    IprimaPage.navigateToProfileManagement(profileName);
    
    // Step 6: Delete the created profile
    cy.log(` Step 6: Deleting created profile...`);
    IprimaPage.deleteProfileViaUI(profileName);
    
    // Step 7: Verify profile was actually deleted
    cy.log(` Step 7: Verifying profile deletion...`);
    IprimaPage.verifyProfileDeleted(profileName);
    
    cy.log(` ${profileType} ${gender} profile lifecycle completed with verification: ${profileName}`);
  });

  it('should create a new kids profile via UI form - Dívka', () => {
    cy.log(' Testing kids female profile creation via UI...');
    
    const profileName = `KF${Date.now().toString().slice(-4)}`; // Kids Female + last 4 digits
    const gender = 'Dívka';
    const birthYear = '2015'; // Child birth year
    const profileType = 'kids';
    
    // Step 1: Login to reach profile selection page
    cy.log(' Step 1: Logging in...');
    IprimaPage.visit();
    IprimaPage.elements.home.linkSignIn().click();
    IprimaPage.elements.login.inputEmail().type(testEmail);
    IprimaPage.elements.login.inputPassword().type(testPassword);
    IprimaPage.elements.login.buttonSubmit().click();
    cy.wait('@POST_Request');
    
    // Step 2: Verify we're at "Kdo se dívá?" page
    cy.log(' Step 2: Verifying profile selection page...');
    IprimaPage.verifyProfileSelectionPage();
    
    // Step 3: Create new profile using UI form
    cy.log(` Step 3: Creating ${profileType} ${gender} profile via UI form...`);
    IprimaPage.createNewProfileViaUI(profileName, gender, birthYear, profileType);
    
    // Step 4: Wait a moment for profile creation
    cy.wait(3000);
    
    // Step 5: Navigate to profile management
    cy.log(` Step 5: Navigating to profile management...`);
    IprimaPage.navigateToProfileManagement(profileName);
    
    // Step 6: Delete the created profile
    cy.log(` Step 6: Deleting created profile...`);
    IprimaPage.deleteProfileViaUI(profileName);
    
    // Step 7: Verify profile was actually deleted
    cy.log(` Step 7: Verifying profile deletion...`);
    IprimaPage.verifyProfileDeleted(profileName);
    
    cy.log(` ${profileType} ${gender} profile lifecycle completed with verification: ${profileName}`);
  });

  it('should create a new kids profile via UI form - Chlapec', () => {
    cy.log(' Testing kids male profile creation via UI...');
    
    const profileName = `KM${Date.now().toString().slice(-4)}`; // Kids Male + last 4 digits
    const gender = 'Chlapec';
    const birthYear = '2015'; // Child birth year
    const profileType = 'kids';
    
    // Step 1: Login to reach profile selection page
    cy.log(' Step 1: Logging in...');
    IprimaPage.visit();
    IprimaPage.elements.home.linkSignIn().click();
    IprimaPage.elements.login.inputEmail().type(testEmail);
    IprimaPage.elements.login.inputPassword().type(testPassword);
    IprimaPage.elements.login.buttonSubmit().click();
    cy.wait('@POST_Request');
    
    // Step 2: Verify we're at "Kdo se dívá?" page
    cy.log(' Step 2: Verifying profile selection page...');
    IprimaPage.verifyProfileSelectionPage();
    
    // Step 3: Create new profile using UI form
    cy.log(` Step 3: Creating ${profileType} ${gender} profile via UI form...`);
    IprimaPage.createNewProfileViaUI(profileName, gender, birthYear, profileType);
    
    // Step 4: Wait a moment for profile creation
    cy.wait(3000);
    
    // Step 5: Navigate to profile management
    cy.log(` Step 5: Navigating to profile management...`);
    IprimaPage.navigateToProfileManagement(profileName);
    
    // Step 6: Delete the created profile
    cy.log(` Step 6: Deleting created profile...`);
    IprimaPage.deleteProfileViaUI(profileName);
    
    // Step 7: Verify profile was actually deleted
    cy.log(` Step 7: Verifying profile deletion...`);
    IprimaPage.verifyProfileDeleted(profileName);
    
    cy.log(` ${profileType} ${gender} profile lifecycle completed with verification: ${profileName}`);
  });

  it('should create a new kids profile via UI form - Dívka with PIN', () => {
    cy.log(' Testing kids female profile creation with PIN via UI...');
    
    const profileName = `KFP${Date.now().toString().slice(-4)}`; // Kids Female with PIN
    const gender = 'Dívka';
    const birthYear = '2015';
    const profileType = 'kids';
    
    // Step 1: Login to reach profile selection page
    cy.log(' Step 1: Logging in...');
    IprimaPage.visit();
    IprimaPage.elements.home.linkSignIn().click();
    IprimaPage.elements.login.inputEmail().type(testEmail);
    IprimaPage.elements.login.inputPassword().type(testPassword);
    IprimaPage.elements.login.buttonSubmit().click();
    cy.wait('@POST_Request');
    
    // Step 2: Verify we're at "Kdo se dívá?" page
    cy.log(' Step 2: Verifying profile selection page...');
    IprimaPage.verifyProfileSelectionPage();
    
    // Step 3: Create new profile using UI form with PIN
    cy.log(` Step 3: Creating ${profileType} ${gender} profile with PIN via UI form...`);
    IprimaPage.createNewProfileViaUI(profileName, gender, birthYear, profileType, true);
    
    // Step 4: Wait a moment for profile creation
    cy.wait(3000);
    
    // Step 5: Navigate to profile management
    cy.log(` Step 5: Navigating to profile management...`);
    IprimaPage.navigateToProfileManagement(profileName);
    
    // Step 6: Delete the created profile
    cy.log(` Step 6: Deleting created profile...`);
    IprimaPage.deleteProfileViaUI(profileName);
    
    // Step 7: Verify profile was actually deleted
    cy.log(` Step 7: Verifying profile deletion...`);
    IprimaPage.verifyProfileDeleted(profileName);
    
    cy.log(` ${profileType} ${gender} profile with PIN lifecycle completed: ${profileName}`);
  });

  it('should create a new kids profile via UI form - Chlapec with PIN', () => {
    cy.log(' Testing kids male profile creation with PIN via UI...');
    
    const profileName = `KMP${Date.now().toString().slice(-4)}`; // Kids Male with PIN
    const gender = 'Chlapec';
    const birthYear = '2015';
    const profileType = 'kids';
    
    // Step 1: Login to reach profile selection page
    cy.log(' Step 1: Logging in...');
    IprimaPage.visit();
    IprimaPage.elements.home.linkSignIn().click();
    IprimaPage.elements.login.inputEmail().type(testEmail);
    IprimaPage.elements.login.inputPassword().type(testPassword);
    IprimaPage.elements.login.buttonSubmit().click();
    cy.wait('@POST_Request');
    
    // Step 2: Verify we're at "Kdo se dívá?" page
    cy.log(' Step 2: Verifying profile selection page...');
    IprimaPage.verifyProfileSelectionPage();
    
    // Step 3: Create new profile using UI form with PIN
    cy.log(` Step 3: Creating ${profileType} ${gender} profile with PIN via UI form...`);
    IprimaPage.createNewProfileViaUI(profileName, gender, birthYear, profileType, true);
    
    // Step 4: Wait a moment for profile creation
    cy.wait(3000);
    
    // Step 5: Navigate to profile management
    cy.log(` Step 5: Navigating to profile management...`);
    IprimaPage.navigateToProfileManagement(profileName);
    
    // Step 6: Delete the created profile
    cy.log(` Step 6: Deleting created profile...`);
    IprimaPage.deleteProfileViaUI(profileName);
    
    // Step 7: Verify profile was actually deleted
    cy.log(` Step 7: Verifying profile deletion...`);
    IprimaPage.verifyProfileDeleted(profileName);
    
    cy.log(` ${profileType} ${gender} profile with PIN lifecycle completed: ${profileName}`);
  });

  it('should create a new adult profile via UI form - Žena with PIN', () => {
    cy.log('Testing adult female profile creation with PIN via UI...');
    
    const profileName = `AFP${Date.now().toString().slice(-4)}`; // Adult Female with PIN
    const gender = 'Žena';
    const birthYear = '2000';
    const profileType = 'adult';
    
    // Step 1: Login to reach profile selection page
    cy.log('Step 1: Logging in...');
    IprimaPage.visit();
    IprimaPage.elements.home.linkSignIn().click();
    IprimaPage.elements.login.inputEmail().type(testEmail);
    IprimaPage.elements.login.inputPassword().type(testPassword);
    IprimaPage.elements.login.buttonSubmit().click();
    cy.wait('@POST_Request');
    
    // Step 2: Verify we're at "Kdo se dívá?" page
    cy.log('Step 2: Verifying profile selection page...');
    IprimaPage.verifyProfileSelectionPage();
    
    // Step 3: Create new profile using UI form with PIN
    cy.log(`Step 3: Creating ${profileType} ${gender} profile with PIN via UI form...`);
    IprimaPage.createNewProfileViaUI(profileName, gender, birthYear, profileType, true);
    
    // Step 4: Wait a moment for profile creation
    cy.wait(3000);
    
    // Step 5: Navigate to profile management
    cy.log(`Step 5: Navigating to profile management...`);
    IprimaPage.navigateToProfileManagement(profileName);
    
    // Step 6: Delete the created profile
    cy.log(`Step 6: Deleting created profile...`);
    IprimaPage.deleteProfileViaUI(profileName);
    
    // Step 7: Verify profile was actually deleted
    cy.log(`Step 7: Verifying profile deletion...`);
    IprimaPage.verifyProfileDeleted(profileName);
    
    cy.log(`${profileType} ${gender} profile with PIN lifecycle completed: ${profileName}`);
  });

  it('should create a new adult profile via UI form - Muž with PIN', () => {
    cy.log('Testing adult male profile creation with PIN via UI...');
    
    const profileName = `AMP${Date.now().toString().slice(-4)}`; // Adult Male with PIN
    const gender = 'Muž';
    const birthYear = '2000';
    const profileType = 'adult';
    
    // Step 1: Login to reach profile selection page
    cy.log('Step 1: Logging in...');
    IprimaPage.visit();
    IprimaPage.elements.home.linkSignIn().click();
    IprimaPage.elements.login.inputEmail().type(testEmail);
    IprimaPage.elements.login.inputPassword().type(testPassword);
    IprimaPage.elements.login.buttonSubmit().click();
    cy.wait('@POST_Request');
    
    // Step 2: Verify we're at "Kdo se dívá?" page
    cy.log('Step 2: Verifying profile selection page...');
    IprimaPage.verifyProfileSelectionPage();
    
    // Step 3: Create new profile using UI form with PIN
    cy.log(`Step 3: Creating ${profileType} ${gender} profile with PIN via UI form...`);
    IprimaPage.createNewProfileViaUI(profileName, gender, birthYear, profileType, true);
    
    // Step 4: Wait a moment for profile creation
    cy.wait(3000);
    
    // Step 5: Navigate to profile management
    cy.log(`Step 5: Navigating to profile management...`);
    IprimaPage.navigateToProfileManagement(profileName);
    
    // Step 6: Delete the created profile
    cy.log(`Step 6: Deleting created profile...`);
    IprimaPage.deleteProfileViaUI(profileName);
    
    // Step 7: Verify profile was actually deleted
    cy.log(`Step 7: Verifying profile deletion...`);
    IprimaPage.verifyProfileDeleted(profileName);
    
    cy.log(`${profileType} ${gender} profile with PIN lifecycle completed: ${profileName}`);
  });
});