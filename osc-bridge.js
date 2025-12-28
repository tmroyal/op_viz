import { WebSocketServer } from 'ws';
import osc from 'osc';

const WS_PORT = 8081;
const OSC_PORT = 9000;

const wss = new WebSocketServer({ port: WS_PORT });

const udpPort = new osc.UDPPort({
  localAddress: '0.0.0.0',
  localPort: OSC_PORT,
  metadata: true
});

udpPort.on('ready', () => {
  console.log(`OSC UDP port listening on ${OSC_PORT}`);
});

udpPort.on('error', (error) => {
  console.error('OSC UDP error:', error);
});

udpPort.open();

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  const messageHandler = (oscMsg) => {
    const message = {
      address: oscMsg.address,
      args: oscMsg.args.map(arg => arg.value !== undefined ? arg.value : arg)
    };

    try {
      ws.send(JSON.stringify(message));
    } catch (error) {
      console.error('Error sending to WebSocket:', error);
    }
  };

  udpPort.on('message', messageHandler);

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
    udpPort.off('message', messageHandler);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

console.log('=================================');
console.log('OSC WebSocket Bridge Server');
console.log('=================================');
console.log(`WebSocket server: ws://localhost:${WS_PORT}`);
console.log(`OSC listening on UDP port: ${OSC_PORT}`);
console.log('=================================');
