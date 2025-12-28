export interface OSCMessage {
  address: string;
  args: any[];
  timestamp: number;
}

export class OSCClient {
  private ws: WebSocket | null = null;
  private messageCallback: ((msg: OSCMessage) => void) | null = null;
  private statusCallback: ((status: string) => void) | null = null;

  connect(port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(`ws://localhost:${port}`);

        this.ws.onopen = () => {
          this.updateStatus('Connected');
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.address && Array.isArray(data.args)) {
              const message: OSCMessage = {
                address: data.address,
                args: data.args,
                timestamp: Date.now()
              };
              if (this.messageCallback) {
                this.messageCallback(message);
              }
            }
          } catch (e) {
            console.error('Error parsing OSC message:', e);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.updateStatus('Error');
          reject(error);
        };

        this.ws.onclose = () => {
          this.updateStatus('Disconnected');
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  onMessage(callback: (msg: OSCMessage) => void): void {
    this.messageCallback = callback;
  }

  onStatusChange(callback: (status: string) => void): void {
    this.statusCallback = callback;
  }

  private updateStatus(status: string): void {
    if (this.statusCallback) {
      this.statusCallback(status);
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}
