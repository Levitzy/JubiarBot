const api = require('../jubiar-pagebot-api/sendmessage');
const crypto = require('crypto');
const fs = require('fs');

class TnlDecryptor {
  constructor() {
    this.configEncPassword = 'B1m93p$$9pZcL9yBs0b$jJwtPM5VG@Vg';
  }

  // Decrypts the given encrypted content
  decrypt(encryptedContent) {
    const [saltEncoded, nonceEncoded, cipherEncoded] = encryptedContent.split('.');

    // Decode each component from base64
    const salt = Buffer.from(saltEncoded, 'base64');
    const nonce = Buffer.from(nonceEncoded, 'base64');
    const cipher = Buffer.from(cipherEncoded, 'base64');

    // Extract cipher text and authentication tag
    const cipherText = cipher.slice(0, cipher.length - 16); // without the last 16 bytes
    const authTag = cipher.slice(cipher.length - 16);       // last 16 bytes are the auth tag

    // Generate the key using PBKDF2
    const PBKDF2key = this.PBKDF2KeyGen(this.configEncPassword, salt, 1000, 16);
    if (!PBKDF2key) {
      return 'Failed to generate PBKDF2 key.';
    }

    // Decrypt using AES-GCM
    const decryptedResult = this.AESDecrypt(cipherText, PBKDF2key, nonce, authTag);
    if (!decryptedResult) {
      return 'Failed to decrypt AES.';
    }

    const unpaddedResult = this.removePadding(Buffer.from(decryptedResult));
    const decryptedString = unpaddedResult.toString('utf8');

    // Parse and format decrypted data
    const regex = /<entry key="(.*?)">(.*?)<\/entry>/g;
    let result = 'Anonymous Decrypting World\n\n';
    let match;
    while ((match = regex.exec(decryptedString)) !== null) {
      result += `[ADW] [${match[1]}]= ${match[2]}\n`;
    }
    return result + '\n\nAnonymous Decrypting World';
  }

  // Removes PKCS#7 padding
  removePadding(decryptedText) {
    const paddingLength = decryptedText[decryptedText.length - 1];
    return decryptedText.slice(0, decryptedText.length - paddingLength);
  }

  // Key generation using PBKDF2
  PBKDF2KeyGen(password, salt, iterations, keyLen) {
    try {
      return crypto.pbkdf2Sync(password, salt, iterations, keyLen, 'sha256');
    } catch (error) {
      console.error('Error generating PBKDF2 key:', error);
      return null;
    }
  }

  // AES decryption using AES-GCM
  AESDecrypt(ciphertext, key, nonce, authTag) {
    try {
      const decipher = crypto.createDecipheriv('aes-128-gcm', key, nonce);
      decipher.setAuthTag(authTag);
      const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
      return plaintext;
    } catch (error) {
      console.error('Error decrypting AES:', error);
      return null;
    }
  }
}

module.exports = {
  name: 'tnl',
  description: 'Decrypts a given encrypted string using predefined keys and methods.',

  async execute(senderId, messageText) {
    const decryptor = new TnlDecryptor();

    // Assuming encrypted content follows right after the command
    const encryptedContent = messageText.replace('tnl ', '').trim();
    const decryptedMessage = decryptor.decrypt(encryptedContent);

    try {
      await api.sendMessage(senderId, { text: decryptedMessage });
    } catch (error) {
      console.error(`Error executing ${this.name} command:`, error);
      await api.sendMessage(senderId, { text: 'An error occurred during decryption.' });
    }
  }
};
