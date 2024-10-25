To make it easy to create new commands with various message types—text, video, image, button, and more—I'll outline a standardized command structure for adding different message types. This structure will ensure compatibility with your `sendmessage.js` setup and provide flexibility for different message types. I'll also explain each part.

### Command Structure Template

Below is the template for creating a new command file in the `cmd/` folder. Each command file exports a module with essential properties (`name`, `description`, and `execute` function) and supports various message types by setting the `message` object.

```javascript
const api = require('../jubiar-pagebot-api/sendmessage');

module.exports = {
    name: 'example',  // Command name, e.g., "hi", "bye", "sendimage"
    description: 'Example command demonstrating text, video, image, and button options.',

    async execute(senderId, messageText) {
        // Determine the type of message to send based on the command or messageText

        let responseMessage;

        // Text message
        if (messageText.includes('text')) {
            responseMessage = {
                text: 'Hello! This is a text message example.'
            };

        // Image message
        } else if (messageText.includes('image')) {
            responseMessage = {
                attachment: {
                    type: 'image',
                    payload: {
                        url: 'https://example.com/image.jpg',  // Replace with a valid image URL
                        is_reusable: true  // This allows Facebook to cache the image
                    }
                }
            };

        // Video message
        } else if (messageText.includes('video')) {
            responseMessage = {
                attachment: {
                    type: 'video',
                    payload: {
                        url: 'https://example.com/video.mp4',  // Replace with a valid video URL
                        is_reusable: true
                    }
                }
            };

        // Button message
        } else if (messageText.includes('button')) {
            responseMessage = {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'button',
                        text: 'Choose an option:',
                        buttons: [
                            {
                                type: 'web_url',
                                url: 'https://example.com',
                                title: 'Visit Website'
                            },
                            {
                                type: 'postback',
                                title: 'Get Started',
                                payload: 'GET_STARTED_PAYLOAD'
                            }
                        ]
                    }
                }
            };

        // Generic Template Message (e.g., for a product or service card)
        } else if (messageText.includes('generic')) {
            responseMessage = {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'generic',
                        elements: [
                            {
                                title: 'Sample Item',
                                image_url: 'https://example.com/image.jpg',
                                subtitle: 'Item description',
                                default_action: {
                                    type: 'web_url',
                                    url: 'https://example.com',
                                    webview_height_ratio: 'tall'
                                },
                                buttons: [
                                    {
                                        type: 'web_url',
                                        url: 'https://example.com',
                                        title: 'View'
                                    },
                                    {
                                        type: 'postback',
                                        title: 'Buy Now',
                                        payload: 'BUY_NOW_PAYLOAD'
                                    }
                                ]
                            }
                        ]
                    }
                }
            };

        // Quick Replies
        } else if (messageText.includes('quick')) {
            responseMessage = {
                text: 'Choose an option:',
                quick_replies: [
                    {
                        content_type: 'text',
                        title: 'Option 1',
                        payload: 'OPTION_1_PAYLOAD'
                    },
                    {
                        content_type: 'text',
                        title: 'Option 2',
                        payload: 'OPTION_2_PAYLOAD'
                    }
                ]
            };

        } else {
            responseMessage = { text: "I'm not sure what you meant. Try 'text', 'video', 'image', 'button', etc." };
        }

        // Send the prepared message
        await api.sendMessage(senderId, responseMessage);
    }
};
```

### Explanation of Each Message Type

1. **Text Message**:
   - Simple text message sent to the user.
   - Example: `{ text: "Hello! This is a text message example." }`

2. **Image Message**:
   - Sends an image with a direct URL.
   - Example:
     ```javascript
     {
         attachment: {
             type: 'image',
             payload: { url: 'https://example.com/image.jpg', is_reusable: true }
         }
     }
     ```

3. **Video Message**:
   - Sends a video with a direct URL.
   - Example:
     ```javascript
     {
         attachment: {
             type: 'video',
             payload: { url: 'https://example.com/video.mp4', is_reusable: true }
         }
     }
     ```

4. **Button Message**:
   - Sends a message with buttons (web URL and postback).
   - Example:
     ```javascript
     {
         attachment: {
             type: 'template',
             payload: {
                 template_type: 'button',
                 text: 'Choose an option:',
                 buttons: [
                     { type: 'web_url', url: 'https://example.com', title: 'Visit Website' },
                     { type: 'postback', title: 'Get Started', payload: 'GET_STARTED_PAYLOAD' }
                 ]
             }
         }
     }
     ```

5. **Generic Template Message**:
   - Sends a carousel-style template, often used for product or service cards.
   - Example:
     ```javascript
     {
         attachment: {
             type: 'template',
             payload: {
                 template_type: 'generic',
                 elements: [
                     {
                         title: 'Sample Item',
                         image_url: 'https://example.com/image.jpg',
                         subtitle: 'Item description',
                         default_action: { type: 'web_url', url: 'https://example.com', webview_height_ratio: 'tall' },
                         buttons: [
                             { type: 'web_url', url: 'https://example.com', title: 'View' },
                             { type: 'postback', title: 'Buy Now', payload: 'BUY_NOW_PAYLOAD' }
                         ]
                     }
                 ]
             }
         }
     }
     ```

6. **Quick Replies**:
   - Provides interactive options for users to choose from.
   - Example:
     ```javascript
     {
         text: 'Choose an option:',
         quick_replies: [
             { content_type: 'text', title: 'Option 1', payload: 'OPTION_1_PAYLOAD' },
             { content_type: 'text', title: 'Option 2', payload: 'OPTION_2_PAYLOAD' }
         ]
     }
     ```

### Usage Notes:
- **Add Commands in the `cmd/` Folder**: Place each new command file in the `cmd/` folder, following this structure.
- **Configure `messageText` Conditions**: Adjust the `messageText.includes('keyword')` conditions in the `execute` function to respond to different keywords (like 'text', 'video', 'image', etc.).
- **Payloads and URLs**: Replace example URLs and payloads with real values relevant to your application.

This standardized structure allows you to easily create commands with varied content, making it versatile for different scenarios. Let me know if you’d like further customization on this structure!