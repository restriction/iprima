import GatewayApi from "../api/GatewayApi";

class IprimaPage {
  BASE_URL: string;

  constructor() {
    this.BASE_URL = Cypress.config('baseUrl') || '';
  }

  elements = {
    home: {
      buttonAcceptCookies: () => cy.get('#didomi-notice-agree-button'),
      linkSignIn: () => cy.get('.sign-in'),
    },
    login: {
      inputEmail: () => cy.get('input[type="email"]'),
      inputPassword: () => cy.get('input[type="password"]'),
      buttonSubmit: () => cy.get('button[type="submit"]'),
    },
    profile: {
      titleWhoIsWatching: () => cy.get('h1[data-v-eaeffbd5].title.large').contains('Kdo se dívá?'),
      titleWhoIsWatchingAny: () => cy.get('h1').contains('Kdo se dívá?'),
      buttonProfile: (profile: string) => cy.contains('button', profile),
      buttonCreateProfile: () => cy.get('button.button.default.reset-width.add').contains('Běžný'),
      buttonCreateKidsProfile: () => cy.get('button.button.default.reset-width.add').contains('Dětský'),
      buttonCreateProfileOld: () => cy.contains('button', 'Vytvořit profil'),
      inputProfileName: () => cy.get('input.input.with-label'),
      inputProfileNameOld: () => cy.get('input[name="profileName"]'),
      selectGender: () => cy.get('.select .select-toggle').contains('Pohlaví'),
      selectGenderOption: (gender: string) => cy.get('.select-list .select-option').contains(gender),
      selectBirthYear: () => cy.get('.select .select-toggle').contains('Rok narození'),
      selectBirthYearOption: (year: string) => cy.get('.select-list .select-option').contains(year),
      buttonConfirmCreate: () => cy.contains('button', 'Vytvořit'),
      profileCard: (profileName: string) => cy.contains('.profile-card', profileName),
      buttonManageProfiles: () => cy.get('button.button.transparent.edit').contains('Spravovat profily'),
      profileItemByName: (profileName: string) => cy.get('button.item.edit').contains(profileName),
      linkDeleteProfile: () => cy.get('a.form-link').contains('Smazat profil'),
      buttonConfirmDeleteProfile: () => cy.get('button.button.default').contains('Smazat profil'),
      titlePasswordConfirmation: () => cy.get('h1.title.small').contains('Pro správu profilu zadejte heslo k účtu'),
      inputPasswordConfirmation: () => cy.get('input[type="password"].input.with-label'),
      buttonConfirmPassword: () => cy.get('button.button.primary').contains('Potvrdit'),
    }
  };

  /**
   * Visit the page
   * @param path - The path to visit
   * @param cookies - Whether to accept cookies
   */
  visit(path: string = '', cookies: boolean = true) {
    cy.visit(this.BASE_URL + path);
    if(cookies) this.acceptCookies();
  }

  /**
   * Accept cookies
   */
  acceptCookies() {
    this.elements.home.buttonAcceptCookies().click();
  }

  /**
   * Login and verify we reach the profile selection page
   * @param email - The email to login
   * @param password - The password to login
   */
  login(email: string, password: string) {
    GatewayApi.intercepts.POST_Request();

    this.visit();

    this.elements.home.linkSignIn().click();
    this.elements.login.inputEmail().type(email);
    this.elements.login.inputPassword().type(password);
    this.elements.login.buttonSubmit().click();

    cy.wait('@POST_Request');

    // Verify we reach the "Who's watching?" page
    this.verifyProfileSelectionPage();
  }

  /**
   * Verify we're on the profile selection page with "Kdo se dívá?" title
   */
  verifyProfileSelectionPage() {
    cy.log('🔍 Verifying we reached the "Kdo se dívá?" page...');
    
    // Use cy.then() to handle the selector logic properly
    cy.then(() => {
      // First try to find the specific selector
      return cy.get('body').then(($body) => {
        if ($body.find('h1[data-v-eaeffbd5].title.large:contains("Kdo se dívá?")').length > 0) {
          cy.log('✅ Found specific selector');
          cy.get('h1[data-v-eaeffbd5].title.large')
            .should('be.visible')
            .should('contain.text', 'Kdo se dívá?');
        } else {
          cy.log('⚠️ Specific selector not found, trying fallback...');
          cy.get('h1:contains("Kdo se dívá?")')
            .should('be.visible')
            .should('contain.text', 'Kdo se dívá?');
        }
      });
    }).then(() => {
      cy.log('✅ Successfully reached "Kdo se dívá?" page');
    });
  }

