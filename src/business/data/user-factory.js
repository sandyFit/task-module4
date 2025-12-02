/**
 * Create a new unique user
 */
export function createNewUser() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);

    return {
        firstName: 'John',
        lastName: `Doe${random}`,
        dob: '2000-01-01',
        street: 'Siempreviva Avenue',
        postalCode: '666666',
        city: 'Springfield',
        state: 'Delaware',
        country: 'United States of America (the)',
        phone: '9123456789',
        email: `user_${timestamp}@example.com`,
        password: `PassWord$%${random}`
    };
}

/**
 * Get existing registered user (credentials from the demo testing API website)
 */
export function getExistingUser() {
    return {
        email: 'customer@practicesoftwaretesting.com',
        password: 'welcome01'
    };
}

/**
 * Create invalid user data
 */
export function createInvalidUser() {
    return {
        email: 'invalid-email',
        password: '123'
    };
}

/**
 * Generate random password
 */
export function generateRandomPassword(length = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}
