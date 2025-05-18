import sys
import torchaudio
from speechbrain.inference.separation import SepformerSeparation as separator
from scipy.io.wavfile import write
import numpy as np
import os
from scripts.utils import is_valid_wav_file

# Define output folder
output_folder = './speechbrain/output' # speechbrain/output
os.makedirs(output_folder, exist_ok=True)  # Create folder if it doesn't exist

# Function for separating audio into multiple speakers
def separate_audio(audio_path, output_folder):
    # Validate the WAV file before processing
    if not is_valid_wav_file(audio_path):
        print(f"Audio file {audio_path} is not valid. Please provide a valid .wav audio file.")
        return None, None

    # Initialize the Sepformer model for separation
    model = separator.from_hparams(source="speechbrain/sepformer-wham", savedir='pretrained_models/sepformer-wham')

    # Perform the separation
    est_sources = model.separate_file(path=audio_path)

    # Save separated audio for each speaker
    rate = 8000  # Sampling rate
    speaker_1 = est_sources[:, :, 0].detach().cpu().squeeze().numpy()
    speaker_2 = est_sources[:, :, 1].detach().cpu().squeeze().numpy()

    write(os.path.join(output_folder, "speaker_1.wav"), rate, (speaker_1 * 32767).astype('int16'))
    write(os.path.join(output_folder, "speaker_2.wav"), rate, (speaker_2 * 32767).astype('int16'))

    print("Speech separation completed successfully!")
    print(f"- speaker_1.wav")
    print(f"- speaker_2.wav")
    
    return os.path.join(output_folder, "speaker_1.wav"), os.path.join(output_folder, "speaker_2.wav")

if __name__ == "__main__":
    # Get the audio file path from arguments
    audio_path = sys.argv[1]

    # Call the separate_audio function
    separate_audio(audio_path, output_folder)
