import os
import pytest
from scripts.enhance_audio import enhance_audio

OUTPUT_FOLDER = './speechbrain/output'

def test_valid_audio_enhancement(capfd):
    """
    Menguji fungsi enhance_audio dengan file audio WAV valid untuk dua pembicara.
    Tujuan: Memastikan fungsi dapat memproses file audio yang valid dan menghasilkan file hasil enhancement.
    
    Expected Result: 
    - Fungsi mengembalikan path kedua file output hasil enhancement yang tersimpan secara fisik di komputer.
    - Pesan "Speech enhancement completed successfully!" berhasil ditampilkan.
    """

    valid_speaker_1 = "/home/daffaraihandika/TA/podface-electron/speechbrain/output/speaker_1.wav"
    valid_speaker_2 = "/home/daffaraihandika/TA/podface-electron/speechbrain/output/speaker_2.wav"

    assert os.path.exists(valid_speaker_1)
    assert os.path.exists(valid_speaker_2)

    out1, out2 = enhance_audio(valid_speaker_1, valid_speaker_2, OUTPUT_FOLDER)

    captured = capfd.readouterr()

    assert out1 is not None and out2 is not None
    assert os.path.exists(out1)
    assert os.path.exists(out2)
    assert "Speech enhancement completed successfully!" in captured.out

def test_invalid_audio_file(capfd):
    """
    Menguji fungsi enhance_audio dengan salah satu file input bukan format WAV yang valid.
    Tujuan: Memastikan fungsi dapat mendeteksi file yang tidak valid dan menghindari pemrosesan lebih lanjut.
    
    Expected Result:
    - Fungsi mengembalikan None untuk kedua output file.
    - Pesan error "One or both audio files are not valid." berhasil ditampilkan.
    """

    invalid_file = "/home/daffaraihandika/face-reconstruction/MICA/demo/input/subject1.png"
    valid_file = "/home/daffaraihandika/TA/podface-electron/speechbrain/output/speaker_2.wav"

    assert os.path.exists(invalid_file)
    assert os.path.exists(valid_file)

    out1, out2 = enhance_audio(invalid_file, valid_file, OUTPUT_FOLDER)
    captured = capfd.readouterr()

    assert out1 is None and out2 is None
    assert "One or both audio files are not valid." in captured.out

def test_non_existent_file(capfd):
    """
    Menguji fungsi enhance_audio dengan file input yang tidak ada di sistem.
    Tujuan: Memastikan fungsi dapat menangani kasus file tidak ditemukan dengan benar.
    
    Expected Result:
    - Fungsi mengembalikan None untuk kedua output file.
    - Pesan error "One or both audio files are not valid." berhasil ditampilkan.
    """

    non_existent = "/path/to/non_existent.wav"
    valid_file = "/home/daffaraihandika/TA/podface-electron/speechbrain/output/speaker_2.wav"

    out1, out2 = enhance_audio(non_existent, valid_file, OUTPUT_FOLDER)
    captured = capfd.readouterr()

    assert out1 is None and out2 is None
    assert "One or both audio files are not valid." in captured.out

def test_corrupted_audio_file(capfd):
    """
    Menguji fungsi enhance_audio dengan file WAV yang rusak atau korup.
    Tujuan: Memastikan fungsi dapat mendeteksi file WAV rusak dan menghindari pemrosesan lebih lanjut.
    
    Expected Result:
    - Fungsi mengembalikan None untuk kedua output file.
    - Pesan error "One or both audio files are not valid." berhasil ditampilkan.
    """
    
    corrupted_file = "/home/daffaraihandika/Downloads/eyes.wav"
    valid_file = "/home/daffaraihandika/TA/podface-electron/speechbrain/output/speaker_2.wav"

    assert os.path.exists(corrupted_file)
    assert os.path.exists(valid_file)

    out1, out2 = enhance_audio(corrupted_file, valid_file, OUTPUT_FOLDER)
    captured = capfd.readouterr()

    assert out1 is None and out2 is None
    assert "One or both audio files are not valid." in captured.out
