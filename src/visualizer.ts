import type p5 from 'p5';
import type { OSCMessage } from './osc-client';
import { PitchWheel } from './pitch_wheel';
import { Vector } from 'p5';
import { colors } from './styles';

export class Visualizer {
  private p: p5;
  private messages: OSCMessage[] = [];
  private maxMessages = 100;
  private pitchWheel: PitchWheel;

  constructor(p: p5) {
    this.p = p;
    this.pitchWheel = new PitchWheel(new Vector(0,0), 100, 20);
  }

  addMessage(msg: OSCMessage): void {
    this.messages.unshift(msg);
    if (this.messages.length > this.maxMessages) {
      this.messages.pop();
    }

    if (msg.address === '/pitches' && Array.isArray(msg.args)) {
      this.pitchWheel.setPitches(msg.args as number[]);
    }
  }

  draw(): void {
    this.p.background(...colors.background);
    this.pitchWheel.draw(this.p);
  }

}
