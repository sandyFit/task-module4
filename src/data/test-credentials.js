import { getCurrentPassword as readStoredPassword } from '../helpers/password-manager.js';

let existingUser = null;     
let lastGeneratedPassword = null; 
let signupCompleted = false; 

export const testCredentials = {

    // ---------- USER CREATION ----------
    getNewUserCredentials() {
        const timestamp = Date.now();

        return {
            firstName: 'John',
            lastName: 'Doe',
            dob: '2000-01-01',
            street: 'Siempreviva Avenue',
            postalCode: '666666',
            city: 'Springfield',
            state: 'Delaware',
            country: 'United States of America (the)',
            phone: '9123456789',
            email: `user_${timestamp}@example.com`,
            password: this.getInitialPassword()
        };
    },

    getInitialPassword() {
        return 'PassWord$%391'; 
    },

    setExistingUserCredentials(creds) {
        existingUser = creds;
        // Reset password generation when new user is set
        lastGeneratedPassword = null;
        console.log('✅ User credentials set, password cache cleared');
    },

    getExistingUserCredentials() {
        return existingUser;
    },

    // ---------- SIGNUP TRACKING ----------
    markSignupCompleted() {
        signupCompleted = true;
        console.log('✅ Signup marked as completed');
    },

    isSignupCompleted() {
        return signupCompleted;
    },

    resetSignupStatus() {
        signupCompleted = false;
        lastGeneratedPassword = null;
        console.log('🔄 Signup status and password cache reset');
    },

    // ---------- PASSWORD MANAGEMENT ----------
    getCurrentPassword() {
        const password = existingUser?.password || readStoredPassword();
        console.log('🔐 Getting current password:', password);
        return password;
    },

    generateNewPassword() {
        // Strong password that meets typical requirements:
        const randomPart = Math.random().toString(36).slice(2, 10); // 8 chars
        const password = `New${randomPart}@1A`;
        console.log('🆕 Generated new password:', password);
        return password;
    },

    getNewPassword() {
        if (!lastGeneratedPassword) {
            lastGeneratedPassword = this.generateNewPassword();
            console.log('💾 Cached new password for this password change session');
        } else {
            console.log('♻️ Reusing cached new password');
        }
        return lastGeneratedPassword;
    },

    updatePassword(newPassword) {
        if (!existingUser) {
            console.log("⚠️ Cannot update password: No existingUser stored!");
            return;
        }

        console.log(`🔄 Updating stored password from "${existingUser.password}" → "${newPassword}"`);
        existingUser.password = newPassword;

        // Reset cache
        lastGeneratedPassword = null;
        console.log('✅ Password updated and cache cleared for next change');
    },

    // Force reset password generation (useful for test cleanup)
    resetPasswordCache() {
        lastGeneratedPassword = null;
        console.log('🧹 Password generation cache cleared');
    },

    // ---------- LOGGING ----------
    logCredentials() {
        if (existingUser) {
            console.log('📧 Current test user:', existingUser.email);
            console.log('🔑 Current password:', existingUser.password);
            console.log('📊 Signup completed:', signupCompleted);
            console.log('💾 Cached new password:', lastGeneratedPassword || 'none');
        } else {
            console.log('📧 No test user created yet');
        }
    }
};

