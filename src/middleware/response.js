import { NextResponse } from "next/server";

// /**
//  * Standard success response
//  * @param {number} statusCode - HTTP status code
//  * @param {string} message - Success message
//  * @param {any} [data] - Response data
//  * @param {Object} [metadata] - Additional metadata
//  * @param {Object} [headers] - Custom headers
//  * @returns {NextResponse}
//  */
export const successResponse = ( message = "Operation successful", data = null, statusCode = 200,metadata = null, headers = {}) => {
    const responseBody = {
        success: true,
        message,
        data,
        ...(metadata && { metadata })
    };

    return NextResponse.json(responseBody, {
        status: statusCode,
        headers
    });
};

// /**
//  * Standard failure response for business logic failures
//  * @param {number} statusCode - HTTP status code
//  * @param {string} message - Error message
//  * @param {any} [data] - Additional error data
//  * @param {Object} [metadata] - Additional metadata
//  * @param {Object} [headers] - Custom headers
//  * @returns {NextResponse}
//  */
export const failedResponse = ( message = "Operation failed", data = null,statusCode = 400, metadata = null, headers = {}) => {
    const responseBody = {
        success: false,
        message,
        data,
        ...(metadata && { metadata })
    };

    return NextResponse.json(responseBody, {
        status: statusCode,
        headers
    });
};

// /**
//  * Error response for server/validation errors
//  * @param {number} status - HTTP status code
//  * @param {string} message - Error message
//  * @param {any} [error] - Error details
//  * @param {string} [errorCode] - Custom error code
//  * @param {Object} [metadata] - Additional metadata
//  * @param {Object} [headers] - Custom headers
//  * @returns {NextResponse}
//  */
export const errorResponse = (message = "Internal server error", error = null, status = 500,  errorCode = null, metadata = null, headers = {}) => {
    const responseBody = {
        success: false,
        message,
        ...(error && { error }),
        ...(errorCode && { errorCode }),
        ...(metadata && { metadata })
    };

    // Log server errors (500+)
    if (status >= 500) {
        console.error("Server Error:", {
            message,
            error,
            errorCode,
            status
        });
    }

    return NextResponse.json(responseBody, {
        status,
        headers
    });
};

// Aliases for backward compatibility
export const ResponseSuccess = successResponse;
export const ResponseFailed = failedResponse;
export const ResponseFailedError = errorResponse;