import re
from pathlib import Path

results = list(Path(".").rglob("*.ts"))
regex = r"AsyncStorage\.([a-zA-Z]+)"

for result in results:
    with open(result, "r") as file:
        content = file.read()

    if not "import AsyncStorage" in content:
        continue
    
    matches = list(set(re.findall(regex, content, re.MULTILINE)))
    print(matches)

    content = content.replace("AsyncStorage.", "")
    content = content.replace("import AsyncStorage ", f"import {{ {', '.join(matches)} }} ")

    with open(result, "w") as file:
        file.write(content)


