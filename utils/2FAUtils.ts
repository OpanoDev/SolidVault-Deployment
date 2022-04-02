import * as speakeasy from 'speakeasy';

export const genSecret = (): GenSecret => {
  let secret = speakeasy.generateSecret({
    name: 'solidqore',
    length: 20,
  });

  return {
    secret_32: secret.base32,
    secret_link: secret.otpauth_url,
  };
};

export const verifyTOTP = (
  secret: string,
  sixdigitCode: string,
): VerifyTOTP => {
  const verified: boolean = speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: sixdigitCode,
  });

  return {
    verified,
  };
};

interface GenSecret {
  readonly secret_32: string;
  readonly secret_link: string;
}

interface VerifyTOTP {
  readonly verified: boolean;
}
