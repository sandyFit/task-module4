const { expect } = require('chai');
const BookingService = require('../services/BookingService');
const config = require('../config/config');
const {
    bookingIdsArraySchema,
    createBookingResponseSchema,
    bookingSchema,
    updateBookingResponseSchema,
    authTokenSchema
} = require('../schemas/schemas');

describe(']Restful-Booker API Tests', () => {
    let bookingService;
    let authToken;
    let createBookingId;

    // Test data 
    const testBookingData = {
        firstname: 'John',
        lastname: 'Doe',
        totalprice: 250,
        depositpaid: true,
        bookingdates: {
            checkin: '2024-01-01',
            checkout: '2024-01-05'
        },
        additionalneeds: 'Breakfast'
    };

    const minimalBookingData = {
        firstname: 'Jane',
        lastname: 'Doe',
        totalprice: 200,
        depositpaid: false,
        bookingdates: {
            checkin: '2024-02-01',
            checkout: '2024-02-03'
        }
    };

    before(async () => {
        bookingService = new BookingService();

        // Create auth token 
        const tokenResponse = await bookingService.createAuthToken();
        authToken = tokenResponse.data.token;
    });

    /**
     * TEST SUITE 1: Get Booking IDs
     * Tests GET /booking endpoint with and without filters
     */
    describe('Get Booking IDs', () => {
        it('should get all booking IDs without filters', async () => {
            const response = await bookingService.getAllBookingIds();

            // Assertion 1: Status Code
            expect(response.status).to.equal(200);

            // Assertion 2: Response Time
            expect(response.duration).to.be.below(config.expectedResponseTime.medium);

            // Assertion 3: Response Headers
            expect(response.headers).to.have.property('content-type');
            expect(response.headers['content-type']).to.include('application/json');

            // Assertion 4: Response Body
            expect(response.data).to.be.an('array');
            expect(response.data.length).to.be.greaterThan(0);

            // Assertion 5: Schema Validation
            const { error } = bookingIdsArraySchema.validate(response.data);
            expect(error).to.be.undefined;
        });

        it('should filter booking IDs by firstname and lastname', async () => {
            const filters = {
                firstname: 'John',
                lastname: 'Smith'
            };

            const response = await bookingService.getAllBookingIds(filters);

            // Assertion 1: Status Code
            expect(response.status).to.equal(200);

            // Assertion 2: Response Time
            expect(response.duration).to.be.below(config.expectedResponseTime.medium);

            // Assertion 3: Response Headers
            expect(response.headers).to.have.property('content-type');
            expect(response.headers['content-type']).to.include('application/json');

            // Assertion 4: Response Body
            expect(response.data).to.be.an('array');

            // Assertion 5: Schema Validation
            const { error } = bookingIdsArraySchema.validate(response.data);
            expect(error).to.be.undefined;
        });
    });

    /**
     * TEST SUITE 2: Create Booking
     * Tests POST /booking endpoint
     */
    describe('Create Booking', () => {
        it('should create booking with complete data', async () => {
            const response = await bookingService.createBooking(testBookingData);

            // Store booking ID for later tests
            createdBookingId = response.data.bookingid;

            // Assertion 1: Status Code
            expect(response.status).to.equal(200);

            // Assertion 2: Response Time
            expect(response.duration).to.be.below(config.expectedResponseTime.medium);

            // Assertion 3: Response Headers
            expect(response.headers).to.have.property('content-type');
            expect(response.headers['content-type']).to.include('application/json');

            // Assertion 4: Response Body
            expect(response.data).to.have.property('bookingid');
            expect(response.data.bookingid).to.be.a('number');
            expect(response.data.booking.firstname).to.equal(testBookingData.firstname);
            expect(response.data.booking.lastname).to.equal(testBookingData.lastname);
            expect(response.data.booking.totalprice).to.equal(testBookingData.totalprice);

            // Assertion 5: Schema Validation
            const { error } = createBookingResponseSchema.validate(response.data);
            expect(error).to.be.undefined;
        });

        it('should create booking with minimal required data', async () => {
            const response = await bookingService.createBooking(minimalBookingData);

            // Assertion 1: Status Code
            expect(response.status).to.equal(200);

            // Assertion 2: Response Time
            expect(response.duration).to.be.below(config.expectedResponseTime.medium);

            // Assertion 3: Response Headers
            expect(response.headers).to.have.property('content-type');
            expect(response.headers['server']).to.exist;

            // Assertion 4: Response Body
            expect(response.data).to.have.property('bookingid');
            expect(response.data.booking.firstname).to.equal(minimalBookingData.firstname);
            expect(response.data.booking.depositpaid).to.equal(false);

            // Assertion 5: Schema Validation
            const { error } = createBookingResponseSchema.validate(response.data);
            expect(error).to.be.undefined;
        });
    });

});
