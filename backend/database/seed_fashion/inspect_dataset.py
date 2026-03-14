"""
Run this to inspect the actual structure of the DeepFashion dataset.
Usage: python database/inspect_dataset.py
"""
from datasets import load_dataset

print("Loading dataset sample...")
dataset = load_dataset("Marqo/deepfashion-inshop", split="data")

print(f"\nTotal samples: {len(dataset)}")
print(f"\nColumn names: {dataset.column_names}")
print(f"\nFeatures: {dataset.features}")

print("\n--- First 3 rows ---")
for i in range(3):
    row = dataset[i]
    for col in dataset.column_names:
        val = row[col]
        if hasattr(val, 'size'):  # skip images
            print(f"  [{i}] {col}: <Image>")
        else:
            print(f"  [{i}] {col}: {val}")
    print()

# Show unique values for non-image columns
print("--- Unique values per column (first 20) ---")
for col in dataset.column_names:
    try:
        sample = dataset[col][:200]
        if not hasattr(sample[0], 'size'):  # skip image columns
            unique = list(set(sample))[:20]
            print(f"\n{col}: {unique}")
    except Exception as e:
        print(f"\n{col}: Could not inspect ({e})")