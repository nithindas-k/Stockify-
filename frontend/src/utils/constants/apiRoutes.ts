
export const AUTH_ROUTES = {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
} as const;


export const INVENTORY_ROUTES = {
    GET_ALL: '/inventory',
    GET_BY_ID: (id: string) => `/inventory/${id}`,
    CREATE: '/inventory',
    UPDATE: (id: string) => `/inventory/${id}`,
    DELETE: (id: string) => `/inventory/${id}`,
    LOW_STOCK: '/inventory/low-stock',
} as const;

export const CUSTOMER_ROUTES = {
    GET_ALL: '/customers',
    GET_BY_ID: (id: string) => `/customers/${id}`,
    CREATE: '/customers',
    UPDATE: (id: string) => `/customers/${id}`,
    DELETE: (id: string) => `/customers/${id}`,
} as const;


export const SALES_ROUTES = {
    GET_ALL: '/sales',
    GET_BY_ID: (id: string) => `/sales/${id}`,
    CREATE: '/sales',
    UPDATE: (id: string) => `/sales/${id}`,
    DELETE: (id: string) => `/sales/${id}`,
} as const;

export const REPORT_ROUTES = {
    SUMMARY: '/reports/summary',
    SALES: '/reports/sales',
    INVENTORY: '/reports/inventory',
    CUSTOMERS: '/reports/customers',
    CUSTOMER_LEDGER: (id: string) => `/reports/customer/${id}`,
    EMAIL_REPORT: '/reports/email',
} as const;


export const DASHBOARD_ROUTES = {
    STATS: '/dashboard/stats',
} as const;
