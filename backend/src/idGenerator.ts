import {customAlphabet} from 'nanoid';

const BASE62_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const generateBase62Id = customAlphabet(BASE62_ALPHABET, 8); // 8 characters for ~218 trillion unique IDs

export function generateShortId(): string {
    return generateBase62Id();
}
