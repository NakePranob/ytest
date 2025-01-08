import { defineStore } from 'pinia';
import type { 
    AuthState, 
    OTPType, 
    CodeVerificationType, 
    ForgotPasswordType, 
    ChangPasswordType, 
    NotiSuccessType, 
    PasswordPolicyType 
} from '~/types/auth-stores';

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => {
        return {
            formElementHight: 0,
            uri: '',
            refreshToken: '',
            hiddenPassword: true,
            pageView: '',
            otp: {
                email: '',
                password: '',
                challengeName: '',
                session: ''
            },
            codeVerification: {
                email: '',
                password: '',
                sessionId: '',
                code: ''
            },
            forgotPassword: {
                email: '',
                sessionId: ''
            },
            changPassword: {
                session: '',
                email: ''
            },
            notiSuccess: {
                isOpen: false,
                state: "",
                url: "",
                message: "",
                description: ""
            },
            passwordPolicy: {
                MinimumLength: 6,
                RequireUppercase: false,
                RequireLowercase: false,
                RequireSymbols: false,
                RequireNumbers: false,
            },
            passwordPolicyHeight: 36
        };
    },
    actions: {
        setFormElementHight(height: number) {
            this.formElementHight = height;
        },
        setRefreshToken(token: string) {
            this.refreshToken = token;
        },
        togglePasswordVisibility() {
            this.hiddenPassword = !this.hiddenPassword;
        },
        setPageView(view: string) {
            this.pageView = view;
        },
        setNotiSuccess(obj: NotiSuccessType) {
            this.notiSuccess = obj;
            console.log(this.notiSuccess);
        },
        setOTP(obj: OTPType) {
            this.otp = obj;
        },
        setCodeVerification(obj: CodeVerificationType) {
            this.codeVerification = obj;
        },
        setForgotPassword(obj: ForgotPasswordType) {
            this.forgotPassword = obj;
        },
        setChangPassword(obj: ChangPasswordType) {
            this.changPassword = obj;
        },
        setPasswordPolicy(obj: PasswordPolicyType) {
            this.passwordPolicy = obj;
        },
        setPasswordPolicyHeight(height: number) {
            this.passwordPolicyHeight = height;
        },
        setUri(uri: string) {
            this.uri = uri;
        }
    },
    getters: {
        getClientUri() {
            return new URLSearchParams(window.location.search).get('client_id') || '';
        }
    }  
});