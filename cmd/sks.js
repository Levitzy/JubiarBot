const fs = require("fs");
const fsp = require("fs").promises;
const path = require("path");
const { createDecipheriv, createHash } = require("crypto");
const api = require('../jubiar-pagebot-api/sendmessage');  // Assuming your message API is set up here

const configKeys = [
    "162exe235948e37ws6d057d9d85324e2",
    "dyv35182!",
    "dyv35224nossas!!",
    "662ede816988e58fb6d057d9d85605e0",
    "962exe865948e37ws6d057d4d85604e0",
    "175exe868648e37wb9x157d4l45604l0",
    "c7-YOcjyk1k",
    "Wasjdeijs@/ÇPãoOf231#$%¨&*()_qqu&iJo>ç",
    "Ed\x01",
    "fubvx788b46v",
    "fubgf777gf6",
    "cinbdf665$4",
    "furious0982",
    "error",
    "Jicv",
    "mtscrypt",
    "62756C6F6B",
    "rdovx202b46v",
    "xcode788b46z",
    "y$I@no5#lKuR7ZH#eAgORu6QnAF*vP0^JOTyB1ZQ&*w^RqpGkY",
    "kt",
    "fubvx788B4mev",
    "thirdy1996624",
    "bKps&92&",
    "waiting",
    "gggggg",
    "fuMnrztkzbQ",
    "A^ST^f6ASG6AS5asd",
    "cnt",
    "chaveKey",
    "Version6",
    "trfre699g79r",
    "chanika acid, gimsara htpcag!!",
    "xcode788b46z",
    "cigfhfghdf665557",
    "0x0",
    "2$dOxdIb6hUpzb*Y@B0Nj!T!E2A6DOLlwQQhs4RO6QpuZVfjGx",
    "W0RFRkFVTFRd",
    "Bgw34Nmk",
    "B1m93p$$9pZcL9yBs0b$jJwtPM5VG@Vg",
    "fubvx788b46vcatsn",
    "$$$@mfube11!!_$$))012b4u",
    "zbNkuNCGSLivpEuep3BcNA==",
    "175exe867948e37wb9d057d4k45604l0"
];

function aesDecrypt(data, key, iv) {
    const aesInstance = createDecipheriv("aes-256-cbc", Buffer.from(key, "base64"), Buffer.from(iv, "base64"));
    let result = aesInstance.update(data, "base64", "utf-8");
    result += aesInstance.final("utf-8");
    return result;
}

function md5crypt(data) {
    return createHash("md5").update(data).digest("hex");
}

function decryptData(data, version) {
    for (const key of configKeys) {
        try {
            const decryptedData = aesDecrypt(
                data.split(".")[0],
                Buffer.from(md5crypt(key + " " + version)).toString("base64"),
                data.split(".")[1]
            );
            return { decryptedData };
        } catch (error) {
            console.log(`🔍 Trying Next Key: ${key}`);
        }
    }
    throw new Error("❌ No Valid Key Found For Decryption.");
}

function prettyPrintJSON(data) {
    let result = '';
    
    if (Array.isArray(data)) {
        result += `- [${data.join(",")}]\n`;
    } else if (typeof data === 'object' && data !== null) {
        for (const [key, value] of Object.entries(data)) {
            if (key === "message") continue;
            if (typeof value === 'object' && value !== null) {
                result += `🔑 ${key.toLowerCase()}:\n`;
                result += prettyPrintJSON(value);
            } else {
                result += `🔑 ${key.toLowerCase()}: ${value}\n`;
            }
        }
    } else {
        result += `${data}\n`;
    }
    return result;
}

module.exports = {
    name: 'sks',
    description: 'Decrypts the provided encrypted content using predefined keys.',
    adminBot: true,
    async execute(senderId, messageText) {
        const inputEncrypted = messageText.split(' ')[1];
        
        if (!inputEncrypted) {
            await api.sendMessage(senderId, { text: "❌ Error: No encrypted content provided. Please use the command in the format 'sks {input_encrypted}'." });
            return;
        }

        await api.sendMessage(senderId, { text: "⏳ Processing your decryption request, please wait..." });
        
        try {
            const configData = JSON.parse(inputEncrypted);
            const { decryptedData } = decryptData(configData.d, configData.v);
            
            const responseText = `🎉 Decrypted Content:\n${prettyPrintJSON(JSON.parse(decryptedData)).trim()}`;
            
            // Send the decrypted result as a text message
            await api.sendMessage(senderId, { text: responseText });

            // Define a temporary file with a fixed name and UTF-8 encoding
            const tempFilePath = path.join(__dirname, "sks_decrypted_result.txt");
            await fsp.writeFile(tempFilePath, Buffer.from(responseText, "utf8"));

            // Send the file as a stream
            await api.sendMessage(senderId, {
                attachment: {
                    type: 'file',
                    payload: {
                        is_reusable: true
                    }
                },
                filedata: fs.createReadStream(tempFilePath) // Send as a file stream
            });

            // Clean up the file after sending
            await fsp.unlink(tempFilePath);
        } catch (error) {
            console.error(`Error executing ${this.name} command:`, error);
            await api.sendMessage(senderId, { text: `An error occurred during decryption: ${error.message}` });
        }
    }
};
