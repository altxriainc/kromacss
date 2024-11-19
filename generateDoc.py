import os

def clean_code(content):
    """
    Remove unused newlines and extra spaces from the content.

    Parameters:
        content (str): The content of the file.

    Returns:
        str: Cleaned content with minimal spaces and newlines.
    """
    # Remove extra newlines and spaces while preserving code structure
    return "\n".join(line.strip() for line in content.splitlines() if line.strip())

def extract_file_info(file_path):
    """
    Extract the first inline comment and cleaned content of the file.

    Parameters:
        file_path (str): The file path.

    Returns:
        tuple: A tuple containing the comment and cleaned file content.
    """
    comment = "No description provided."
    content = ""

    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()
        # Check if the first line has a comment
        if lines:
            first_line = lines[0].strip()
            if first_line.startswith("//") or first_line.startswith("/*") or first_line.startswith("#"):
                comment = first_line.lstrip("/#* ").rstrip(" */")
        # Clean the code by removing extra spaces and blank lines
        content = clean_code("".join(lines))

    return comment, content

def generate_documentation(root_folder, output_file):
    """
    Generate a documentation file by reading all CSS and JS files.

    Parameters:
        root_folder (str): The root folder to start searching.
        output_file (str): The output TXT file.
    """
    markdown_content = []

    for root, _, files in os.walk(root_folder):
        for file in files:
            if file.endswith(".css") or file.endswith(".js"):
                file_path = os.path.join(root, file)
                comment, content = extract_file_info(file_path)
                # Add content to markdown with separators
                markdown_content.append(f"## File: {file}\n")
                markdown_content.append(f"**Description:** {comment}\n")
                markdown_content.append("\n```css\n" if file.endswith(".css") else "\n```javascript\n")
                markdown_content.append(content)
                markdown_content.append("\n```\n")
                markdown_content.append("\n---\n")

    # Write to the output file
    with open(output_file, 'w', encoding='utf-8') as output:
        output.write("# Auto-Generated Documentation\n\n")
        output.write("".join(markdown_content))

if __name__ == "__main__":
    # Define the root folder and output file
    root_folder = os.getcwd()  # Change this if you want to specify a different root
    output_file = "documentation.txt"

    # Generate the documentation
    generate_documentation(root_folder, output_file)
    print(f"Documentation generated: {output_file}")
