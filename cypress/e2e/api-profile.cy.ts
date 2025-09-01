import IprimaPage from "../page/IprimaPage";
import GatewayApi from "../api/GatewayApi";

describe('API - Profile Tests', () => {
  const testEmail = Cypress.env('TEST_EMAIL') || 'test@example.com';
  const testPassword = Cypress.env('TEST_PASSWORD') || 'testPassword123';
  const profileName = `TestProfile_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  let createdProfileUlid: string | null;
  let initialProfileCount: number;

  before(() => {
    // Validate test credentials are available
    if (!testEmail || !testPassword) {
      throw new Error('TEST_EMAIL and TEST_PASSWORD environment variables are required');
    }
  });

  beforeEach(() => {
    GatewayApi.intercepts.POST_Request();
    createdProfileUlid = null;
  });

  afterEach(() => {
    // Comprehensive cleanup: Delete created profile after test
    if (createdProfileUlid) {
      cy.log(`Cleaning up profile: ${createdProfileUlid}`);
      cy.then(() => {
        return GatewayApi.removeProfile(createdProfileUlid!, testEmail, testPassword);
      });
      cy.log(`Profile cleanup attempted for: ${createdProfileUlid}`);
    }
  });

  it('should create profile, verify it exists, then delete it', () => {
    // Step 1: Get baseline profile count  
    cy.log('Step 1: Getting baseline profile count...');
    cy.then(() => {
      return GatewayApi.getProfileUlIds(testEmail, testPassword);
    }).then((initialProfiles) => {
      initialProfileCount = initialProfiles.length;
      cy.log(`Found ${initialProfileCount} existing profiles`);
      expect(initialProfiles, 'Initial profiles should be an array').to.be.an('array');

      // Step 2: Create new profile
      cy.log(`Step 2: Creating new profile '${profileName}'...`);
      cy.then(() => {
        return GatewayApi.createSimpleProfile(profileName, testEmail, testPassword);
      }).then((createdUlid) => {
        createdProfileUlid = createdUlid;
        cy.log(`Profile created with ULID: ${createdUlid}`);
        
        // Enhanced assertions
        expect(createdUlid, 'Profile ULID should exist').to.exist;
        expect(createdUlid, 'Profile ULID should be a string').to.be.a('string');
        expect(createdUlid.length, 'Profile ULID should have reasonable length').to.be.greaterThan(10);

        // Step 3: Verify profile exists
        cy.log('Step 3: Verifying profile exists in profile list...');
        cy.then(() => {
          return GatewayApi.getProfileUlIds(testEmail, testPassword);
        }).then((updatedProfiles) => {
          cy.log(`Now found ${updatedProfiles.length} profiles (expected ${initialProfileCount + 1})`);
          
          expect(updatedProfiles, 'Updated profiles should be an array').to.be.an('array');
          expect(updatedProfiles, 'Profile should exist in updated list').to.include(createdProfileUlid);
          expect(updatedProfiles.length, 'Profile count should increase by 1').to.equal(initialProfileCount + 1);

          // Step 4: Delete the profile
          cy.log('Step 4: Deleting created profile...');
          cy.then(() => {
            return GatewayApi.removeProfile(createdProfileUlid!, testEmail, testPassword);
          }).then(() => {
            cy.log('Profile deletion request completed');

            // Step 5: Verify profile is deleted
            cy.log('Step 5: Verifying profile was deleted...');
            cy.then(() => {
              return GatewayApi.getProfileUlIds(testEmail, testPassword);
            }).then((finalProfiles) => {
              cy.log(`Final profile count: ${finalProfiles.length} (expected ${initialProfileCount})`);
              
              expect(finalProfiles, 'Final profiles should be an array').to.be.an('array');
              expect(finalProfiles, 'Deleted profile should not exist').to.not.include(createdProfileUlid);
              expect(finalProfiles.length, 'Profile count should return to initial count').to.equal(initialProfileCount);
              
              cy.log('Profile creation and deletion test completed successfully!');
              createdProfileUlid = null;
            });
          });
        });
      });
    });
  });
});

describe('Comprehensive Profile Type Testing', () => {
  const testEmail = Cypress.env('TEST_EMAIL') || 'test@example.com';
  const testPassword = Cypress.env('TEST_PASSWORD') || 'testPassword123';
  let testData: any;
  let createdProfiles: string[] = [];

  before(() => {
    // Load test data
    cy.fixture('testData').then((data) => {
      testData = data;
    });
    
    // Validate test credentials
    if (!testEmail || !testPassword) {
      throw new Error('TEST_EMAIL and TEST_PASSWORD environment variables are required');
    }
  });

  beforeEach(() => {
    GatewayApi.intercepts.POST_Request();
    createdProfiles = [];
  });

  afterEach(() => {
    // Clean up all created profiles
    if (createdProfiles.length > 0) {
      cy.log(`Cleaning up ${createdProfiles.length} test profiles...`);
      createdProfiles.forEach((profileUlid) => {
        cy.then(() => {
          return GatewayApi.removeProfile(profileUlid, testEmail, testPassword);
        });
        cy.log(`Profile cleanup attempted for: ${profileUlid}`);
      });
    }
  });

  it('should create and verify Adult Male profile', () => {
    const profileData = testData.profiles.adult_male;
    const profileName = `${profileData.name}_${Date.now()}`;
    
    cy.log('Testing Adult Male Profile Creation...');
    
    cy.then(() => {
      return GatewayApi.createProfile(profileName, {
        avatarId: profileData.avatarId,
        gender: profileData.gender,
        birthYear: profileData.birthYear,
        ageRating: profileData.ageRating
      }, testEmail, testPassword);
    }).then((createdUlid) => {
      createdProfiles.push(createdUlid);
      
      expect(createdUlid, 'Adult Male profile should be created').to.exist;
      expect(createdUlid, 'Profile ULID should be a string').to.be.a('string');
      
      cy.log(`Adult Male profile created: ${createdUlid}`);
    });
  });

  it('should create and verify Adult Female profile', () => {
    const profileData = testData.profiles.adult_female;
    const profileName = `${profileData.name}_${Date.now()}`;
    
    cy.log('Testing Adult Female Profile Creation...');
    
    cy.then(() => {
      return GatewayApi.createProfile(profileName, {
        avatarId: profileData.avatarId,
        gender: profileData.gender,
        birthYear: profileData.birthYear,
        ageRating: profileData.ageRating
      }, testEmail, testPassword);
    }).then((createdUlid) => {
      createdProfiles.push(createdUlid);
      
      expect(createdUlid, 'Adult Female profile should be created').to.exist;
      expect(createdUlid, 'Profile ULID should be a string').to.be.a('string');
      
      cy.log(`Adult Female profile created: ${createdUlid}`);
    });
  });

  it('should create and verify Kid Male profile', () => {
    const profileData = testData.profiles.kid_male;
    const profileName = `${profileData.name}_${Date.now()}`;
    
    cy.log('Testing Kid Male Profile Creation...');
    
    cy.then(() => {
      return GatewayApi.createProfile(profileName, {
        avatarId: profileData.avatarId,
        gender: profileData.gender,
        birthYear: profileData.birthYear,
        ageRating: profileData.ageRating
      }, testEmail, testPassword);
    }).then((createdUlid) => {
      createdProfiles.push(createdUlid);
      
      expect(createdUlid, 'Kid Male profile should be created').to.exist;
      expect(createdUlid, 'Profile ULID should be a string').to.be.a('string');
      
      cy.log(`Kid Male profile created: ${createdUlid}`);
    });
  });

  it('should create and verify Kid Female profile', () => {
    const profileData = testData.profiles.kid_female;
    const profileName = `${profileData.name}_${Date.now()}`;
    
    cy.log('Testing Kid Female Profile Creation...');
    
    cy.then(() => {
      return GatewayApi.createProfile(profileName, {
        avatarId: profileData.avatarId,
        gender: profileData.gender,
        birthYear: profileData.birthYear,
        ageRating: profileData.ageRating
      }, testEmail, testPassword);
    }).then((createdUlid) => {
      createdProfiles.push(createdUlid);
      
      expect(createdUlid, 'Kid Female profile should be created').to.exist;
      expect(createdUlid, 'Profile ULID should be a string').to.be.a('string');
      
      cy.log(`Kid Female profile created: ${createdUlid}`);
    });
  });

  it('should create all profile types and verify they exist in profile list', () => {
    cy.log('Creating all profile types for comprehensive verification...');
    
    let initialProfileCount: number;
    
    // Get initial profile count
    cy.then(() => {
      return GatewayApi.getProfileUlIds(testEmail, testPassword);
    }).then((initialProfiles) => {
      initialProfileCount = initialProfiles.length;
      cy.log(`Initial profile count: ${initialProfileCount}`);
      
      // Create Adult Male
      const adultMaleData = testData.profiles.adult_male;
      const adultMaleName = `${adultMaleData.name}_${Date.now()}_AM`;
      cy.log('Creating Adult Male profile...');
      
      cy.then(() => {
        return GatewayApi.createProfile(adultMaleName, {
          avatarId: adultMaleData.avatarId,
          gender: adultMaleData.gender,
          birthYear: adultMaleData.birthYear,
          ageRating: adultMaleData.ageRating
        }, testEmail, testPassword);
      }).then((ulid1) => {
        createdProfiles.push(ulid1);
        cy.log(`Adult Male created: ${ulid1}`);
        
        // Create Adult Female
        const adultFemaleData = testData.profiles.adult_female;
        const adultFemaleName = `${adultFemaleData.name}_${Date.now()}_AF`;
        cy.log('Creating Adult Female profile...');
        
        cy.then(() => {
          return GatewayApi.createProfile(adultFemaleName, {
            avatarId: adultFemaleData.avatarId,
            gender: adultFemaleData.gender,
            birthYear: adultFemaleData.birthYear,
            ageRating: adultFemaleData.ageRating
          }, testEmail, testPassword);
        }).then((ulid2) => {
          createdProfiles.push(ulid2);
          cy.log(`Adult Female created: ${ulid2}`);
          
          // Create Kid Male
          const kidMaleData = testData.profiles.kid_male;
          const kidMaleName = `${kidMaleData.name}_${Date.now()}_KM`;
          cy.log('Creating Kid Male profile...');
          
          cy.then(() => {
            return GatewayApi.createProfile(kidMaleName, {
              avatarId: kidMaleData.avatarId,
              gender: kidMaleData.gender,
              birthYear: kidMaleData.birthYear,
              ageRating: kidMaleData.ageRating
            }, testEmail, testPassword);
          }).then((ulid3) => {
            createdProfiles.push(ulid3);
            cy.log(`Kid Male created: ${ulid3}`);
            
            // Create Kid Female
            const kidFemaleData = testData.profiles.kid_female;
            const kidFemaleName = `${kidFemaleData.name}_${Date.now()}_KF`;
            cy.log('Creating Kid Female profile...');
            
            cy.then(() => {
              return GatewayApi.createProfile(kidFemaleName, {
                avatarId: kidFemaleData.avatarId,
                gender: kidFemaleData.gender,
                birthYear: kidFemaleData.birthYear,
                ageRating: kidFemaleData.ageRating
              }, testEmail, testPassword);
            }).then((ulid4) => {
              createdProfiles.push(ulid4);
              cy.log(`Kid Female created: ${ulid4}`);
              
              // Verify all profiles exist
              cy.log('Verifying all profiles exist in profile list...');
              cy.then(() => {
                return GatewayApi.getProfileUlIds(testEmail, testPassword);
              }).then((updatedProfiles) => {
                cy.log(`Final profile count: ${updatedProfiles.length} (expected ${initialProfileCount + 4})`);
                
                // Verify all profiles are in the list
                [ulid1, ulid2, ulid3, ulid4].forEach((profileUlid) => {
                  expect(updatedProfiles, `Profile ${profileUlid} should exist in list`).to.include(profileUlid);
                });
                
                expect(updatedProfiles.length, 'Total profile count should increase by 4').to.equal(initialProfileCount + 4);
                
                cy.log('All profile types created and verified successfully!');
              });
            });
          });
        });
      });
    });
  });

  it('should create and verify Adult Male profile with PIN', () => {
    const profileData = testData.profiles.adult_male;
    const profileName = `${profileData.name}_PIN_${Date.now()}`;
    
    cy.log('Testing Adult Male Profile Creation with PIN...');
    
    cy.then(() => {
      return GatewayApi.createProfile(profileName, {
        avatarId: profileData.avatarId,
        gender: profileData.gender,
        birthYear: profileData.birthYear,
        ageRating: profileData.ageRating,
        pin: "1234",
        updatePin: true
      }, testEmail, testPassword);
    }).then((createdUlid) => {
      createdProfiles.push(createdUlid);
      
      expect(createdUlid, 'Adult Male profile with PIN should be created').to.exist;
      expect(createdUlid, 'Profile ULID should be a string').to.be.a('string');
      
      cy.log(`Adult Male profile with PIN created: ${createdUlid}`);
    });
  });

  it('should create and verify Adult Female profile with PIN', () => {
    const profileData = testData.profiles.adult_female;
    const profileName = `${profileData.name}_PIN_${Date.now()}`;
    
    cy.log('Testing Adult Female Profile Creation with PIN...');
    
    cy.then(() => {
      return GatewayApi.createProfile(profileName, {
        avatarId: profileData.avatarId,
        gender: profileData.gender,
        birthYear: profileData.birthYear,
        ageRating: profileData.ageRating,
        pin: "1234",
        updatePin: true
      }, testEmail, testPassword);
    }).then((createdUlid) => {
      createdProfiles.push(createdUlid);
      
      expect(createdUlid, 'Adult Female profile with PIN should be created').to.exist;
      expect(createdUlid, 'Profile ULID should be a string').to.be.a('string');
      
      cy.log(`Adult Female profile with PIN created: ${createdUlid}`);
    });
  });

  it('should create and verify Kid Male profile with PIN', () => {
    const profileData = testData.profiles.kid_male;
    const profileName = `${profileData.name}_PIN_${Date.now()}`;
    
    cy.log('Testing Kid Male Profile Creation with PIN...');
    
    cy.then(() => {
      return GatewayApi.createProfile(profileName, {
        avatarId: profileData.avatarId,
        gender: profileData.gender,
        birthYear: profileData.birthYear,
        ageRating: profileData.ageRating,
        pin: "1234",
        updatePin: true
      }, testEmail, testPassword);
    }).then((createdUlid) => {
      createdProfiles.push(createdUlid);
      
      expect(createdUlid, 'Kid Male profile with PIN should be created').to.exist;
      expect(createdUlid, 'Profile ULID should be a string').to.be.a('string');
      
      cy.log(`Kid Male profile with PIN created: ${createdUlid}`);
    });
  });

  it('should create and verify Kid Female profile with PIN', () => {
    const profileData = testData.profiles.kid_female;
    const profileName = `${profileData.name}_PIN_${Date.now()}`;
    
    cy.log('Testing Kid Female Profile Creation with PIN...');
    
    cy.then(() => {
      return GatewayApi.createProfile(profileName, {
        avatarId: profileData.avatarId,
        gender: profileData.gender,
        birthYear: profileData.birthYear,
        ageRating: profileData.ageRating,
        pin: "1234",
        updatePin: true
      }, testEmail, testPassword);
    }).then((createdUlid) => {
      createdProfiles.push(createdUlid);
      
      expect(createdUlid, 'Kid Female profile with PIN should be created').to.exist;
      expect(createdUlid, 'Profile ULID should be a string').to.be.a('string');
      
      cy.log(`Kid Female profile with PIN created: ${createdUlid}`);
    });
  });
});