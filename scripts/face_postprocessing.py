import trimesh
import sys

def report_progress(percentage):
    print(f"PROGRESS:{percentage}")
    sys.stdout.flush()

def face_postprocessing(mica_mesh_path, aligned_mesh_path):
    
    # Tentukan nilai scaling dan translasi secara default di dalam fungsi
    scaling_factor = 0.4  # Faktor skala untuk mengurangi ukuran mesh (misalnya 0.4 berarti 40% dari ukuran asli)
    translation_y = 0.05  # Translasi pada sumbu Y (misalnya, geser 0.05 unit ke atas)

    try:
        # Muat mesh dari MICA
        report_progress(85)
        mica_mesh = trimesh.load(mica_mesh_path)
        print("Mesh loaded successfully from MICA!")

        # Hanya gunakan vertices dan faces (hapus atribut tambahan)
        simple_mesh = trimesh.Trimesh(vertices=mica_mesh.vertices, faces=mica_mesh.faces)

        # Normalize mesh (pusatkan ke (0, 0, 0) dan atur skala ke 1)
        simple_mesh.vertices -= simple_mesh.center_mass  # Pusatkan ke (0, 0, 0)
        simple_mesh.vertices /= simple_mesh.scale       # Atur skala ke 1

        # Apply scaling untuk mengurangi ukuran (kalikan vertices dengan scaling_factor)
        simple_mesh.vertices *= scaling_factor  # Scale down the model

        # Geser mesh ke atas pada sumbu Y
        simple_mesh.vertices[:, 1] += translation_y  # Translasi pada sumbu Y (kolom ke-2 dari vertices)

        # Simpan file mesh baru
        report_progress(95)
        simple_mesh.export(aligned_mesh_path, file_type='ply')
        print(f"Scaled and translated mesh saved to: {aligned_mesh_path}")

    except Exception as e:
        print(f"Error processing MICA mesh: {e}")


# Cek apakah script dipanggil langsung, jika ya, jalankan fungsi dengan argumen yang diterima dari command line
if __name__ == "__main__":
    # Ambil argumen input dan output dari command line
    mica_mesh_path = sys.argv[1]  # File mesh input dari MICA
    aligned_mesh_path = sys.argv[2]  # File output yang akan disimpan

    # Menjalankan fungsi dengan nilai default untuk scaling dan translasi
    face_postprocessing(mica_mesh_path, aligned_mesh_path)
