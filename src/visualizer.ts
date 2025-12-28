import type p5 from 'p5';
import type { OSCMessage } from './osc-client';

interface VisualParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: p5.Color;
  alpha: number;
  address: string;
  args: any[];
  lifespan: number;
}

export class Visualizer {
  private p: p5;
  private particles: VisualParticle[] = [];
  private messages: OSCMessage[] = [];
  private maxMessages = 100;
  private maxParticles = 200;

  constructor(p: p5) {
    this.p = p;
  }

  addMessage(msg: OSCMessage): void {
    this.messages.unshift(msg);
    if (this.messages.length > this.maxMessages) {
      this.messages.pop();
    }

    const numericArgs = msg.args.filter(arg => typeof arg === 'number');
    const value = numericArgs.length > 0 ? numericArgs[0] : Math.random();
    const normalizedValue = typeof value === 'number' ? Math.abs(value) : 0.5;

    const hue = this.p.map(
      this.hashCode(msg.address) % 360,
      0,
      360,
      0,
      360
    );

    const particle: VisualParticle = {
      x: this.p.random(this.p.width),
      y: this.p.random(this.p.height),
      vx: this.p.random(-2, 2),
      vy: this.p.random(-2, 2),
      size: this.p.map(normalizedValue, 0, 1, 10, 50),
      color: this.p.color(hue, 80, 90),
      alpha: 255,
      address: msg.address,
      args: msg.args,
      lifespan: 255
    };

    this.particles.push(particle);

    if (this.particles.length > this.maxParticles) {
      this.particles.shift();
    }
  }

  draw(): void {
    this.p.background(20, 20, 30);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];

      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.lifespan -= 2;

      if (particle.x < 0 || particle.x > this.p.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.p.height) particle.vy *= -1;

      particle.x = this.p.constrain(particle.x, 0, this.p.width);
      particle.y = this.p.constrain(particle.y, 0, this.p.height);

      const c = particle.color;
      this.p.fill(
        this.p.red(c),
        this.p.green(c),
        this.p.blue(c),
        particle.lifespan
      );
      this.p.noStroke();
      this.p.ellipse(particle.x, particle.y, particle.size);

      if (particle.lifespan <= 0) {
        this.particles.splice(i, 1);
      }
    }

    this.drawMessageLog();
  }

  private drawMessageLog(): void {
    this.p.fill(255, 200);
    this.p.textSize(12);
    this.p.textAlign(this.p.LEFT, this.p.TOP);

    const x = this.p.width - 300;
    const y = 10;
    const lineHeight = 15;

    this.p.fill(0, 0, 0, 150);
    this.p.rect(x - 5, y - 5, 295, Math.min(this.messages.length, 10) * lineHeight + 10);

    for (let i = 0; i < Math.min(this.messages.length, 10); i++) {
      const msg = this.messages[i];
      const text = `${msg.address}: ${JSON.stringify(msg.args)}`;
      this.p.fill(255, 200);
      this.p.text(
        text.substring(0, 40),
        x,
        y + i * lineHeight
      );
    }
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}
