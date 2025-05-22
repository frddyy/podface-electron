import os
import pytest
from separate_audio import separate_audio


# Path output folder sama dengan yang di script separate_audio.py
OUTPUT_FOLDER = './speechbrain/output'

def test_valid_audio_two_speakers(capfd):
    """
    Menguji fungsi dengan file audio WAV valid yang berisi dua pembicara.
    Expected Result: 
    - Kedua file output hasil pemisahan tersimpan secara fisik di komputer.
    - Pesan "Speech separation completed successfully!" berhasil ditampilkan
    """
    valid_audio = "/home/daffaraihandika/voca/audio/audio_podcast.wav"
    assert os.path.exists(valid_audio), "Test file does not exist"

    speaker1_path, speaker2_path = separate_audio(valid_audio, OUTPUT_FOLDER)

    captured = capfd.readouterr()

    assert speaker1_path is not None and speaker2_path is not None, "Output paths should not be None"
    assert os.path.exists(speaker1_path), "Output file speaker_1.wav tidak ditemukan"
    assert os.path.exists(speaker2_path), "Output file speaker_2.wav tidak ditemukan"
    assert "Speech separation completed successfully!" in captured.out

def test_invalid_audio_format(capfd):
    """
    Menguji fungsi dengan file yang bukan format WAV valid.
    Expected Result: 
    - Fungsi mengembalikan None dan tidak membuat file output.
    - Pesan error "Audio file {audio_path} is not valid. Please provide a valid .wav audio file." berhasil ditampilkan.
    """
    invalid_audio = "/home/daffaraihandika/face-reconstruction/MICA/demo/input/subject1.png"
    assert os.path.exists(invalid_audio), "Test file does not exist"

    speaker1_path, speaker2_path = separate_audio(invalid_audio, OUTPUT_FOLDER)

    captured = capfd.readouterr()

    assert speaker1_path is None and speaker2_path is None, "Fungsi harus mengembalikan None untuk file invalid"
    assert "Audio file" in captured.out
    assert "is not valid. Please provide a valid .wav audio file." in captured.out

def test_non_existent_file(capfd):
    """
    Menguji fungsi dengan file yang tidak ada.
    Expected Result: 
    - Fungsi mengembalikan None dan tidak membuat file output.
    - Pesan error "Audio file {audio_path} is not valid. Please provide a valid .wav audio file." berhasil ditampilkan.
    """
    non_existent = "test_audio/non_existent.wav"

    speaker1_path, speaker2_path = separate_audio(non_existent, OUTPUT_FOLDER)

    captured = capfd.readouterr()

    assert speaker1_path is None and speaker2_path is None, "Fungsi harus mengembalikan None untuk file yang tidak ada"
    assert "Audio file" in captured.out
    assert "is not valid. Please provide a valid .wav audio file." in captured.out

def test_single_speaker_audio(capfd):
    """
    Menguji fungsi dengan file audio yang hanya mengandung satu pembicara.
    Expected Result: 
    - Fungsi tetap membuat kedua file output.
    - Pesan "Speech separation completed successfully!" berhasil ditampilkan.
    """
    single_speaker_audio = "/home/daffaraihandika/TA/speechbrain/test_1_speaker/1_speaker.wav"
    assert os.path.exists(single_speaker_audio), "Test file does not exist"

    speaker1_path, speaker2_path = separate_audio(single_speaker_audio, OUTPUT_FOLDER)

    captured = capfd.readouterr()

    assert speaker1_path is not None and speaker2_path is not None, "Output paths should not be None"
    assert os.path.exists(speaker1_path), "Output file speaker_1.wav tidak ditemukan"
    assert os.path.exists(speaker2_path), "Output file speaker_2.wav tidak ditemukan"
    assert "Speech separation completed successfully!" in captured.out

def test_corrupted_wav_file(capfd):
    """
    Menguji fungsi dengan file WAV yang rusak.
    Expected Result: 
    - Fungsi mengembalikan None dan tidak membuat file output.
    - Pesan error "Audio file {audio_path} is not valid. Please provide a valid .wav audio file." berhasil ditampilkan.
    """
    corrupted_wav = "/home/daffaraihandika/Downloads/eyes.wav"
    assert os.path.exists(corrupted_wav), "Test file does not exist"

    speaker1_path, speaker2_path = separate_audio(corrupted_wav, OUTPUT_FOLDER)
    captured = capfd.readouterr()

    assert speaker1_path is None and speaker2_path is None, "Fungsi harus mengembalikan None untuk file WAV rusak"
    assert "Audio file" in captured.out
    assert "is not valid. Please provide a valid .wav audio file." in captured.out
