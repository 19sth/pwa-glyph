export const KEYS = {
    storage: 'glyph_notes'
}

export function encryptText(text: string, key: string): string {
    let result = "";
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) + key.charCodeAt(i % key.length);
        result += String.fromCharCode(charCode);
    }
    return result;
}

export function decryptText(encryptedText: string, key: string): string {
    let result = "";
    for (let i = 0; i < encryptedText.length; i++) {
        const charCode = encryptedText.charCodeAt(i) - key.charCodeAt(i % key.length);
        result += String.fromCharCode(charCode);
    }
    return result;
}

export function generateRandomNumericChars(text: string): string {
    let result = '';
    const len = 64

    for (let i = 0; i < len; i++) {
        result += Math.floor(Math.random() * 10).toString();
    }

    const ix = Math.floor(Math.random()*(64-text.length));
    result = result.slice(0, ix) + text + result.slice(ix+text.length, 64);

    return result;
}
