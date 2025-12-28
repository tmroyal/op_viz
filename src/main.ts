import p5 from 'p5';
import { OSCClient } from './osc-client';
import { Visualizer } from './visualizer';

const oscClient = new OSCClient();
let visualizer: Visualizer;

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.colorMode(p.HSB, 1);
    visualizer = new Visualizer(p);

    oscClient.onMessage((msg) => {
      visualizer.addMessage(msg);
      console.log('OSC:', msg.address, msg.args);
    });

    oscClient.onStatusChange((status) => {
      updateStatus(status);
    });
  };

  p.draw = () => {
    visualizer.draw();
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(sketch);

const connectBtn = document.getElementById('connectBtn') as HTMLButtonElement;
const disconnectBtn = document.getElementById('disconnectBtn') as HTMLButtonElement;
const wsPortInput = document.getElementById('wsPort') as HTMLInputElement;
const statusDiv = document.getElementById('status') as HTMLDivElement;
const controlsDiv = document.getElementById('controls') as HTMLDivElement;

connectBtn.addEventListener('click', async () => {
  const port = parseInt(wsPortInput.value);
  try {
    connectBtn.disabled = true;
    updateStatus('Connecting...');
    await oscClient.connect(port);
    connectBtn.disabled = true;
    disconnectBtn.disabled = false;
    wsPortInput.disabled = true;
  } catch (error) {
    console.error('Connection failed:', error);
    updateStatus('Connection failed');
    connectBtn.disabled = false;
  }
});

disconnectBtn.addEventListener('click', () => {
  oscClient.disconnect();
  connectBtn.disabled = false;
  disconnectBtn.disabled = true;
  wsPortInput.disabled = false;
});

function updateStatus(status: string): void {
  statusDiv.textContent = `Status: ${status}`;
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'h' || e.key === 'H') {
    controlsDiv.style.display = controlsDiv.style.display === 'none' ? 'block' : 'none';
  }
});
