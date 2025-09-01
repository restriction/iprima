/// <reference types="cypress" />

import GatewayApi from '../api/GatewayApi';

/**
 * Selects an option from a dropdown
 * @param dropdownName - The name of the dropdown
 * @param options - The options to select
 */
Cypress.Commands.add('selectDropdown', (dropdownName: string, options: string) => {
    cy.contains('.select-toggle', dropdownName).click();
    cy.contains('.select-option', options).click();
});

/**
 * Create a profile with enhanced logging and error handling
 */
Cypress.Commands.add('createProfile', (profileName: string, email?: string, password?: string) => {
  cy.log(`🏗️ Creating profile: ${profileName}`);
  
  return cy.then(() => {
    return GatewayApi.createProfile(profileName, email, password);
  }).then((profileUlid) => {
    cy.log(`✅ Profile created successfully: ${profileUlid}`);
    return profileUlid;
  });
});

/**
 * Clean up profile with comprehensive error handling
 */
Cypress.Commands.add('cleanupProfile', (profileUlid: string, email?: string, password?: string) => {
  if (!profileUlid) {
    cy.log('⚠️ No profile ULID provided for cleanup');
    return cy.wrap(null);
  }

  cy.log(`🧹 Cleaning up profile: ${profileUlid}`);
  
  return cy.then(() => {
    return GatewayApi.removeProfile(profileUlid, email, password);
  }).then(() => {
    cy.log(`✅ Profile ${profileUlid} cleaned up successfully`);
  }).catch((error) => {
    cy.log(`⚠️ Cleanup warning for ${profileUlid}: ${error.message}`);
  });
});

/**
 * Get current profile count
 */
Cypress.Commands.add('getProfileCount', (email?: string, password?: string) => {
  return cy.then(() => {
    return GatewayApi.getProfileUlIds(email, password);
  }).then((profiles) => {
    const count = profiles.length;
    cy.log(`📊 Current profile count: ${count}`);
    return count;
  });
});

/**
 * Verify profile exists in profile list
 */
Cypress.Commands.add('verifyProfileExists', (profileUlid: string, email?: string, password?: string) => {
  cy.log(`🔍 Verifying profile exists: ${profileUlid}`);
  
  return cy.then(() => {
    return GatewayApi.getProfileUlIds(email, password);
  }).then((profiles) => {
    expect(profiles, `Profile ${profileUlid} should exist in profile list`).to.include(profileUlid);
    cy.log(`✅ Profile ${profileUlid} verified to exist`);
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      selectDropdown(dropdownName: string, options: string): Chainable<void>;
      /**
       * Create a profile and automatically track it for cleanup
       * @param profileName - Name of the profile to create
       * @param email - Optional email (uses env default)
       * @param password - Optional password (uses env default)
       * @example cy.createProfile('TestProfile')
       */
      createProfile(profileName: string, email?: string, password?: string): Chainable<string>;

      /**
       * Clean up profile by ULID with error handling
       * @param profileUlid - ULID of profile to delete
       * @param email - Optional email (uses env default)
       * @param password - Optional password (uses env default)
       * @example cy.cleanupProfile('profile-ulid-123')
       */
      cleanupProfile(profileUlid: string, email?: string, password?: string): Chainable<void>;

      /**
       * Get profile count for baseline comparisons
       * @param email - Optional email (uses env default)
       * @param password - Optional password (uses env default)
       * @example cy.getProfileCount().then(count => expect(count).to.be.greaterThan(0))
       */
      getProfileCount(email?: string, password?: string): Chainable<number>;

      /**
       * Verify profile exists in profile list
       * @param profileUlid - ULID of profile to verify
       * @param email - Optional email (uses env default)
       * @param password - Optional password (uses env default)
       * @example cy.verifyProfileExists('profile-ulid-123')
       */
      verifyProfileExists(profileUlid: string, email?: string, password?: string): Chainable<void>;
    }
  }
}

export {};