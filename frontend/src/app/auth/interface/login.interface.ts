import { IUserProfile } from "../../core/interface/auth/user-profile.interface";

export interface ILoginModel {
    email: string;
    password: string;
}

export interface ILoginResponse {
    data: ILoginSuccess,
    message: string,
    status: string
    status_code: number
}

export interface ILoginSuccess {
    success: boolean;
    token: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
        skills?: string[];
        organization?: string;
        location?: string;
        phone?: string;
        isAvailable?: boolean;
    };
    message?: string;
}