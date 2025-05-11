import sys
import torchaudio
from speechbrain.inference.separation import SepformerSeparation as separator
from scipy.io.wavfile import write
import numpy as np
import os

# Define output folder
output_folder = './speechbrain/output'
os.makedirs(output_folder, exist_ok=True)  # Create folder if it doesn't exist

# Function for separating audio into multiple speakers
def separate_audio(audio_path, output_folder):
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

    print("Separation complete!")
    print(f"- speaker_1.wav")
    print(f"- speaker_2.wav")
    
    return os.path.join(output_folder, "speaker_1.wav"), os.path.join(output_folder, "speaker_2.wav")

# Function for enhancing the separated audio (Speaker 1 and Speaker 2)
def enhance_audio(speaker_1_path, speaker_2_path, output_folder):
    # Initialize the Sepformer model for enhancement
    model_enhance = separator.from_hparams(source="speechbrain/sepformer-whamr-enhancement", savedir='pretrained_models/sepformer-whamr-enhancement4')

    # Enhance speaker 1's audio
    enhanced_speech_1 = model_enhance.separate_file(path=speaker_1_path)
    enhanced_1 = enhanced_speech_1.detach().cpu().squeeze().numpy()
    write(os.path.join(output_folder, "enhanced_speaker_1.wav"), 8000, (enhanced_1 * 32767).astype('int16'))

    # Enhance speaker 2's audio
    enhanced_speech_2 = model_enhance.separate_file(path=speaker_2_path)
    enhanced_2 = enhanced_speech_2.detach().cpu().squeeze().numpy()
    write(os.path.join(output_folder, "enhanced_speaker_2.wav"), 8000, (enhanced_2 * 32767).astype('int16'))

    print("Enhancement complete!")
    print(f"- enhanced_speaker_1.wav")
    print(f"- enhanced_speaker_2.wav")

    return os.path.join(output_folder, "enhanced_speaker_1.wav"), os.path.join(output_folder, "enhanced_speaker_2.wav")


# Main function to control the flow
def main(audio_path):
    # Step 1: Separate the audio into speaker 1 and speaker 2
    speaker_1_path, speaker_2_path = separate_audio(audio_path, output_folder)

    # Step 2: Enhance the separated audio files
    enhanced_speaker_1_path, enhanced_speaker_2_path = enhance_audio(speaker_1_path, speaker_2_path, output_folder)

    print("Process finished!")
    return enhanced_speaker_1_path, enhanced_speaker_2_path

if __name__ == "__main__":
    # Get the audio file path from arguments
    audio_path = sys.argv[1]

    # Run the main function
    main(audio_path)
