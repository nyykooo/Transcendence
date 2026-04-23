const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const TOTP_DIGITS = 6;
const TOTP_WINDOW = 1;
const TOTP_STEP_SECONDS = 30;

function normalizeOtp(input) {
    return String(input || '').replace(/\s+/g, '');
}

function generateTotpSecret(email) {
    return speakeasy.generateSecret({
        name: `Brunch.io (${email})`,
        issuer: 'Brunch.io',
        length: 20,
    });
}

async function buildQrCodeDataUrl(otpauthUrl) {
    return qrcode.toDataURL(otpauthUrl);
}

function verifyTotpToken({ secret, token }) {
    const normalizedToken = normalizeOtp(token);
    if (!secret || !normalizedToken) {
        return false;
    }

    return speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token: normalizedToken,
        digits: TOTP_DIGITS,
        step: TOTP_STEP_SECONDS,
        window: TOTP_WINDOW,
    });
}

module.exports = { normalizeOtp, generateTotpSecret, buildQrCodeDataUrl, verifyTotpToken,};