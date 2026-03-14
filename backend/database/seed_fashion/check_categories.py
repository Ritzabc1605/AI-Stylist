"""
Run this to see ALL unique category values in the full dataset.
Usage: python database/check_categories.py
"""
from datasets import load_dataset

print("Loading full dataset (this uses cache so should be fast)...")
dataset = load_dataset("Marqo/deepfashion-inshop", split="data")

print(f"\nTotal samples: {len(dataset)}\n")

# Get all unique values for category1, category2, category3
print("--- All unique category1 values ---")
cat1 = set(dataset["category1"])
print(sorted([c for c in cat1 if c]))

print("\n--- All unique category2 values ---")
cat2 = set(dataset["category2"])
print(sorted([c for c in cat2 if c]))

print("\n--- All unique category3 values ---")
cat3 = set(dataset["category3"])
print(sorted([c for c in cat3 if c]))

# Count per category2
print("\n--- Count per category2 ---")
from collections import Counter
counts = Counter(dataset["category2"])
for cat, count in sorted(counts.items(), key=lambda x: -x[1]):
    print(f"  {cat:<30} {count}")