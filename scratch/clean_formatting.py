import os
import re

def clean_html(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace newlines followed by spaces within tags or sentences (simplified)
    # This specifically targets the "broken" lines I saw in the footers and paragraphs
    # Example: <span>42 Clockmaker's Lane,\n                NY 10012</span>
    
    # Target 1: Newlines within tags like <span>...</span>
    content = re.sub(r'<span>\s*(.*?)\s*</span>', lambda m: f'<span>{m.group(1).replace("\\n", " ").strip()}</span>', content, flags=re.DOTALL)
    
    # Target 2: Newlines within <p>...</p>
    content = re.sub(r'<p>\s*(.*?)\s*</p>', lambda m: f'<p>{m.group(1).replace("\\n", " ").strip()}</p>', content, flags=re.DOTALL)

    # Target 3: Specific common patterns seen in the broken files
    content = content.replace('Lane,\n                NY', 'Lane, NY')
    content = content.replace('service.com</span>', 'service.com</span>') # Check if split
    
    # Actually, a more general approach for the "broken" lines:
    # If a line ends with a word and the next line starts with a word (and it's inside a tag), join them.
    # But that's risky. Let's just do manual fixes for the obvious ones in the footer.
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    root_dir = r'c:\Users\ELCOT\Desktop\live project'
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.html'):
                clean_html(os.path.join(root, file))

if __name__ == "__main__":
    main()
