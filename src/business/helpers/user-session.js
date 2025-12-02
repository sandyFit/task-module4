import { logger } from '../../core/logger/logger.js';

// In-memory session tracking
let currentUser = null;
let isSignupComplete = false;

/**
 * Set the current test user
 */
export function setCurrentUser(userCredentials) {
    currentUser = userCredentials;
    logger.info(`Current user set: ${userCredentials.email}`);
}

/**
 * Get the current test user
 */
export function getCurrentUser() {
    if (!currentUser) {
        logger.warn('No current user set');
    }
    return currentUser;
}

/**
 * Clear current user session
 */
export function clearCurrentUser() {
    currentUser = null;
    isSignupComplete = false;
    logger.info('Current user session cleared');
}

/**
 * Mark signup as completed
 */
export function markSignupCompleted() {
    isSignupComplete = true;
    logger.success('Signup marked as completed');
}

/**
 * Check if signup is completed
 */
export function isSignupCompleted() {
    return isSignupComplete;
}

/**
 * Reset signup status
 */
export function resetSignupStatus() {
    isSignupComplete = false;
    logger.debug('Signup status reset');
}

/**
 * Get current user's email
 */
export function getCurrentUserEmail() {
    return currentUser?.email || null;
}

/**
 * Get current user's password
 */
export function getCurrentUserPassword() {
    return currentUser?.password || null;
}

/**
 * Update current user's password
 */
export function updateCurrentUserPassword(newPassword) {
    if (!currentUser) {
        logger.error('Cannot update password: No current user');
        return false;
    }
    currentUser.password = newPassword;
    logger.info('Current user password updated');
    return true;
}

/**
 * Log current session info
 */
export function logSessionInfo() {
    if (currentUser) {
        logger.info(`Session Info:
            Email: ${currentUser.email}
            Signup Completed: ${isSignupComplete}
        `);
    } else {
        logger.info('No active user session');
    }
}
