#!/bin/bash

# Get the sudo password to be used later on
pass=$1

# Kill any process running on port 6500 just in case
echo $pass | sudo -S kill $(echo $pass | sudo -S lsof -t -i:6500)

xterm -e curl http://localhost:3001/file --output downloadTopo.conf

# Open a terminal so that we can run mini-ndn/mininet on it
xterm -e "tty > tty.txt; bash" &
termPID=$!
sleep 3
mininetPTS=$( cat tty.txt )
echo termPID = $termPID , mininetPTS = $mininetPTS

# Run mininet on the newly opened terminal
# echo $pass | sudo -S ./ttyecho -n $mininetPTS "sudo mn --custom downloadTopo.py --topo $2" 
echo $pass | sudo -S ./ttyecho -n $mininetPTS "sudo python ~/mini-ndn/examples/mnndn.py downloadTopo.conf"
echo $pass | sudo -S ./ttyecho -n $mininetPTS "$pass"

# Open a terminal that we will use to listen to the output of commands
xterm -e "tty > tty.txt; bash" &
outputPID=$!
sleep 3
outputPTS=$( cat tty.txt )
echo outputPID = $outputPID , outputPTS = $outputPTS

# Get PID of mini-ndn/mininet to listen to its output
echo $pass | sudo -S ./ttyecho -n $outputPTS "ps aux | grep 'mnndn' > temp.txt" &

sleep 3

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
sleep 3
serverPTS=$( cat tty.txt )
echo serverPID = $serverPID , serverPTS = $serverPTS

# Run the server that listens for command on the newly opened terminal
echo $pass | sudo -S ./ttyecho -n $serverPTS "python3 ./server2.py $mininetPTS ${array[1]}"