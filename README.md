# Changelog

## Major Issues Fixed

- **IMPORTANT:** create **_.env_** file in root folder of project containing following: `SUDO_PASS=<sudo_pass>` (Removed the hard coded values from all scripts)

## Frontend

- The latest frontend is compiled and present in _build_ folder.
- The frontend is launched automatically by the NodeJS server using the **express.static("build")** module.
- Currently frontend contains the following functionalities:
  - Login (with Authentication)
  - Topology Builder (can safely add nodes, create links among nodes, and submit topology)
    - Can safely add nodes
    - Create links among nodes
    - Submit topology to backend which produces a _conf_ file utilized by the middleware.
  - Topology Viewer
    - During the first time only (as soon as topology is submitted through Topology Builder and Topology Viewer is loaded), loading is performed for 20 secs to let the middleware safely launch NDN stack and prevent early submission of commands.
    - Graph that shows the current running Topology
    - Clicking on _nodes_ of graph shows available commands for that node (running a commands hides the overlay and shows the result in _textarea_).
    - _Terminal_ that allows to run commands manually which are not available when clicked on nodes (There is an issue currently that if many commands are run terminal goes out of screen, just run **clear** command to reset it). The output of commands run on terminal are also visible on _textarea_.
    - _Start NDN Stack_ button that launches the NDN stack with the most recent _conf_ file.
    - _Stop NDN Stack_ button that kills the NDN stack currently running.

## Middleware

- Reduced all the unncessary files
- Put all the middleware connecting to NDN Stack into _middleware_ folder.
- Main script responsible for connection is **middleware.sh**. It launches 3 xterms, one for mini-ndn, one for getting the PID of mini-ndn and storing it, and third for **server.py**. You can manually run the NDN stack with the following command: `./middleware.sh <sudo_pass>`
- **ttyecho** is the **_crucial_** binary file that is used to forward commands to terminals.
  - **server.py** connects with the NodeJS server receives command, forward it to mini-ndn and respond the output back to NodeJS server.
  - **client.py** is just to test connection with _server.py_ and check output.
  - **downloadTopo.conf** is the topology configuration file downloaded from NodeJS server used to initialize the topology.
  - **killStack.sh** shell file is used to kill the NDN stack (3 xterms that are launched). Run it in the following manner: `./killStack <sudo_pass>`
  - _outputFormatter.py_ is useless and can be fully ignored, just there to understand how to format the mini-ndn output.
  - _mininetPID.txt, outputPID.txt, serverPID.txt, temp.txt, tty.txt_ are just temporary files used by NDN stack and can be safely deleted, they are created as needed.
- Refactored _server.py_, now server serves the request for a command, disconnects and listens for connection again.
- Fixed _middleware.sh and server.py_ so that sudo password is passed as a system argument instead of hardcoding.
- _middleware.sh_ now produces temporary _mininetPID.txt, serverPID.txt, outputPID.txt_ that store PID's of respective processes used by _killStack.sh_ script to kill.

## NodeJS Server

- When topology is submitted to **_/topology_** route, before sending the response back, **exec()** of _nodejs.child_process_ is used to launch the middleware, which starts the NDN stack on topology submission.
- Added **_/start_** route to start the middleware again using **exec()** function.
- Added **_/stop_** route to kill the NDN stack using **exec()** function.
