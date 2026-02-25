
export const AUTH_ROUTES = {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    SEND_OTP: '/auth/send-otp',
    VERIFY_OTP: '/auth/verify-otp',
    RESEND_OTP: '/auth/resend-otp',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
} as const;

export const ADMIN_AUTH_ROUTES = {
    LOGIN: '/auth/admin/login',
    LOGOUT: '/auth/admin/logout',
} as const;
export const USER_ROUTES = {
    GET_ALL: '/admin/users',
    GET_BY_ID: (id: string) => `/admin/users/${id}`,
    UPDATE: (id: string) => `/admin/users/${id}`,
    DELETE: (id: string) => `/admin/users/${id}`,
    TOGGLE_STATUS: (id: string) => `/admin/users/${id}/status`,
} as const;

/* ── Inventory ──────────────────────────────────────────────── */
export const INVENTORY_ROUTES = {
    GET_ALL: '/inventory',
    GET_BY_ID: (id: string) => `/inventory/${id}`,
    CREATE: '/inventory',
    UPDATE: (id: string) => `/inventory/${id}`,
    DELETE: (id: string) => `/inventory/${id}`,
    LOW_STOCK: '/inventory/low-stock',
} as const;

/* ── Customers ──────────────────────────────────────────────── */
export const CUSTOMER_ROUTES = {
    GET_ALL: '/customers',
    GET_BY_ID: (id: string) => `/customers/${id}`,
    CREATE: '/customers',
    UPDATE: (id: string) => `/customers/${id}`,
    DELETE: (id: string) => `/customers/${id}`,
} as const;

/* ── Sales / Orders ─────────────────────────────────────────── */
export const SALES_ROUTES = {
    GET_ALL: '/sales',
    GET_BY_ID: (id: string) => `/sales/${id}`,
    CREATE: '/sales',
    UPDATE: (id: string) => `/sales/${id}`,
    DELETE: (id: string) => `/sales/${id}`,
} as const;

/* ── Reports ────────────────────────────────────────────────── */
export const REPORT_ROUTES = {
    SUMMARY: '/reports/summary',
    SALES: '/reports/sales',
    INVENTORY: '/reports/inventory',
    CUSTOMERS: '/reports/customers',
    CUSTOMER_LEDGER: (id: string) => `/reports/customer/${id}`,
} as const;
