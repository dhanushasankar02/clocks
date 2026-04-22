import os
import re

dir_path = "c:\\Users\\ELCOT\\Desktop\\live project"

pattern_strict = re.compile(
    r'\s*<div class="user-ddrop">\s*<button class="icon-btn" id="userToggle" aria-label="Account"><i class="fa-solid fa-circle-user"></i></button>\s*<div class="user-ddrop-menu" id="userDropMenu">.*?</div>\s*</div>',
    re.DOTALL
)

for file in os.listdir(dir_path):
    if file.endswith('.html'):
        filepath = os.path.join(dir_path, file)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content, count = pattern_strict.subn('', content)
        if count > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Modified {file} (removed {count} instances)')
