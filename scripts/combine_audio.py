from pydub import AudioSegment
import sys

def report_progress(percentage):
    print(f"PROGRESS:{percentage}")
    sys.stdout.flush()

def combine_audio(audio_file1, audio_file2, output_file):
    # Load audio files
    report_progress(5)
    audio1 = AudioSegment.from_file(audio_file1)
    audio2 = AudioSegment.from_file(audio_file2)

    # Set duration of both audios to be the same length by adding silence to the shorter one
    if len(audio1) > len(audio2):
        audio2 = audio2 + AudioSegment.silent(duration=len(audio1) - len(audio2))
    elif len(audio2) > len(audio1):
        audio1 = audio1 + AudioSegment.silent(duration=len(audio2) - len(audio1))

    # Combine the two audio files by overlaying them
    combined_audio = audio1.overlay(audio2)

    # Export the combined audio to the specified output file
    report_progress(10)
    combined_audio.export(output_file, format="wav")

    print(f"Audio successfully combined and saved to {output_file}")

# Main execution: if the script is run directly, use command line arguments
if __name__ == "__main__":
    # Get paths from the command line arguments
    audio_file1 = sys.argv[1]  # Path to the first audio file
    audio_file2 = sys.argv[2]  # Path to the second audio file
    output_file = sys.argv[3]  # Path to save the combined audio

    # Call the function to combine the audio files
    combine_audio(audio_file1, audio_file2, output_file)
