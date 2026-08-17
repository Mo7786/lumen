import re

t = open(".verify-lumen-pdp.js", encoding="utf-8").read()
print("LEN", len(t))
print("has setTimeout sync clear:", "lumenSyncing=\"0\"" in t or "lumenSyncing='0'" in t)
for m in re.finditer(r".{0,50}lumenSyncing.{0,90}", t):
    print(m.group(0))
    print("---")
