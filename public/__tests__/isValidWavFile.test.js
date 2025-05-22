// isValidWavFile.test.js

jest.mock('sharp', () => ({
    metadata: jest.fn().mockResolvedValue({ format: 'jpeg' }),
  }));
  
  // Mock 'wav-decoder' correctly
  jest.mock('wav-decoder', () => ({
    decode: jest.fn(),
  }));
  
  const { isValidWavFile } = require('../electron');
  
  const mockIpcEvent = {
    reply: jest.fn(),
  };
  
  describe("isValidWavFile with physical files", () => {
  
    it("should validate a real valid WAV file", async () => {
      const filePath = "/home/daffaraihandika/TA/seed-vc/examples/source/source_s4.wav";
  
      // Simulate a valid WAV file
      require('wav-decoder').decode.mockResolvedValue(true); // This simulates a successful WAV file decoding
  
      await isValidWavFile(filePath, mockIpcEvent);
  
      // Expect 'audio-file-selected' to be called with the file path
      expect(mockIpcEvent.reply).toHaveBeenCalledWith(
        "audio-file-selected",
        expect.objectContaining({ audioFilePath: filePath })
      );
    });
  
    it("should reject non-WAV file like PNG", async () => {
      const filePath = "/home/daffaraihandika/face-reconstruction/MICA/demo/input/subject1.png";
  
      // Simulate failure for non-WAV files (e.g., PNG)
      require('wav-decoder').decode.mockRejectedValue(new Error('Invalid WAV file'));
  
      await isValidWavFile(filePath, mockIpcEvent);
  
      // Expect 'invalid-audio-file' to be called with error message
      expect(mockIpcEvent.reply).toHaveBeenCalledWith(
        "invalid-audio-file",
        expect.any(Object)
      );
    });
  
    it("should handle corrupted WAV file", async () => {
      const filePath = "/home/daffaraihandika/Downloads/eyes.wav";
  
      // Simulate failure for corrupted WAV file
      require('wav-decoder').decode.mockRejectedValue(new Error('Invalid WAV file'));
  
      await isValidWavFile(filePath, mockIpcEvent);
  
      // Expect 'invalid-audio-file' to be called with error message
      expect(mockIpcEvent.reply).toHaveBeenCalledWith(
        "invalid-audio-file",
        expect.any(Object)
      );
    });
  });
  