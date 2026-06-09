import urllib.request, json
req = urllib.request.Request('https://trello.com/b/MKzMVhhK.json', headers={'User-Agent': 'Mozilla/5.0'})
res = urllib.request.urlopen(req)
data = json.loads(res.read())

with open('trello_output.txt', 'w', encoding='utf-8') as f:
    f.write("--- LISTS ---\n")
    for l in data['lists']:
        f.write(f"[{l['id']}] {l['name']}\n")

    f.write("\n--- CARDS ---\n")
    for c in data['cards']:
        f.write(f"[{c['idList']}] {c['name']}\n")
        if c['desc']:
            f.write(f"{c['desc'][:1000]}\n")
        f.write("-" * 20 + "\n")
