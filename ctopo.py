#!/usr/bin/python env

from random import randint
import argparse


parser = argparse.ArgumentParser(description="Create topodata from conf file")
parser.add_argument("-f", "--file", help="configuration file")
args = vars(parser.parse_args())

f = args['file']

# {
#     nodes: [
#         {id: 'node1', x: 100, y: 100},
#         {id: 'node2', x: 200, y: 200},
#         {id: 'node3', x: 300, y: 200},
#         {id: 'node4', x: 400, y: 200},

#     ],
#     links: [
#         {source: 'node1', target: 'node4'},
#         {source: 'node1', target: 'node2'},
#         {source: 'node2', target: 'node1'},
#         {source: 'node2', target: 'node3'},
#         {source: 'node3', target: 'node4'},
#         {source: 'node3', target: 'node2'},
#         {source: 'node4', target: 'node1'},
#         {source: 'node4', target: 'node3'},
#     ]
# }


with open(f, "r") as f:
    data = f.readlines()
for i in range(0, len(data)):
    data[i] = data[i].strip('\n')

for i in range(0, len(data)):
    if data[i] == "[links]":
        splitNum = i
        print(f"Splitted At: {splitNum}")
nodes = data[1: splitNum]
links = data[splitNum + 1:]
# print(nodes)
# print(links)

for i in range(0, len(nodes)):
    nodes[i] = nodes[i].split(":", 1)[0]
    nodes[i] = nodes[i].strip(" ")

source = []
target = []
for i in range(0, len(links)):
    links[i] = links[i].split("delay", 1)[0]
    
    s = (links[i].split(":")[0]).strip(" ")
    t = (links[i].split(":")[1]).strip(" ")
    
    source.append(s)
    target.append(t)

# print(nodes)
# print(links)

# print(source)
# print(target)


# creating nodes
nodeStr = 'nodes: ['
#         {id: 'node1', x: 100, y: 100},
#         {id: 'node2', x: 200, y: 200},
#         {id: 'node3', x: 300, y: 200},
#         {id: 'node4', x: 400, y: 200},

allNodes = []

for i in range(0, len(nodes)):
    x = randint(100, 500)
    y = randint(100, 500)

    eachNode = "{" + f'id: "{nodes[i]}", x: {x}, y: {y}' + "},\n"
    if i == len(nodes) - 1:
        eachNode = "{" + f'id: "{nodes[i]}", x: {x}, y: {y}' + "}\n"

    allNodes.append(eachNode)

nodeStr = nodeStr + ' '.join(allNodes) + "],"

# print(nodeStr)


linkStr = 'links: ['
    #         {source: 'node1', target: 'node4'},
    #         {source: 'node1', target: 'node2'},
    #         {source: 'node2', target: 'node1'},
    #         {source: 'node2', target: 'node3'},
    #         {source: 'node3', target: 'node4'},
    #         {source: 'node3', target: 'node2'},
    #         {source: 'node4', target: 'node1'},
    #         {source: 'node4', target: 'node3'},
    #     ]
allLinks = []
for i in range(0, len(links)):
    eachLink = "{" + f'source: "{source[i]}", target: "{target[i]}"' + "},\n"
    if i == len(links) - 1:
        eachLink = "{" + f'source: "{source[i]}", target: "{target[i]}"' + "}\n"

    allLinks.append(eachLink)

linkStr = linkStr + ' '.join(allLinks) + "]"

topo = "const customData = " + "[{" + nodeStr + linkStr + "}];\nexport default customData;"
print(topo)

with open("../NDN-Portal-Frontend/src/custom-topology/data.js", 'w') as f:
    f.writelines(topo)

