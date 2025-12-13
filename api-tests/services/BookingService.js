const axios = require('axios');
const config = require('../config/config');

class BookingService {
    constructor() {
        this.client = axios.create({
            baseURL: config.baseURL,
            timeout: config.timeout,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        // Track request start time for response time assertions
        this.client.interceptors.request.use((requiestConfig) => {
            requiestConfig.metadata = { startTime: Date.now() };
            return requiestConfig;
        });

        // Calculate response time
        this.client.interceptors.response.use((response) => {
            response.config.metadata.endTime = Date.now();
            response.duration = response.config.metadata.endTime - response.config.metadata.startTime;
            return response;
        });
    }

    /**
     * Create authentication token for protected endpoints
     * @returns {Promise} Response with token
     */
    async createAuthToken() {
        try {
            const response = await this.client.post(config.endpoints.auth, {
                username: config.auth.username,
                password: config.auth.password
            });
            return response;
        } catch (error) {
            throw this._handleError(error);
        }
    }

    /**
     * Get all booking IDs with optional filters
     * @param {Object} filters - Query parameters (firstname, lastname, checkin, checkout)
     * @returns {Promise} Response with booking IDs array
     */
    async getAllBookingIds(filters = {}) {
        try {
            const response = await this.client.get(config.endpoints.booking, {
                params: filters
            });
            return response;
        } catch (error) {
            throw this._handleError(error);
        }
    };

    /**
     * Create a new booking
     * @param {Object} bookingData - Booking details
     * @returns {Promise} Response with created booking
     */
    async createBooking(bookingData) {
        try {
            const response = await this.client.post(config.endpoints.booking, bookingData);
            return response;
        } catch (error) {
            throw this._handleError(error);
        }
    }

    /**
     * Error handler for consistent error format
     * @private
     * @param {Error} error - Axios error
     * @returns {Error} Formatted error
     */
    _handleError(error) {
        if (error.response) {
            // Server responded with error status
            const err = new Error(`API Error: ${error.response.status} - ${error.response.statusText}`);
            err.status = error.response.status;
            err.data = error.response.data;
            return err;
        } else if (error.request) {
            // Request made but no response
            return new Error('No response from server');
        } else {
            // Error in request setup
            return error;
        }
    }
}
module.exports = BookingService;
