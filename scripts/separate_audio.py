import sys
import torchaudio
from speechbrain.inference.separation import SepformerSeparation as separator
from scipy.io.wavfile import write
import numpy as np
import os

# Dapatkan path audio dari argumen
audio_path = sys.argv[1]

# Tentukan folder output
output_folder = './speechbrain/output'
os.makedirs(output_folder, exist_ok=True)  # Membuat folder jika belum ada

# Inisialisasi model sepformer untuk pemisahan suara
model = separator.from_hparams(source="speechbrain/sepformer-wham", savedir='pretrained_models/sepformer-wham')

# Pisahkan suara dalam file audio
est_sources = model.separate_file(path=audio_path)

# Simpan suara terpisah ke file .wav
rate = 8000  # Sampling rate
speaker_1 = est_sources[:, :, 0].detach().cpu().squeeze().numpy()
speaker_2 = est_sources[:, :, 1].detach().cpu().squeeze().numpy()

write(os.path.join(output_folder, "speaker_1.wav"), rate, (speaker_1 * 32767).astype('int16'))
write(os.path.join(output_folder, "speaker_2.wav"), rate, (speaker_2 * 32767).astype('int16'))

# Pemrosesan enhancement untuk Speaker 1
model_enhance = separator.from_hparams(source="speechbrain/sepformer-whamr-enhancement", savedir='pretrained_models/sepformer-whamr-enhancement4')

enhanced_speech_1 = model_enhance.separate_file(path=os.path.join(output_folder, 'speaker_1.wav'))

# Simpan suara enhanced Speaker 1 ke file .wav
enhanced_1 = enhanced_speech_1.detach().cpu().squeeze().numpy()
write(os.path.join(output_folder, "enhanced_speaker_1.wav"), rate, (enhanced_1 * 32767).astype('int16'))

# Pemrosesan enhancement untuk Speaker 2
enhanced_speech_2 = model_enhance.separate_file(path=os.path.join(output_folder, 'speaker_2.wav'))

# Simpan suara enhanced Speaker 2 ke file .wav
enhanced_2 = enhanced_speech_2.detach().cpu().squeeze().numpy()
write(os.path.join(output_folder, "enhanced_speaker_2.wav"), rate, (enhanced_2 * 32767).astype('int16'))

print("Proses selesai! File yang disimpan:")
print("- speaker_1.wav")
print("- speaker_2.wav")
print("- enhanced_speaker_1.wav")
print("- enhanced_speaker_2.wav")
