import { IUserProfile } from "../../core/interface/auth/user-profile.interface";

export interface ILoginModel {
    userName: string;
    password: string;
}

export interface ILoginResponse {
    data: ILoginSuccess,
    message: string,
    status: string
    status_code: number
}

export interface ILoginSuccess {
    id_token: string
    expires_in: number
    refresh_token: string
    refresh_expires_in: number,
    expires_at: number,
    refresh_expires_at: number,
    userInfo: IUserProfile
}