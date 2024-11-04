document.getElementById('encodeButton').addEventListener('click', encodeMessage);
document.getElementById('decodeButton').addEventListener('click', decodeMessage);

function encodeMessage() {
    const imageInput = document.getElementById('imageInput').files[0];
    const message = document.getElementById('messageInput').ariaValueMax;
    if (!imageInput || !message) {
        alert('Please select an image and enter a message.');
        return;
}

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('imageCanvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            let messageBits = '';
            for (let i = 0; i < message.length; i++) {
                messageBits += message.charCodeAt(i).toString(2).padStart(8, '0');
            }
            messageBits += '00000000'; // Null character to indicate end of message

            let messageIndex = 0;
            for (let i = 0; i < data.length; i += 4) {
                for (let j = 0; j < 3; j++) {
                    if (messageIndex < messageBits.length) {
                        data[i + j] = (data[i + j] & ~1) | parseInt(messageBits[messageIndex]);
                        messageIndex++;
                    }
                }
            }

            ctx.putImageData(imageData, 0, 0);
            alert('Message encoded into image.');
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(imageInput);
}

function decodeMessage() {
    const imageInput = document.getElementById('imageInput').files[0];
    if (!imageInput) {
        alert('Please select an image.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('imageCanvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            let messageBits = '';
            for (let i = 0; i < data.length; i += 4) {
                for (let j = 0; j < 3; j++) {
                    messageBits += (data[i + j] & 1).toString();
            }
        }

            let message = '';
            for (let i = 0; i < messageBits.length; i += 8) {
                const byte = messageBits.slice(i, i + 8);
                const charCode = parseInt(byte, 2);
                if (charCode === 0) break;
                message += String.fromCharCode(charCode);
    }

            document.getElementById('decodedMessage').textContent = `Decoded message: ${message}`;
};
        img.src = event.target.result;
    };
    reader.readAsDataURL(imageInput);
}