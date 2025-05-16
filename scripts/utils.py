from pydub.utils import mediainfo
import wave

def is_valid_wav_file(file_path):
    try:
        # Check if the file is a valid WAV format
        info = mediainfo(file_path)
        if info['format_name'] == 'wav':
            # Now try to open the WAV file to ensure it's valid
            with wave.open(file_path, 'rb') as f:
                # If we can open the file and get some properties, it's a valid WAV
                f.getnchannels()  # Get number of channels
                f.getsampwidth()  # Get sample width
                f.getframerate()  # Get frame rate
                f.getnframes()    # Get number of frames
            print(f"Audio file {file_path} is a valid WAV file.")
            return True
        else:
            print(f"Audio file {file_path} is not valid. Please provide a valid .wav audio file.")
            return False
    except Exception as e:
        print(f"Error: {e}")
        return False
