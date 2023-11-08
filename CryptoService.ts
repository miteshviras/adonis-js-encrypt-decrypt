import Env from '@ioc:Adonis/Core/Env';

export default class CryptoService {
    private crypto;
    private encryptionKey;

    constructor() {
        this.crypto = require('crypto');
        this.encryptionKey = Env.get('APP_KEY'); // here you can replace your own hashed key.
    }

    public encrypt(encryptText: string): string {
        const cipher = this.crypto.createCipher('aes-256-cbc', this.encryptionKey);
        let encryptedPassword = cipher.update(encryptText, 'utf8', 'hex');
        return (encryptedPassword += cipher.final('hex'));
    }

    public decrypt(encryptedText: string): string {
        const decipher = this.crypto.createDecipher('aes-256-cbc', this.encryptionKey);
        let decryptedPassword = decipher.update(encryptedText, 'hex', 'utf8');
        return (decryptedPassword += decipher.final('utf8'));
    }

    public compare(plainText: string, encryptedText: string): boolean {
        const comparedWith = this.decrypt(encryptedText);
        if (comparedWith === plainText) {
            return true;
        }
        return false;
    }

    public isEncrypted(text: string): boolean {
        try {
            // Try to create a Decipher object with a known algorithm and key
            this.decrypt(text);
            // If decryption succeeds without errors, it might be encrypted
            return true;
        } catch (error) {
            // If decryption throws an error, it's likely not encrypted
            return false;
        }
    }
}
