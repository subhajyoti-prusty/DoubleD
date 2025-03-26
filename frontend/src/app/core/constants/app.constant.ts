import { environment } from "../../../environments/environment"

export const AppEnvConfigConstant = {
    PRODUCTION: environment.production,
    APP_NAME: environment.appName,
    APP_ID: environment.appId,
    APP_VERSION: environment.appVersion,
    APP_LOGO_PATH: environment.appLogoPath,
    APP_SERVER_LOGO_NAME: environment.appServerLogoName,
    PORTAL_URL: environment.portalURL,
    APP_BASE_URL: environment.appBaseURL,
    API_BASE_URL: environment.apiBaseURL
}

export const ContactDetailsConstant = {
    EMAIL: environment.contactDetails.email,
    MOBILE: environment.contactDetails.mobile,
    WEBSITE: environment.contactDetails.website
}