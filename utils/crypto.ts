// Derives the AES-GCM key from the secret key using SHA-256 hashing
const deriveKey = async (secretKey: string): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(secretKey)
  );
  const keyBuffer = new Uint8Array(hashBuffer);
  return crypto.subtle.importKey(
    "raw", // Use raw format
    keyBuffer, // The hashed key as the input
    { name: "AES-GCM", length: 256 }, // AES-GCM with a 256-bit key
    false, // Key should not be extractable
    ["encrypt", "decrypt"] // Operations this key can be used for
  );
};

// Encrypt the data with AES-GCM
export const encrypt = async (
  data: string,
  secretKey: string
): Promise<Uint8Array> => {
  const key = await deriveKey(secretKey); // Derive AES key from the secret key
  const iv = crypto.getRandomValues(new Uint8Array(12)); // Generate a 12-byte IV (recommended size for AES-GCM)

  const encoder = new TextEncoder(); // Convert the string data to bytes
  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv }, // Use AES-GCM with the generated IV
    key, // The encryption key
    encoder.encode(data) // The data to encrypt
  );

  const buffer = new Uint8Array(encryptedData); // The encrypted data (ciphertext)
  const result = new Uint8Array(iv.length + buffer.length); // Create a new array for IV + ciphertext
  result.set(iv); // Set the IV at the beginning
  result.set(buffer, iv.length); // Append the ciphertext after the IV

  return result; // Return the concatenated IV + ciphertext
};

// Decrypt the data with AES-GCM
export const decrypt = async (
  encryptedData: Uint8Array,
  secretKey: string
): Promise<string> => {
  const key = await deriveKey(secretKey); // Derive AES key from the secret key
  const iv = encryptedData.slice(0, 12); // The first 12 bytes are the IV (AES-GCM standard)
  const ciphertextWithTag = encryptedData.slice(12); // The rest is the ciphertext (including the authentication tag)

  try {
    // The decrypted data includes the original plaintext, and the verification happens during decryption
    const decryptedData = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv }, // Use AES-GCM decryption with the IV
      key, // The decryption key
      ciphertextWithTag // The ciphertext (including the authentication tag)
    );

    return new TextDecoder().decode(decryptedData); // Convert the decrypted data back to string
  } catch (err) {
    console.error("Decryption failed:", err);
    throw new Error("Decryption failed: " + err.message); // Detailed error message
  }
};
