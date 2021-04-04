import re
import sys
import time
import socket
import requests
import simplejson
import subprocess

HOST = '127.0.0.1'
PORT = 6500

# We are passing 2 arguments in socket.socket() function to create a socket object
# 1. Address Family, that is internet protocol we are using such as IPv4 or IPv6
#   AF_INET stands for (AddressFamily_InterNET) and is IPv4 where as AF_INET6 is IPv6
# 2. The second parameter is the protocol we are using the Address Family. For example,
#   in ipv4 we are using SOCK_STREAM (socket stream) that is the TCP protocol and SOCK_DGRAM is the UDP protocol
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    
    # Now we will be listening on a port on which the server will send the data on 
    # therefore, we need to associate (bind) the port to our address to listen for the receiving data
    # bind() function receives a tuple of (HOST, PORT) where HOST can be hostname (www.google.com), 
    # ip address, or empty string (listen on all ip addresses) and PORT is the port number we are listening on. 
    s.bind( (HOST, PORT) )


    # listen() enables a server to accept() connections.
    s.listen()



    # accept() blocks and waits for an incoming connection. When a client connects, 
    # it returns a new socket object representing the connection and a tuple holding 
    # the address of the client. The tuple will contain (host, port) for IPv4 connections.

    # One thing that’s imperative to understand is that we now have a new socket object 
    # from accept(). This is important since it’s the socket that we will use to 
    # communicate with the client.
    conn, addr = s.accept()

    with conn:
        print("connected by: ", addr)

        # An infinite while loop is used to loop over function calls made by the client
        # to conn.recv(). This reads whatever the data client has send and echo it back 
        # using conn.sendall()

        # If conn.recv() returns an empty bytes object, b'', then the client closed 
        # the connection and the loop is terminated.
        url = "http://localhost:3001/output"
        headers = {"Content-type" : "application/json"}
        while True:
            data = conn.recv(1024)
            cmd = str(data, 'ascii')
            if(cmd == ""):
                continue
            else:
                p = subprocess.Popen("echo Tameem123 | sudo -S strace -p {} -e write -s 9999 -o ~/Desktop/PortListener/output.txt &".format(sys.argv[2]), shell=True)
                time.sleep(1)
                subprocess.run("echo Tameem123 | sudo -S ./ttyecho -n {} '{}'".format(sys.argv[1], cmd), shell=True)
                # p.terminate()
                # p.wait()

                if(cmd == "iperf"):
                    time.sleep(10)
                else:
                    time.sleep(10)
                file = open("output.txt", "r")

                line = file.readline()
                output = []

                while line != "":
                    x = re.search("\".*\"", line)
                    if x == None:
                        output.append(line)
                    else: 
                        output.append(x.group())
                    line = file.readline()

                output.pop()
                for eachline in output:
                    print(eachline)

                payload = {"output": "".join(output)}
                res = requests.post(url, data= simplejson.dumps(payload), headers=headers)
                conn.sendall(bytes("".join(output), 'ascii'))
            # file = open("cmd.txt", "w")
            # file.write(cmd)
            # file.close()
            # s.close()
            # exit()