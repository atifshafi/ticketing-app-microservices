import {scrypt, randomBytes} from 'crypto';
import {promisify} from 'util';

const scryptAsync = promisify(scrypt);

export class Password {
    static async toHash(password) {
        const salt = randomBytes(8).toString('hex');
        const buf = await scryptAsync(password, salt, 64);

        // Stored password will have the hashed password, as well as, the salt used to hash it
        return `${buf.toString('hex')}.${salt}`;
    }

    static async compare(storePassword, suppliedPassword) {
        const [hashedPassword, salt] = storePassword.split('.');
        const buf = await scryptAsync(suppliedPassword, salt, 64);

        return buf.toString('hex') === hashedPassword
    }
}