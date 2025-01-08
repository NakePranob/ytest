// OTP Type
export interface OTPType {
  email: string;
  password: string;
  challengeName: string;
  session: string;
}

// Code Verification Type
export interface CodeVerificationType {
  email: string;
  password: string;
  sessionId: string;
  code: string;
}

// Forgot Password Type
export interface ForgotPasswordType {
  email: string;
  sessionId: string;
}

// Change Password Type
export interface ChangPasswordType {
  session: string;
  email: string;
}

// Notification Type
export interface NotiSuccessType {
  isOpen: boolean;
  state: string;
  url: string;
  message: string;
  description: string;
}

// Password Policy Type
export interface PasswordPolicyType {
  MinimumLength: number;
  RequireUppercase: boolean;
  RequireLowercase: boolean;
  RequireSymbols: boolean;
  RequireNumbers: boolean;
}

// auth Stores State Type
export interface AuthState {
  formElementHight: number;
  uri: string;
  refreshToken: string;
  hiddenPassword: boolean;
  pageView: string;
  otp: OTPType;
  codeVerification: CodeVerificationType;
  forgotPassword: ForgotPasswordType;
  changPassword: ChangPasswordType;
  notiSuccess: NotiSuccessType;
  passwordPolicy: PasswordPolicyType;
  passwordPolicyHeight: number;
}