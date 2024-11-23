import os
import json

# Paths
CSS_COMPONENTS_DIR = "src/css/components"
CSS_UTILS_DIR = "src/css/utils"
CSS_BASE_FILES = ["src/css/design-tokens.css", "src/css/base.css"]
JS_COMPONENTS_DIR = "src/js/components"
BUNDLE_CSS_PATH = "src/css/bundle.css"
BUNDLE_JS_PATH = "src/js/bundle.js"
PACKAGE_JSON_PATH = "package.json"

def get_package_metadata():
    """Reads and extracts metadata from package.json"""
    try:
        with open(PACKAGE_JSON_PATH, "r", encoding="utf-8") as f:
            package_data = json.load(f)
        metadata = {
            "name": package_data.get("name", "Unknown"),
            "version": package_data.get("version", "0.0.0"),
            "description": package_data.get("description", "No description available."),
            "author": package_data.get("author", "Unknown"),
            "license": package_data.get("license", "Unlicensed"),
        }
        return metadata
    except FileNotFoundError:
        print(f"Error: {PACKAGE_JSON_PATH} not found.")
        return None

def add_file_to_bundle(file_path, bundle_file):
    """Appends the content of a file to the bundle"""
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8", errors="replace") as f:
            bundle_file.write(f"/* --- {os.path.basename(file_path)} --- */\n")
            bundle_file.write(f.read())
            bundle_file.write("\n\n")
    else:
        print(f"Warning: {file_path} not found and will not be included in the bundle.")

def add_directory_to_bundle(directory, bundle_file, file_extension):
    """Appends the content of all files in a directory to the bundle"""
    for root, _, files in os.walk(directory):
        for file in sorted(files):  # Sort files alphabetically for consistency
            if file.endswith(file_extension):
                file_path = os.path.join(root, file)
                add_file_to_bundle(file_path, bundle_file)

def create_css_bundle(bundle_path, metadata):
    """Creates the CSS bundle with the specified order of files"""
    try:
        with open(bundle_path, "w", encoding="utf-8") as bundle_file:
            # Write metadata header
            bundle_file.write(f"/*\n")
            bundle_file.write(f"Project: {metadata['name']}\n")
            bundle_file.write(f"Version: {metadata['version']}\n")
            bundle_file.write(f"Description: {metadata['description']}\n")
            bundle_file.write(f"Author: {metadata['author']}\n")
            bundle_file.write(f"License: {metadata['license']}\n")
            bundle_file.write(f"*/\n\n")

            # Add base CSS files
            for base_file in CSS_BASE_FILES:
                add_file_to_bundle(base_file, bundle_file)

            # Add utility CSS files
            add_directory_to_bundle(CSS_UTILS_DIR, bundle_file, ".css")

            # Add component CSS files
            add_directory_to_bundle(CSS_COMPONENTS_DIR, bundle_file, ".css")

        print(f"{bundle_path} created successfully.")
    except Exception as e:
        print(f"Error creating {bundle_path}: {e}")

def create_js_bundle(directory, bundle_path, metadata):
    """Creates a JS bundle by combining all files in the directory"""
    try:
        with open(bundle_path, "w", encoding="utf-8") as bundle_file:
            # Write metadata header
            bundle_file.write(f"/*\n")
            bundle_file.write(f"Project: {metadata['name']}\n")
            bundle_file.write(f"Version: {metadata['version']}\n")
            bundle_file.write(f"Description: {metadata['description']}\n")
            bundle_file.write(f"Author: {metadata['author']}\n")
            bundle_file.write(f"License: {metadata['license']}\n")
            bundle_file.write(f"*/\n\n")

            # Add content from each file in the directory
            add_directory_to_bundle(directory, bundle_file, ".js")

        print(f"{bundle_path} created successfully.")
    except Exception as e:
        print(f"Error creating {bundle_path}: {e}")

def main():
    # Fetch package metadata
    metadata = get_package_metadata()
    if not metadata:
        return

    # Create CSS bundle
    create_css_bundle(BUNDLE_CSS_PATH, metadata)

    # Create JS bundle
    create_js_bundle(JS_COMPONENTS_DIR, BUNDLE_JS_PATH, metadata)

if __name__ == "__main__":
    main()
