#!/bin/bash

# read -p "Enter your command: " command
pass=Tameem123

echo $pass | sudo -S fuser -k 6500/tcp

xterm -e curl http://localhost:3001/file --output downloadTopo.py
# echo $pass | sudo -S ./ttyecho -n /dev/pts/7 "sudo mn"
# echo $pass | sudo -S ./ttyecho -n /dev/pts/7 $pass
# xterm -e "sudo strace -p 7717 -e write -s 9999 -o ~/Desktop/PortListener/output.txt" &
# echo $pass | sudo -S ./ttyecho -n /dev/pts/16 $pass
# terminalPID=$!
# sudo fuser -k 6500/tcp
# sudo python3 server.py 
# serverPID=$!
# cmd=$( cat cmd.txt )
# echo The command is $cmd
# sudo ./ttyecho -n /dev/pts/7 "$cmd"
# kill -9 $serverPID

# Open a terminal so that we can run mini-ndn/mininet on it
xterm -e "tty > tty.txt; bash" &
termPID=$!
sleep 1
mininetPTS=$( cat tty.txt )
echo termPID = $termPID , mininetPTS = $mininetPTS

# Run mininet on the newly opened terminal
# echo $pass | sudo -S ./ttyecho -n $mininetPTS "sudo mn --custom downloadTopo.py --topo $1" 
echo $pass | sudo -S ./ttyecho -n $mininetPTS "sudo python ~/mini-ndn/examples/mnndn.py" 
echo $pass | sudo -S ./ttyecho -n $mininetPTS "$pass"

# # Open another terminal so that we can run listening server on that
# xterm -e "tty > tty.txt; bash" &
# serverPID=$!
# sleep 1
# serverPTS=$( cat tty.txt )
# echo serverPID = $serverPID , serverPTS = $serverPTS

# # Run the server that listens for command on the newly opened terminal
# echo $pass | sudo -S ./ttyecho -n $serverPTS "python3 ./server.py $mininetPTS"

# Open a terminal that we will use to listens to the output of commands
xterm -e "tty > tty.txt; bash" &
outputPID=$!
sleep 1
outputPTS=$( cat tty.txt )
echo outputPID = $outputPID , outputPTS = $outputPTS

# Get PID of mini-ndn/mininet to listen to its output
echo $pass | sudo -S ./ttyecho -n $outputPTS "ps aux | grep 'mn' > temp.txt" &

sleep 2

filename='temp.txt'
n=1
while read -r line; do
if [ $n -eq 2 ]
then
    data=$line
fi
n=$(($n+1))
done < $filename

read -a array <<< "$data"
echo "Mininet PID: ${array[1]}"

# echo $pass | sudo -S ./ttyecho -n $outputPTS "echo $pass | sudo -S strace -p ${array[1]} -e write -s 9999 -o ~/Desktop/PortListener/output.txt" &

# Open another terminal so that we can run listening server on that
xterm -e "tty > tty.txt; bash" &
serverPID=$!
sleep 1
serverPTS=$( cat tty.txt )
echo serverPID = $serverPID , serverPTS = $serverPTS

# Run the server that listens for command on the newly opened terminal
echo $pass | sudo -S ./ttyecho -n $serverPTS "python3 ./server.py $mininetPTS ${array[1]}"