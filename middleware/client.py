import socket 

HOST = '127.0.0.1'
PORT = 6500

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:

    s.connect( (HOST, PORT) )
    
    sendMoreData = 'y'
    while sendMoreData.lower() == 'y':
        data = input("Enter data to send: ")
        s.sendall(bytes(data, 'ascii'))
        data = s.recv(1024)
        print('Received', data.decode('ascii'))

        sendMoreData = input("Do you want to send more data?(y/n): ")