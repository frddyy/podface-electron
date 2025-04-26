import sys

def factorial(x):
    if x == 1:
        return 1
    else:
        return x * factorial(x - 1)

# Pastikan kita mendapatkan input
if len(sys.argv) < 2:
    print("No argument provided")
    sys.exit(1)

# Mendapatkan input dari sys.argv
data = int(sys.argv[1])

# Menjalankan fungsi factorial
result = factorial(data)

# Mengirimkan hasil output ke Electron (flush memastikan langsung keluar)
print(f"Factorial of {data} is {result}", flush=True)
