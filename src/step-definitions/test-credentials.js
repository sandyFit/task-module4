/**
 * Generate test credentials for each run to avoid conflicts after signing up and for security
 * purposes
 */
class TestCredentials {
    constructor() {
        // Generating unique id
        this.testRunId = Date.now();
        this.randomSuffix = Math.floor(Math.random() * 1000);

        // Credentials for signup
        this.newUser = {
            firstName: 'John',
            lastName: 'Doe',
            dob: '2000-01-01',
            street: 'Siempreviva Avenue',
            postalCode: '666666',
            city: 'Springfield',
            state: 'Delaware',
            country: 'United States of America (the)',
            phone: '9123456789',
            email: `test${this.testRunId}${this.randomSuffix}@example.com`,
            password: 'PassWord$%391'
        };

        this.existingUser = {
            email: `test${this.testRunId}${this.randomSuffix}@example.com`,
            password: 'PassWord$%391'
        };

        this.currentPassword = 'PassWord$%391';

        this.newPassword = 'New_Pa$$2025';

        this.signupCompleted = false;
    }

    getNewUserCredentials() {
        return this.newUser;
    }

    getExistingUserCredentials() {
        return this.existingUser;
    }

    getCurrentPassword() {
        return this.currentPassword;
    }

    getNewPassword() {
        return this.newPassword;
    }

    markSignupCompleted() {
        this.signupCompleted = true;
        console.log('✓ Signup marked as completed');
    }

    isSignupCompleted() {
        return this.signupCompleted;
    }

    logCredentials() {
        console.log('=== TEST CREDENTIALS ===');
        console.log('New User Email:', this.newUser.email);
        console.log('Existing User Email:', this.existingUser.email);
        console.log('Signup Completed:', this.signupCompleted);
        console.log('=======================');
    }
}

export const testCredentials = new TestCredentials();
