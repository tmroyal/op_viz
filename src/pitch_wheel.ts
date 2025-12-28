import type p5 from 'p5';
import { Vector } from 'p5';
import { colors, weights } from './styles';

export class PitchWheel {
  private pitches: number[] = [];
  private position: Vector;
  private radius: number;
  private margin: number;
  private readonly indicator_ratio = 1/10;
  private readonly text_ratio = 0.8;

  constructor(position: Vector, radius: number = 50, margin: number = 10) {
    this.position = position;
    this.radius = radius;
    this.margin = margin;
  }

  setPitches(pitches: number[]): void {
    this.pitches = pitches;
  }

  draw(p: p5): void {
    p.push();
    p.translate(this.margin + this.position.x + this.radius, this.margin + this.position.y + this.radius);
    p.noFill();
    p.stroke(...colors.fg);
    p.strokeWeight(weights.strokeWeight);
    p.ellipse(0, 0, this.radius * 2, this.radius * 2);

    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(10);

    for (let i = 0; i < 12; i++){
      const angle = 2 * Math.PI * i/12 - Math.PI / 2;
      const x = Math.cos(angle) * this.radius;
      const y = Math.sin(angle) * this.radius;
      const hasPitch = this.pitches.includes(i);
      if (hasPitch) {
        p.fill(...colors.fg);
      } else {
        p.fill(...colors.background);
      }
      p.ellipse(x, y, this.radius * this.indicator_ratio, this.radius * this.indicator_ratio);

      if (hasPitch) {
        const textX = Math.cos(angle) * this.radius * this.text_ratio;
        const textY = Math.sin(angle) * this.radius * this.text_ratio;
        p.fill(...colors.fg);
        p.noStroke();
        p.text(i.toString(), textX, textY);
        p.stroke(...colors.fg);
      }
    }

    p.pop();
  }
}
