export const APP_MESSAGES = {
    SERVER_STARTED: 'Stockify server started on port',
    DB_CONNECTED: 'MongoDB connected successfully',
    DB_CONNECTION_ERROR: 'MongoDB connection error:',
    AUTH_SUCCESS: 'Login successful',
    AUTH_FAILED: 'Invalid credentials',
    UNAUTHORIZED: 'Unauthorized access',
    NOT_FOUND: 'Resource not found',
    SERVER_ERROR: 'Internal server error',
};

export const ROUTES = {
    AUTH: {
        ROOT: '/api/auth',
        LOGIN: '/login',
        REGISTER: '/register',
    },
    INVENTORY: {
        ROOT: '/api/inventory',
    },
    CUSTOMERS: {
        ROOT: '/api/customers',
    },
    SALES: {
        ROOT: '/api/sales',
    },
    REPORTS: {
        ROOT: '/api/reports',
    },
    NOTIFICATIONS: {
        ROOT: '/api/notifications',
    },
};
