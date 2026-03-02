import apiClient from '../../api/apiClient';
import { AUTH_ROUTES } from '../../utils/constants/apiRoutes';

export interface LoginPayload {
    email: string;
    password: string;
}

export interface SignupPayload {
    name: string;
    email: string;
    password: string;
}

export const authService = {
    login: (payload: LoginPayload) =>
        apiClient.post(AUTH_ROUTES.LOGIN, payload),

    signup: (payload: SignupPayload) =>
        apiClient.post(AUTH_ROUTES.SIGNUP, payload),


    logout: () =>
        apiClient.post(AUTH_ROUTES.LOGOUT),

    getMe: () =>
        apiClient.get(AUTH_ROUTES.ME),
};



