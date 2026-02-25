import apiClient from '../../api/apiClient';
import { AUTH_ROUTES, ADMIN_AUTH_ROUTES } from '../../utils/constants/apiRoutes';

/* ── Payload types ──────────────────────────────────────────── */
export interface LoginPayload {
    email: string;
    password: string;
}

export interface SignupPayload {
    name: string;
    email: string;
    password: string;
}

export interface SendOtpPayload {
    email: string;
}

export interface VerifyOtpPayload {
    name: string;
    email: string;
    password: string;
    otp: string;
}

export interface ResendOtpPayload {
    email: string;
}

/* ── User Auth ──────────────────────────────────────────────── */
export const authService = {
    login: (payload: LoginPayload) =>
        apiClient.post(AUTH_ROUTES.LOGIN, payload),

    signup: (payload: SignupPayload) =>
        apiClient.post(AUTH_ROUTES.SIGNUP, payload),

    sendOtp: (payload: SendOtpPayload) =>
        apiClient.post(AUTH_ROUTES.SEND_OTP, payload),

    verifyOtp: (payload: VerifyOtpPayload) =>
        apiClient.post(AUTH_ROUTES.VERIFY_OTP, payload),

    resendOtp: (payload: ResendOtpPayload) =>
        apiClient.post(AUTH_ROUTES.RESEND_OTP, payload),

    logout: () =>
        apiClient.post(AUTH_ROUTES.LOGOUT),

    getMe: () =>
        apiClient.get(AUTH_ROUTES.ME),
};

/* ── Admin Auth ─────────────────────────────────────────────── */
export const adminAuthService = {
    login: (payload: LoginPayload) =>
        apiClient.post(ADMIN_AUTH_ROUTES.LOGIN, payload),

    logout: () =>
        apiClient.post(ADMIN_AUTH_ROUTES.LOGOUT),
};

