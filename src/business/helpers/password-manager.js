import { logger } from '../core/logger/logger.js';

let currentPassword = '%InitialPassword$123';   

/**
 * Get current password
 */
export function getCurrentPassword() {
    logger.debug(`Current password: ${currentPassword.substring(0, 3)}***`);
    return currentPassword;
}

/**
 * Update the password (Profile > Change Password)
 */
export function updatePassword(newPassword) {
    logger.info('Updating current password in memory');
    currentPassword = newPassword;
    cachedNewPassword = null;
}

/**
 * Generate a new password
 */
export function generateNewPassword() {
    const randomPart = Math.random().toString(36).slice(2, 10);
    return `New${randomPart}@1A`;
}

/**
 * Reuse generated password in the same scenario
 */
export function getNewPassword() {
    if (!cachedNewPassword) {
        cachedNewPassword = generateNewPassword();
        logger.debug('Generated new password');
    }
    return cachedNewPassword;
}

/**
 * Reset between scenarios (optional)
 */
export function resetPassword() {
    currentPassword = '%InitialPassword$123';
    cachedNewPassword = null;
}
