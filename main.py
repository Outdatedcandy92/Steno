from PIL import Image

def encode_message(image_path, message, output_path):
    image = Image.open(image_path)
    encoded_image = image.copy()
    width, height = image.size
    message += chr(0)  # null character to indicate the end of the message
    message_bits = ''.join([format(ord(char), '08b') for char in message])
    message_index = 0

    for y in range(height):
        for x in range(width):
            if message_index < len(message_bits):
                pixel = list(image.getpixel((x, y)))
                for n in range(3):  # Modify the RGB values
                    if message_index < len(message_bits):
                        pixel[n] = pixel[n] & ~1 | int(message_bits[message_index])
                        message_index += 1
                encoded_image.putpixel((x, y), tuple(pixel))
            else:
                encoded_image.save(output_path)
                print(f"Message encoded and saved to {output_path}")
                return

def decode_message(image_path):
    image = Image.open(image_path)
    width, height = image.size
    message_bits = []
    
    for y in range(height):
        for x in range(width):
            pixel = list(image.getpixel((x, y)))
            for n in range(3):  # Read the RGB values
                message_bits.append(pixel[n] & 1)
    
    message_bytes = [message_bits[i:i+8] for i in range(0, len(message_bits), 8)]
    message = ''.join([chr(int(''.join(map(str, byte)), 2)) for byte in message_bytes])
    null_char_index = message.find(chr(0))
    if null_char_index != -1:
        message = message[:null_char_index]
    print(f"Decoded message: {message}")

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Steganography script to encode and decode messages in images.")
    parser.add_argument("action", choices=["encode", "decode"], help="Action to perform: encode or decode")
    parser.add_argument("image", help="Path to the image file")
    parser.add_argument("--message", help="Message to encode (required for encoding)", required=False)
    parser.add_argument("--output", help="Output path for encoded image (required for encoding)", required=False)

    args = parser.parse_args()

    if args.action == "encode":
        if not args.message or not args.output:
            parser.error("Encoding requires --message and --output")
        encode_message(args.image, args.message, args.output)
    elif args.action == "decode":
        decode_message(args.image)