  /**
   * Complete login flow including profile selection (for backward compatibility)
   * @param email - The email to login
   * @param password - The password to login
   * @param profile - The profile to select
   */
  loginWithProfile(email: string, password: string, profile: string = 'QA') {
    this.login(email, password);
    
    // Select specific profile
    this.elements.profile.buttonProfile(profile).should('be.visible').and('be.enabled').click();
    cy.wait('@POST_Request');
    cy.url().should('eq', this.BASE_URL);
  }

  /**
   * Create a new user profile via UI (Legacy method)
   * @param profileName - The name of the profile to create
   */
  createProfileViaUI(profileName: string) {
    this.elements.profile.buttonCreateProfile().click();
    this.elements.profile.inputProfileName().type(profileName);
    this.elements.profile.buttonConfirmCreate().click();
    
    // Verify profile was created
    this.elements.profile.profileCard(profileName).should('be.visible');
  }

  /**
   * Create a new user profile via UI using current Prima+ interface
   * @param profileName - The name of the profile to create
   * @param gender - Gender selection ('Žena' or 'Muž')
   * @param birthYear - Birth year as string (e.g., '2000')
   * @param profileType - Profile type ('adult' or 'kids')
   * @param withPin - Whether to enable PIN for kids profiles (default: false)
   */
  createNewProfileViaUI(profileName: string, gender: string = 'Žena', birthYear: string = '2000', profileType: 'adult' | 'kids' = 'adult', withPin: boolean = false) {
    cy.log(`Creating ${profileType} profile via UI: ${profileName}`);
    
    // Step 1: Click appropriate profile creation button
    cy.log(`Step 1: Clicking ${profileType} profile creation button...`);
    if (profileType === 'kids') {
      this.elements.profile.buttonCreateKidsProfile().click();
    } else {
      this.elements.profile.buttonCreateProfile().click();
    }
    
    // Step 2: Fill in profile name
    cy.log(`Step 2: Entering profile name: ${profileName}`);
    this.elements.profile.inputProfileName().clear().type(profileName);
    
    // Step 3: Select gender
    cy.log(`Step 3: Selecting gender: ${gender}`);
    this.elements.profile.selectGender().click();
    this.elements.profile.selectGenderOption(gender).click();
    
    // Step 4: Select birth year
    cy.log(`Step 4: Selecting birth year: ${birthYear}`);
    this.elements.profile.selectBirthYear().click();
    this.elements.profile.selectBirthYearOption(birthYear).click();
    
    // Step 5: Handle PIN setup for all profiles (adults and kids)
    if (withPin) {
      cy.log('Step 5: Setting up PIN...');
      cy.get('a.form-link').contains('PIN kód').click();
      cy.wait(2000);
      
      // Enter PIN (1234) - 4 separate numeric inputs
      cy.log('Entering PIN code: 1234');
      cy.get('div.pin-code input[inputmode="numeric"]').eq(0).type('1');
      cy.get('div.pin-code input[inputmode="numeric"]').eq(1).type('2');
      cy.get('div.pin-code input[inputmode="numeric"]').eq(2).type('3');
      cy.get('div.pin-code input[inputmode="numeric"]').eq(3).type('4');
      
      // PIN auto-saves, wait for it to process and return to form
      cy.wait(2000);
      
      cy.log('PIN setup completed (auto-saved)');
    } else {
      cy.log('Step 5: Skipping PIN setup (withPin = false)');
    }
    
    // Step 6: Confirm creation (if there's a create button)
    cy.log('Step 6: Confirming profile creation...');
    // Look for any create/save button
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Vytvořit")').length > 0) {
        cy.contains('button', 'Vytvořit').click();
      } else if ($body.find('button:contains("Uložit")').length > 0) {
        cy.contains('button', 'Uložit').click();
      } else if ($body.find('button:contains("Potvrdit")').length > 0) {
        cy.contains('button', 'Potvrdit').click();
      }
    });
    
    cy.log(`✅ ${profileType} profile creation completed for: ${profileName}`);
  }

  /**
   * Navigate to profile management and select a specific profile
   * @param profileName - The name of the profile to select
   */
  navigateToProfileManagement(profileName: string) {
    cy.log(`🔧 Navigating to profile management for: ${profileName}`);
    
    // Step 1: Click "Spravovat profily" (Manage Profiles) button
    cy.log('👆 Step 1: Clicking "Spravovat profily" button...');
    this.elements.profile.buttonManageProfiles()
      .should('be.visible')
      .click();
    
    // Step 2: Wait for profile management page to load
    cy.wait(2000);
    
    // Step 3: Click on the specific profile by name
    cy.log(`👤 Step 2: Selecting profile: ${profileName}`);
    this.elements.profile.profileItemByName(profileName)
      .should('be.visible')
      .click();
    
    // Step 4: Handle PIN or password confirmation if required (appears after clicking profile)
    cy.wait(5000);
    cy.log('Step 3: Checking for PIN or password confirmation...');
    cy.get('body').then(($body) => {
      if ($body.find('h1:contains("Pro správu zadejte PIN profilu")').length > 0) {
        cy.log('PIN confirmation required - entering PIN...');
        cy.get('div.pin-code input[inputmode="numeric"]').eq(0).type('1');
        cy.get('div.pin-code input[inputmode="numeric"]').eq(1).type('2');
        cy.get('div.pin-code input[inputmode="numeric"]').eq(2).type('3');
        cy.get('div.pin-code input[inputmode="numeric"]').eq(3).type('4');
        cy.wait(2000);
      } else if ($body.find('h1:contains("Pro správu profilu zadejte heslo k účtu")').length > 0) {
        cy.log('Password confirmation required - entering password...');
        const testPassword = Cypress.env('TEST_PASSWORD') || 'testPassword123';
        this.elements.profile.inputPasswordConfirmation().type(testPassword);
        this.elements.profile.buttonConfirmPassword().click();
        cy.wait(2000);
      } else {
        cy.log('No PIN or password confirmation needed');
      }
    });
    
    cy.log(`Successfully navigated to profile management for: ${profileName}`);
  }

  /**
   * Delete the selected profile via UI
   * @param profileName - The name of the profile being deleted (for logging)
   */
  deleteProfileViaUI(profileName: string) {
    cy.log(`🗑️ Deleting profile via UI: ${profileName}`);
    
    // Step 1: Click "Smazat profil" 
    cy.log('👆 Step 1: Clicking "Smazat profil"...');
    this.elements.profile.linkDeleteProfile().click();
    
    // Step 2: Wait for confirmation dialog
    cy.wait(1000);
    
    // Step 3: Handle password confirmation popup that appears after clicking delete
    cy.log('🔐 Step 3: Checking for password confirmation popup...');
    cy.get('body').then(($body) => {
      if ($body.find('h1:contains("Pro správu profilu zadejte heslo k účtu")').length > 0) {
        cy.log('🔑 Password confirmation required for deletion - entering password...');
        const testPassword = Cypress.env('TEST_PASSWORD') || 'testPassword123';
        cy.get('input[type="password"]').type(testPassword);
        cy.get('button.button.primary:contains("Potvrdit")').click();
        cy.wait(2000);
      } else {
        cy.log('✅ No password confirmation needed for deletion');
      }
    });
    
    // Step 4: Handle final deletion confirmation
    cy.log('✅ Step 4: Looking for final deletion confirmation...');
    cy.get('body').then(($body) => {
      if ($body.find('button.button.default:contains("Smazat profil")').length > 0) {
        this.elements.profile.buttonConfirmDeleteProfile().click();
      } else if ($body.find('button:contains("Smazat profil")').length > 0) {
        cy.get('button').contains('Smazat profil').click();
      } else {
        cy.log('⚠️ No confirmation button found - profile may have been deleted already');
      }
    });
    
    // Step 5: Wait for deletion to complete
    cy.wait(2000);
    
    cy.log(`✅ Profile deletion completed for: ${profileName}`);
  }

  /**
   * Verify that a profile with the given name no longer exists
   * @param profileName - The name of the profile to check
   */
  verifyProfileDeleted(profileName: string) {
    cy.log(`🔍 Verifying profile ${profileName} was deleted...`);
    
    // Check that we're back on the profile selection page "Kdo se dívá?"
    this.verifyProfileSelectionPage();
    
    // Verify the profile name no longer appears in the profile list
    cy.get('body').then(($body) => {
      if ($body.find(`button:contains("${profileName}")`).length > 0) {
        cy.log(`❌ Profile ${profileName} still exists - deletion failed`);
        throw new Error(`Profile ${profileName} was not deleted successfully`);
      } else {
        cy.log(`✅ Profile ${profileName} successfully deleted - not found in profile list`);
      }
    });
  }

  /**
   * Create a new user profile via API with simple parameters
   * @param profileName - The name of the profile to create
   * @param email - The email to use for authentication
   * @param password - The password to use for authentication
   * @returns Profile ULID
   */
  createProfileViaAPI(profileName: string, email?: string, password?: string) {
    return GatewayApi.createSimpleProfile(profileName, email, password);
  }

  /**
   * Create a new user profile via API with detailed options
   * @param profileName - The name of the profile to create
   * @param options - Profile creation options
   * @param email - The email to use for authentication
   * @param password - The password to use for authentication
   * @returns Profile ULID
   */
  createAdvancedProfileViaAPI(
    profileName: string, 
    options: {
      avatarId?: string;
      gender?: 'M' | 'F';
      birthYear?: number;
      ageRating?: '0_11' | null;
    },
    email?: string, 
    password?: string
  ) {
    return GatewayApi.createProfile(profileName, options, email, password);
  }
  
}

export default new IprimaPage();