import sys
import torchaudio
from speechbrain.inference.separation import SepformerSeparation as separator
from scipy.io.wavfile import write
import numpy as np
import os
from utils import is_valid_wav_file

# Define output folder
output_folder = './speechbrain/output' # speechbrain/output
os.makedirs(output_folder, exist_ok=True)  # Create folder if it doesn't exist

def report_progress(percentage):
    """Fungsi untuk mengirim progres dan melakukan flush."""
    print(f"PROGRESS:{percentage}")
    sys.stdout.flush()

# Function for separating audio into multiple speakers
def separate_audio(audio_path, output_folder):
    # Validate the WAV file before processing
    if not is_valid_wav_file(audio_path):
        print(f"Audio file {audio_path} is not valid. Please provide a valid .wav audio file.")
        return None, None

    # Load the audio file using torchaudio
    report_progress(5) # Tahap 1: Memulai pemisahan
    waveform, sample_rate = torchaudio.load(audio_path)

    # Resample to 8kHz if the sample rate is different
    if sample_rate != 8000:
        waveform = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=8000)(waveform)
        sample_rate = 8000  # Update the sample rate to 8kHz

    # Convert to mono if the audio is stereo (2 channels)
    if waveform.shape[0] > 1:
        waveform = waveform.mean(dim=0, keepdim=True)  # Convert to mono

    # Save the resampled and mono audio (optional, can skip this if not needed)
    resampled_audio_path = os.path.join(output_folder, "resampled_audio.wav")
    torchaudio.save(resampled_audio_path, waveform, sample_rate)

    # Initialize the Sepformer model for separation
    report_progress(15) # Tahap 2: Memuat model
    model = separator.from_hparams(source="speechbrain/sepformer-wham", savedir='pretrained_models/sepformer-wham')

    # Perform the separation
    report_progress(30) # Tahap 3: Memproses pemisahan audio
    est_sources = model.separate_file(path=resampled_audio_path)

    # Save separated audio for each speaker
    report_progress(45) # Tahap 4: Menyimpan hasil
    rate = 8000  # Sampling rate
    speaker_1 = est_sources[:, :, 0].detach().cpu().squeeze().numpy()
    speaker_2 = est_sources[:, :, 1].detach().cpu().squeeze().numpy()

    write(os.path.join(output_folder, "speaker_1.wav"), rate, (speaker_1 * 32767).astype('int16'))
    write(os.path.join(output_folder, "speaker_2.wav"), rate, (speaker_2 * 32767).astype('int16'))

    print("Speech separation completed successfully!")
    return os.path.join(output_folder, "speaker_1.wav"), os.path.join(output_folder, "speaker_2.wav")

if __name__ == "__main__":
    # Get the audio file path from arguments
    audio_path = sys.argv[1]

    # Call the separate_audio function
    separate_audio(audio_path, output_folder)
