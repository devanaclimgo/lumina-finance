import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-animated-number',
  standalone: true,
  template: `<span [class]="className">{{ format(display) }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimatedNumberComponent implements OnChanges, OnDestroy {
  @Input() value = 0;
  @Input() format: (value: number) => string = (value) => value.toFixed(2);
  @Input() duration = 750;
  @Input() className?: string;

  display = this.value;

  private from = this.value;
  private rafId?: number;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['value'] && !changes['duration']) {
      return;
    }

    const startValue = this.from;
    const delta = this.value - startValue;

    if (delta === 0) {
      this.display = this.value;
      return;
    }

    this.cancelAnimation();

    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / this.duration);
      const eased = 1 - Math.pow(1 - progress, 3);

      this.display = startValue + delta * eased;
      this.cdr.markForCheck();

      if (progress < 1) {
        this.rafId = requestAnimationFrame(tick);
      } else {
        this.from = this.value;
        this.display = this.value;
        this.rafId = undefined;
      }
    };

    this.rafId = requestAnimationFrame(tick);
  }

  ngOnDestroy(): void {
    this.cancelAnimation();
  }

  private cancelAnimation(): void {
    if (this.rafId !== undefined) {
      cancelAnimationFrame(this.rafId);
      this.rafId = undefined;
    }
  }
}