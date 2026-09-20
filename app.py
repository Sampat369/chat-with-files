import tkinter as tk
from tkinter import filedialog

from scanner import scan_folder
from loader import load_file
from chunker import chunk_text
from vector_store import add_chunks, search_chunks
from llm import ask_llm


# Open Windows folder picker
root = tk.Tk()
root.withdraw()

folder = filedialog.askdirectory(
    title="Select a folder to analyze"
)

# User cancelled
if not folder:
    print("No folder selected.")
    exit()


print(f"\nSelected folder: {folder}")

files = scan_folder(folder)

print(f"\nFound {len(files)} files.\n")


for file in files:

    print("=" * 70)
    print(f"Processing: {file}")

    content = load_file(file)

    if content is None:
        print("Unsupported/binary file - skipped")
        continue

    chunks = chunk_text(content)

    print(f"Created {len(chunks)} chunks")

    add_chunks(chunks, file)

    print("Added to vector database")


print("\n" + "=" * 70)
print("FILE ANALYSIS COMPLETE")
print("=" * 70)


while True:

    question = input("\nAsk a question (type 'exit' to quit): ")

    if question.lower() == "exit":
        break

    results = search_chunks(question, n_results=5)

    documents = results["documents"][0]

    context = "\n\n".join(documents)

    print("\nThinking...\n")

    answer = ask_llm(question, context)

    print("=" * 70)
    print(answer)
    print("=" * 70)

#  python app.py