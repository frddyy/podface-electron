from pydub import AudioSegment
import sys

# Ambil path file audio yang dipisah dan output
audio_file1 = sys.argv[1]  # Path ke audio 1
audio_file2 = sys.argv[2]  # Path ke audio 2
output_file = sys.argv[3]  # Path output hasil gabungan

# Load file audio
audio1 = AudioSegment.from_file(audio_file1)
audio2 = AudioSegment.from_file(audio_file2)

# Set durasi kedua audio agar sama panjang
# Jika ada audio yang lebih pendek, kita sesuaikan dengan memanjangkan durasi dengan silence
if len(audio1) > len(audio2):
    audio2 = audio2 + AudioSegment.silent(duration=len(audio1) - len(audio2))
elif len(audio2) > len(audio1):
    audio1 = audio1 + AudioSegment.silent(duration=len(audio2) - len(audio1))

# Gabungkan kedua audio (overlay)
combined_audio = audio1.overlay(audio2)

# Simpan hasilnya ke file output
combined_audio.export(output_file, format="wav")

print(f"Audio berhasil digabungkan dan disimpan di {output_file}")