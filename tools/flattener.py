import json

def flatten_json(d, parent_key='', sep='.'):
    items = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten_json(v, new_key, sep=sep).items())
        else:
            items.append((new_key, v))
    return dict(items)

# Example usage
with open("input.json", "r", encoding="utf-8") as f:
    data = json.load(f)

flattened = flatten_json(data)

print(json.dumps(flattened, indent=2, ensure_ascii=False))
