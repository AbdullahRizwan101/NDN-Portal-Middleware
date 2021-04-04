import re

file = open("./output.txt", "r")

line = file.readline()
output = []

while line != "":
    x = re.search("\".*\"", line)
    output.append(x.group())
    line = file.readline()

output.pop()
for eachline in output:
    print(eachline)