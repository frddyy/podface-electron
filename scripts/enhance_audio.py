import sys
from speechbrain.inference.separation import SepformerSeparation as separator
from scipy.io.wavfile import write
import os

# Define output folder
output_folder = './speechbrain/output'
os.makedirs(output_folder, exist_ok=True)  # Create folder if it doesn't exist

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

    print("Speech enhancement completed successfully!")
    print(f"- enhanced_speaker_1.wav")
    print(f"- enhanced_speaker_2.wav")

    return os.path.join(output_folder, "enhanced_speaker_1.wav"), os.path.join(output_folder, "enhanced_speaker_2.wav")

if __name__ == "__main__":
    # Get the separated audio file paths from arguments
    speaker_1_path = sys.argv[1]
    speaker_2_path = sys.argv[2]

    # Call the enhance_audio function
    enhance_audio(speaker_1_path, speaker_2_path, output_folder)
