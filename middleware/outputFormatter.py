import re

file = open("/home/ttg/output.txt", "r")

line = file.readline()
output = []

while line != "":
    y = re.search("write\(2, \".*\", [0-9]+\)[ ]*=[ ]*[0-9]+\n", line)
    x = re.search("\".*\"", line)
    if y != None:
        if x.group() == '"mini-ndn> "':
            break
        elif x.group() == '"\\n"':
            line = file.readline()
            output.append("\n")
            continue
        elif x.group() == '"\\r"':
            line = file.readline()
            output.append("\r")
            continue
        else:
            txt = x.group()
            txt = txt.replace("\\n", "\n")
            txt = txt.replace("\\r", "\r")
            output.append(txt)
    line = file.readline()

output.pop()

print("OUTPUT SENT TO FRONTEND:")
print("".join(output), end='')