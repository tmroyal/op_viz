# OSC Visualizer

A p5.js-based visualizer for incoming OSC (Open Sound Control) messages, built with TypeScript.

## Features

- Real-time visualization of OSC messages as animated particles
- Each OSC address gets a unique color based on its hash
- Particle size is determined by numeric values in the message
- Message log showing recent OSC messages
- WebSocket-based OSC connection

## Setup

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Then open your browser to `http://localhost:3000`

## OSC WebSocket Bridge

Since browsers cannot receive OSC messages directly, you need a WebSocket bridge server. Here are two options:

### Option 1: Simple Node.js Bridge (Recommended)

Create a file `osc-bridge.js`:

```javascript
const { WebSocketServer } = require('ws');
const osc = require('osc');

const wss = new WebSocketServer({ port: 8081 });
const udpPort = new osc.UDPPort({
  localAddress: '0.0.0.0',
  localPort: 9000,
  metadata: true
});

udpPort.open();

wss.on('connection', (ws) => {
  console.log('Client connected');

  const messageHandler = (oscMsg) => {
    ws.send(JSON.stringify(oscMsg));
  };

  udpPort.on('message', messageHandler);

  ws.on('close', () => {
    console.log('Client disconnected');
    udpPort.off('message', messageHandler);
  });
});

console.log('OSC WebSocket bridge running on ws://localhost:8081');
console.log('Listening for OSC on UDP port 9000');
```

Install dependencies and run:

```bash
npm install ws osc
node osc-bridge.js
```

### Option 2: Using Python with python-osc

```python
from pythonosc.dispatcher import Dispatcher
from pythonosc.osc_server import BlockingOSCUDPServer
import asyncio
import websockets
import json

clients = set()

async def websocket_handler(websocket):
    clients.add(websocket)
    try:
        await websocket.wait_closed()
    finally:
        clients.remove(websocket)

def handle_osc(address, *args):
    message = {
        "address": address,
        "args": list(args)
    }
    for client in clients.copy():
        asyncio.create_task(client.send(json.dumps(message)))

dispatcher = Dispatcher()
dispatcher.set_default_handler(handle_osc)

# Run servers...
```

## Sending Test OSC Messages

### Using the Included Test Script (Easiest)

A random OSC message generator is included for testing:

```bash
pip install python-osc
python test_osc.py
```

This will send random OSC messages with various addresses and values. Press Ctrl+C to stop.

### Using SuperCollider

```supercollider
n = NetAddr("127.0.0.1", 9000);
n.sendMsg("/test", 0.5, 0.8);
```

### Using Python

```python
from pythonosc import udp_client

client = udp_client.SimpleUDPClient("127.0.0.1", 9000)
client.send_message("/test", [0.5, 0.8])
```

### Using Pure Data

Create a `sendOSC` object and configure it to send to `127.0.0.1:9000`

## Usage

1. Start the OSC WebSocket bridge on port 8081
2. Start the visualizer with `npm run dev`
3. Click "Connect" in the browser
4. Send OSC messages to port 9000 (or whichever port you configured)
5. Watch the visualization respond to your messages!

## Customization

- **Visualizer.ts**: Modify particle behavior, colors, and rendering
- **OSCClient.ts**: Adjust WebSocket connection handling
- **main.ts**: Change canvas size, color mode, or add new features

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.
