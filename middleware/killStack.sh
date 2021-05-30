pass=$1
mininetPID=$(cat mininetPID.txt)
outputPID=$(cat outputPID.txt)
serverPID=$(cat serverPID.txt)
echo $mininetPID $outputPID $serverPID

echo $pass | sudo -S kill $mininetPID
echo $pass | sudo -S kill $outputPID
echo $pass | sudo -S kill $serverPID