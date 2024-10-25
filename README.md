---

### Command Structure for `api.sendMessage` with Buttons

This template includes all the necessary details for creating a new command using `api.sendMessage` and incorporating buttons in the response.

---

### 1. **Command Name**  
The unique name of the command that will trigger the functionality.

**Example:**  
`test`

---

### 2. **Command Description**  
A brief explanation of the purpose of the command.

**Example:**  
A test command to verify if the bot is functioning correctly and demonstrate how to use buttons in a message.

---

### 3. **Input Parameters**  
A list of inputs or arguments the command takes, including types and descriptions.

**Example:**  
- `senderId` (String): The unique ID of the user sending the message.
- `messageText` (String): The text message sent by the user that triggers the command.

---

### 4. **Command Code Example with Buttons**  
Here’s an example of how the command can be implemented, including buttons in the response.

```javascript
const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'test',  // The name of the command
    description: 'A test command to verify functionality with buttons.',

    async execute(senderId, messageText) {
        // Check if the message text matches the command name
        if (messageText.trim() === this.name) {
            const responseMessage = {
                text: "This is a test command. Choose an option:",
                buttons: [
                    {
                        type: "postback",
                        title: "Option 1",
                        payload: "OPTION_1_PAYLOAD"
                    },
                    {
                        type: "postback",
                        title: "Option 2",
                        payload: "OPTION_2_PAYLOAD"
                    },
                    {
                        type: "postback",
                        title: "Option 3",
                        payload: "OPTION_3_PAYLOAD"
                    }
                ]
            };

            // Send the message with buttons using api.sendMessage
            await api.sendMessage(senderId, responseMessage);
        }
    }
};
```

---

### 5. **Type Definitions**  
Define the types of each input parameter and the response structure.

- **`senderId` (String)**: Represents the ID of the user, typically passed as a string.
- **`messageText` (String)**: The text content from the user’s message.
- **`buttons` (Array)**: An array of button objects, each containing a title and payload.

---

### 6. **Example Usage**  
Describe how the command is used within a chat interface and what the buttons will do.

**Example:**  
If the user types `test`, the bot will respond with a message and three buttons:
1. **Option 1** – Sends payload `OPTION_1_PAYLOAD`.
2. **Option 2** – Sends payload `OPTION_2_PAYLOAD`.
3. **Option 3** – Sends payload `OPTION_3_PAYLOAD`.

---

### 7. **Response Format**  
Describe the format of the message being sent back, including the button structure.

**Example Response:**
```json
{
  "recipient": {
    "id": "USER_ID"
  },
  "message": {
    "text": "This is a test command. Choose an option:",
    "buttons": [
      {
        "type": "postback",
        "title": "Option 1",
        "payload": "OPTION_1_PAYLOAD"
      },
      {
        "type": "postback",
        "title": "Option 2",
        "payload": "OPTION_2_PAYLOAD"
      },
      {
        "type": "postback",
        "title": "Option 3",
        "payload": "OPTION_3_PAYLOAD"
      }
    ]
  }
}
```

---

### 8. **Error Handling**  
Outline how errors or invalid inputs are handled within the command, including the case where buttons fail to render.

**Example:**
```javascript
module.exports = {
    name: 'test',
    description: 'A test command to verify functionality with buttons.',

    async execute(senderId, messageText) {
        try {
            if (messageText.trim() === this.name) {
                const responseMessage = {
                    text: "This is a test command. Choose an option:",
                    buttons: [
                        {
                            type: "postback",
                            title: "Option 1",
                            payload: "OPTION_1_PAYLOAD"
                        },
                        {
                            type: "postback",
                            title: "Option 2",
                            payload: "OPTION_2_PAYLOAD"
                        },
                        {
                            type: "postback",
                            title: "Option 3",
                            payload: "OPTION_3_PAYLOAD"
                        }
                    ]
                };
                await api.sendMessage(senderId, responseMessage);
            }
        } catch (error) {
            console.error('Error executing the command with buttons:', error);
        }
    }
};
```

---

### 9. **Additional Features**  
Mention any additional features, such as sending quick replies, images, or handling different types of messages, if applicable.

**Example:**  
You can combine buttons with images or quick replies in the same message:

```javascript
const responseMessage = {
    text: "Choose an option:",
    buttons: [
        {
            type: "postback",
            title: "Option 1",
            payload: "OPTION_1_PAYLOAD"
        },
        {
            type: "postback",
            title: "Option 2",
            payload: "OPTION_2_PAYLOAD"
        }
    ],
    quick_replies: [
        {
            content_type: "text",
            title: "Quick Reply 1",
            payload: "QUICK_REPLY_1_PAYLOAD"
        },
        {
            content_type: "text",
            title: "Quick Reply 2",
            payload: "QUICK_REPLY_2_PAYLOAD"
        }
    ]
};
```

---

This updated template with buttons will help you create new commands using `api.sendMessage` with more interactive and dynamic responses. Let me know if you need any further adjustments!
