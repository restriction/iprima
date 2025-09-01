class GatewayApi {
    BASE_URL: string;
    defaultEmail: string;
    defaultPassword: string;

    constructor() {
        this.BASE_URL = 'https://gateway-api.prod.iprima.cz/json-rpc/';
        this.defaultEmail = Cypress.env('TEST_EMAIL') || '';
        this.defaultPassword = Cypress.env('TEST_PASSWORD') || '';
    }
    
    intercepts = {
        POST_Request: () => cy.intercept('POST', this.BASE_URL).as('POST_Request'),
        GET_Request: () => cy.intercept('GET', this.BASE_URL).as('GET_Request'),
    }

    /**
     * Gets access token using OAuth2 password grant
     * @param email - user email
     * @param password - user password
     * @alias POST_GetAccessToken
     * @returns Promise<string> access token
     */
    getAccessToken(email: string = this.defaultEmail, password: string = this.defaultPassword): Cypress.Chainable<string> {
        if (!email || !password) {
            throw new Error('Email and password are required for authentication');
        }
        
        return cy.request({
            method: 'POST',
            url: `${this.BASE_URL}`,
            body: {
                jsonrpc: "2.0",
                method: "user.oauth2.token.password",
                params: {
                    clientId: "prima_sso",
                    grant_type: "password",
                    username: email,
                    password: password,
                    scope: ["email", "profile"],
                    insecure: false
                },
                id: "QA_e2e"
            },
            failOnStatusCode: false
        }).as('POST_GetAccessToken').then((response): string => {
            if (response.status !== 200) {
                throw new Error(`Authentication failed with status ${response.status}`);
            }
            if (!response.body?.result?.data?.accessToken) {
                throw new Error('Invalid response: access token not found');
            }
            return response.body.result.data.accessToken;
        });
    }

    /**
     * Returns array of UlIds for all user profiles
     * @param email - user email (optional)
     * @param password - user password (optional)
     * @alias POST_GetUserInfoLite
     * @returns Promise<string[]> array of profile ULIDs
     */
    getProfileUlIds(email?: string, password?: string): Cypress.Chainable<string[]> {
        return this.getAccessToken(email, password).then((accessToken: string) => {
            return cy.request({
                method: 'POST',
                url: `${this.BASE_URL}`,
                body: {
                    jsonrpc: '2.0',
                    method: 'user.user.info.lite.byAccessToken',
                    params: { _accessToken: accessToken },
                    id: 'QA_e2e',
                },
                failOnStatusCode: false
            }).as('POST_GetUserInfoLite').then((response): string[] => {
                if (response.status !== 200) {
                    throw new Error(`Failed to get profiles with status ${response.status}`);
                }
                const profiles = response.body?.result?.data?.profiles;
                if (!Array.isArray(profiles)) {
                    cy.log('Warning: No profiles found or invalid response structure');
                    return [];
                }
                return profiles.map((item: any) => item.ulid).filter(ulid => ulid);
            });
        });
    }

    /**
     * Gets detailed profile information including avatarIds
     * @param email - user email (optional)
     * @param password - user password (optional)
     */
    getProfileDetails(email?: string, password?: string) {
        return this.getAccessToken(email, password).then((accessToken: string) => {
            return cy.request({
                method: 'POST',
                url: `${this.BASE_URL}`,
                body: {
                    jsonrpc: '2.0',
                    method: 'user.user.info.lite.byAccessToken',
                    params: { _accessToken: accessToken },
                    id: 'QA_e2e',
                },
            }).as('POST_GetProfileDetails').its('body.result.data.profiles');
        });
    }

    /**
     * Creates a new user profile with comprehensive parameters
     * @param profileName - name of the profile to create
     * @param options - profile creation options
     * @param email - user email (optional, defaults to default email)
     * @param password - user password (optional, defaults to default password)
     * @alias POST_CreateProfile
     * @returns Promise<string> created profile ULID
     */
    createProfile(
        profileName: string, 
        options: {
            avatarId?: string;
            gender?: 'M' | 'F';
            birthYear?: number;
            ageRating?: '0_11' | null;
            pin?: string;
            updatePin?: boolean;
        } = {},
        email?: string, 
        password?: string
    ): Cypress.Chainable<string> {
        if (!profileName || profileName.trim() === '') {
            throw new Error('Profile name is required and cannot be empty');
        }
        
        // Default values
        const profileParams = {
            name: profileName.trim(),
            avatarId: options.avatarId || "01",
            gender: options.gender || "M",
            birthYear: options.birthYear || 2000,
            ageRating: options.ageRating || null
        };

        return this.getAccessToken(email, password).then((accessToken: string) => {
            const requestBody: any = {
                jsonrpc: "2.0",
                method: "user.user.profile.create",
                params: {
                    ...profileParams,
                    _accessToken: accessToken
                },
                id: "QA_e2e"
            };

            // Only add ageRating if it's explicitly set for kids
            if (profileParams.ageRating !== null) {
                requestBody.params.ageRating = profileParams.ageRating;
            }

            // Add PIN options if specified
            if (options.pin) {
                requestBody.params.pin = options.pin;
            }
            if (options.updatePin !== undefined) {
                requestBody.params.updatePin = options.updatePin;
            }

            cy.log(`Creating profile: ${profileName} (${profileParams.gender}, ${profileParams.birthYear}, ${profileParams.avatarId})`);

            return cy.request({
                method: 'POST',
                url: `${this.BASE_URL}`,
                body: requestBody,
                failOnStatusCode: false
            }).as('POST_CreateProfile').its('body.result.data.userProfileUlid');
        });
    }

    /**
     * Creates a new user profile with simple parameters (backward compatibility)
     * @param profileName - name of the profile to create
     * @param email - user email (optional, defaults to default email)
     * @param password - user password (optional, defaults to default password)
     * @returns Promise<string> created profile ULID
     */
    createSimpleProfile(profileName: string, email?: string, password?: string): Cypress.Chainable<string> {
        return this.createProfile(profileName, {}, email, password);
    }

    /**
     * Deletes user profile by ULID
     * @param profileUlid - ULID of profile to remove
     * @param email - user email (optional, defaults to default email)
     * @param password - user password (optional, defaults to default password)
     * @alias POST_RemoveProfile
     * @returns Promise<void>
     */
    removeProfile(profileUlid: string, email?: string, password?: string): Cypress.Chainable<any> {
        if (!profileUlid || profileUlid.trim() === '') {
            throw new Error('Profile ULID is required for deletion');
        }
        
        return this.getAccessToken(email, password).then((accessToken: string) => {
            return cy.request({
                method: 'POST',
                url: `${this.BASE_URL}`,
                body: {
                    jsonrpc: "2.0",
                    method: "user.user.profile.remove",
                    params: {
                        ulid: profileUlid.trim(),
                        _accessToken: accessToken
                    },
                    id: "QA_e2e"
                },
                failOnStatusCode: false
            }).as('POST_RemoveProfile').then((response) => {
                if (response.status !== 200) {
                    cy.log(`Warning: Profile deletion returned status ${response.status}`);
                }
                cy.log(`Profile ${profileUlid} deletion request completed`);
            });
        });
    }

}

export default new GatewayApi();