import os
import pytest
from scripts.utils import is_valid_wav_file

def test_valid_wav_file():
    """
    Menguji file WAV yang valid.
    Skenario ini akan memastikan bahwa file WAV yang valid diproses dengan benar oleh fungsi.
    
    Expected Result: Fungsi is_valid_wav_file harus mengembalikan True untuk file WAV yang valid.
    """

    # Assuming you have a valid .wav file for testing, change the path accordingly
    valid_wav_file = "/home/daffaraihandika/TA/seed-vc/examples/source/source_s4.wav"
    
    # Make sure the file exists for the test
    assert os.path.exists(valid_wav_file), "Test file does not exist"

    # Run the test
    result = is_valid_wav_file(valid_wav_file)
    
    # Assert the function returns True for a valid .wav file
    assert result is True, "The file should be valid, but the function returned False"

def test_invalid_wav_file():
    """
    Menguji file yang tidak valid (misalnya file dengan ekstensi .wav tetapi berisi bukan audio WAV).
    Skenario ini akan memastikan bahwa fungsi dapat menangani file dengan ekstensi .wav tetapi formatnya bukan WAV audio.
    
    Expected Result: Fungsi is_valid_wav_file harus mengembalikan False untuk file yang bukan WAV audio.
    """

    # Assuming you have an invalid .wav file for testing (e.g., an MP3 file)
    invalid_wav_file = "/home/daffaraihandika/face-reconstruction/MICA/demo/input/subject1.png"
    
    # Make sure the file exists for the test
    assert os.path.exists(invalid_wav_file), "Test file does not exist"
    
    # Run the test
    result = is_valid_wav_file(invalid_wav_file)
    
    # Assert the function returns False for an invalid WAV file
    assert result is False, "The file should be invalid, but the function returned True"

def test_non_existent_file():
    """
    Menguji file yang tidak ada.
    Skenario ini akan memastikan bahwa fungsi dapat menangani file yang tidak ada di filesystem.
    
    Expected Result: Fungsi is_valid_wav_file harus mengembalikan False ketika file tidak ditemukan.
    """

    # Test case for a file that does not exist
    non_existent_file = "test_audio/non_existent.wav"
    
    # Run the test
    result = is_valid_wav_file(non_existent_file)
    
    # Assert the function returns False when the file does not exist
    assert result is False, "The file should not exist, but the function returned True"

def test_corrupted_wav_file():
    """
    Menguji file WAV yang rusak (corrupted).
    Skenario ini memastikan bahwa file WAV yang rusak atau tidak sesuai dengan format audio WAV meskipun memiliki ekstensi .wav.
    
    Expected Result: Fungsi is_valid_wav_file harus mengembalikan False untuk file WAV yang rusak.
    """

    # Test case for a corrupted WAV file
    corrupted_wav_file = "/home/daffaraihandika/Downloads/eyes.wav"
    
    # Make sure the file exists for the test (this file should be corrupted in your local test setup)
    assert os.path.exists(corrupted_wav_file), "Test file does not exist"
    
    # Run the test
    result = is_valid_wav_file(corrupted_wav_file)
    
    # Assert the function returns False for a corrupted WAV file
    assert result is False, "The file should be corrupted, but the function returned True"

def test_no_file_input():
    """
    Menguji fungsi dengan input yang tidak valid (misalnya, None atau string kosong).
    Skenario ini memastikan bahwa fungsi dapat menangani input yang tidak valid atau tidak ada.

    Expected Result: Fungsi is_valid_wav_file harus mengembalikan False jika tidak ada input yang diberikan (None atau string kosong).
    """
    
    # Test case for None
    result = is_valid_wav_file(None)
    assert result is False, "The file should be invalid, but the function returned True for None input"

    # Test case for empty string
    result = is_valid_wav_file("")
    assert result is False, "The file should be invalid, but the function returned True for empty string input"

