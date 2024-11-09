const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'tnl',
    description: 'Decrypts and displays TNL content, allowing copying of specific decrypted fields.',
    
    async execute(senderId, messageText) {
        const encryptedContentsList = messageText.split('|'); // Assume contents are separated by "|"
        const decryptedResults = encryptedContentsList.map(content => decrypt(content)).join('\n');
        
        // Send decrypted content as text response
        await api.sendMessage(senderId, { text: decryptedResults });
        
        // Add button options for copying decrypted fields
        await api.sendMessage(senderId, {
            text: 'Options to copy decrypted fields:',
            quick_replies: [
                { content_type: 'text', title: 'Copy SSH Username', payload: 'COPY_SSH_USER' },
                { content_type: 'text', title: 'Copy SSH Password', payload: 'COPY_SSH_PASS' },
                { content_type: 'text', title: 'Copy SSH Server', payload: 'COPY_SSH_SERVER' },
                { content_type: 'text', title: 'Copy SSH Port', payload: 'COPY_SSH_PORT' },
                { content_type: 'text', title: 'Copy Proxy Payload', payload: 'COPY_PROXY_PAYLOAD' }
            ]
        });
    }
};

// Helper functions for decryption
function decrypt(encryptedContent) {
    const arrContent = encryptedContent.split('.');
    const salt = b64decode(arrContent[0].trim());
    const nonce = b64decode(arrContent[1].trim());
    const cipher = b64decode(arrContent[2].trim());
    const configEncPassword = 'B1m93p$$9pZcL9yBs0b$jJwtPM5VG@Vg';
    const key = PBKDF2KeyGen(configEncPassword, salt, 1000, 16);
    
    if (!key) return 'Failed to generate PBKDF2 key.';

    const decryptedResult = AESDecrypt(cipher, key, nonce);
    if (!decryptedResult) return 'Failed to decrypt AES.';
    
    const unpaddedResult = removePadding(Buffer.from(decryptedResult, 'utf-8'));
    const decryptedString = unpaddedResult.toString('utf-8');
    const pattern = /<entry key="(.*?)">(.*?)<\/entry>/g;
    const resultBuilder = ["Anonymous Decrypting World\n\n"];
    
    let match;
    while ((match = pattern.exec(decryptedString)) !== null) {
        resultBuilder.push(`[ADW] [${match[1]}]= ${match[2]}\n`);
    }
    resultBuilder.push("\n\nAnonymous Decrypting World");
    return resultBuilder.join('');
}

function b64decode(content) {
    return Buffer.from(content, 'base64');
}

function PBKDF2KeyGen(password, salt, count, dkLen) {
    const crypto = require('crypto');
    return crypto.pbkdf2Sync(password, salt, count, dkLen, 'sha256');
}

function AESDecrypt(ciphertext, key, nonce) {
    const crypto = require('crypto');
    try {
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, nonce);
        const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error('Decryption error:', error);
        return null;
    }
}

function removePadding(buffer) {
    const paddingLength = buffer[buffer.length - 1];
    return buffer.slice(0, buffer.length - paddingLength);
}
