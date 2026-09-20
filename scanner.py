from pathlib import Path


def scan_folder(folder_path):
    files = []

    for path in Path(folder_path).rglob("*"):
        if path.is_file():
            files.append(path)

    return files