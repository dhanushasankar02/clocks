import os, glob, re

target = '<a href="./login.html" style="background: #C6A43B; color: #1a1510; padding: 0.4rem 1.2rem; border-radius: 4px; font-weight: 600; text-decoration: none; margin-left: 10px; font-size: 0.9rem; font-family: \'DM Sans\', sans-serif;">Login</a>'

for f in glob.glob('*.html'):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Replace all login.html nav-actions link
    new_content = re.sub(r'<a href=\"\./login\.html\"[^>]*>Login</a>', target, content)
    
    if new_content != content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f'Updated {f}')
