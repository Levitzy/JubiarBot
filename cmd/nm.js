const api = require('../jubiar-pagebot-api/sendmessage');
const crypto = require('crypto');

// Main Decryptor Class
class NmDecryptor {
    constructor() {
        this.key = Buffer.from("X25ldHN5bmFfbmV0bW9kXw==", 'base64'); // Base64-decoded key
    }

    // AES decryption using ECB mode
    decryptAesEcb128(ciphertext) {
        const decipher = crypto.createDecipheriv('aes-128-ecb', this.key, null);
        decipher.setAutoPadding(false);
        return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    }

    // Parse configuration from JSON object, excluding the "Note" field
    parseConfig(data, hideNote) {
        let result = "============== Configuration ==============\n\n";

        const payload = data.Payload;
        result += "[Payload]\n";
        result += `- Value: ${payload.Value}\n`;
        result += `- Locked: ${payload.Locked}\n\n`;

        const sni = data.SNI;
        result += "[SNI]\n";
        result += `- Value: ${sni.Value}\n`;
        result += `- Locked: ${sni.Locked}\n\n`;

        const rr = data.RR;
        result += "[RR]\n";
        result += `- Mode: ${rr.Mode}\n`;
        result += `- Manual: ${rr.Manual}\n`;
        result += `- Locked: ${rr.Locked}\n\n`;

        const proxyArray = data.Proxy;
        result += "[Proxy]\n";
        proxyArray.forEach(proxy => {
            result += `- Proxy Host: ${proxy.Host}\n`;
            result += `- Locked: ${proxy.Locked}\n`;
            result += `- Pass: ${proxy.Pass}\n`;
            result += `- Proxy Port: ${proxy.Port}\n`;
            result += `- Proxy Remark: ${proxy.Remark}\n`;
            result += `- UseAuth: ${proxy.UseAuth}\n`;
            result += `- User: ${proxy.User}\n\n`;
        });

        const sshArray = data.SSH;
        result += "[SSH]\n";
        sshArray.forEach(ssh => {
            result += `- Host: ${ssh.Host}\n`;
            result += `- Locked: ${ssh.Locked}\n`;
            result += `- Pass: ${ssh.Pass}\n`;
            result += `- Port: ${ssh.Port}\n`;
            result += `- Remark: ${ssh.Remark}\n`;
            result += `- User: ${ssh.User}\n\n`;
        });

        const controls = data.Controls;
        result += "[Controls]\n";
        result += `- Proxy: ${controls.Proxy}\n`;
        result += `- SSH: ${controls.SSH}\n`;
        result += `- SNI: ${controls.SNI}\n\n`;

        result += "[Other Settings]\n";
        result += `- Prevent Wifi: ${data["Prevent Wifi"]}\n`;
        result += `- SSH Index: ${data["SSH Index"]}\n`;
        result += `- Proxy Index: ${data["Proxy Index"]}\n`;
        result += `- Expire: ${data.Expire}\n`;
        result += `- Version Android: ${data["Version Android"]}\n`;
        result += `- Prevent Root: ${data["Prevent Root"]}\n`;

        result += "\n============== Configuration ==============\n";
        return result;
    }

    // Handle decryption and JSON parsing
    handleNm(encryptedContentsList, hideNote) {
        let message = "";

        encryptedContentsList.forEach(encryptedContent => {
            try {
                const encryptedText = Buffer.from(encryptedContent, 'base64');
                const decryptedText = this.decryptAesEcb128(encryptedText);
                let decryptedString = decryptedText.toString().trim();

                // Attempt to extract JSON data with regex if there is extraneous data
                const jsonMatch = decryptedString.match(/{.*}/s);
                if (jsonMatch) {
                    decryptedString = jsonMatch[0];
                }

                try {
                    const jsonObject = JSON.parse(decryptedString);
                    message += this.parseConfig(jsonObject, hideNote) + "\n\n";
                } catch (error) {
                    message += `Error parsing decrypted JSON: ${error.message}\n\n`;
                }

            } catch (error) {
                message += `Error during decryption: ${error.message}\n\n`;
            }
        });

        return message;
    }
}

module.exports = {
    name: 'nm',
    description: 'Decrypts encrypted configuration data provided by the user.',
    async execute(senderId, messageText) {
        // Check if encrypted content is provided
        if (!messageText || messageText.trim() === "") {
            await api.sendMessage(senderId, { text: 'Please provide the encrypted content to decrypt.' });
            return;
        }

        // Send processing message
        await api.sendMessage(senderId, { text: 'Processing your request...' });

        try {
            const encryptedContent = messageText.trim();
            const nmDecryptor = new NmDecryptor();
            const resultMessage = nmDecryptor.handleNm([encryptedContent], false);
            await api.sendMessage(senderId, { text: resultMessage });
        } catch (error) {
            console.error(`Error executing nm command:`, error);
            await api.sendMessage(senderId, { text: 'An error occurred while processing the encrypted content.' });
        }
    }
};
