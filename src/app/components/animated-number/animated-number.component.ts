import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from "@angular/core";

@Component({
  selector: "app-animated-number",
  standalone: true,
  template: `<span [class]="className">{{ format(display) }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimatedNumberComponent implements OnChanges, OnDestroy {
  @Input() value = 0;
  @Input() format: (value: number) => string = (value) => value.toFixed(2);
  @Input() duration = 750;
  @Input() className = "";

  display = 0;

  private from = 0;
  private rafId: number | null = null;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes["value"] && !changes["duration"]) {
      return;
    }

    const startValue = this.from;
    const endValue = this.value;

    if (startValue === endValue) {
      this.display = endValue;
      this.cdr.markForCheck();
      return;
    }

    this.cancelAnimation();

    const startTime = performance.now();

    const tick = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.duration, 1);

      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);

      this.display = startValue + (endValue - startValue) * eased;

      this.cdr.markForCheck();

      if (progress < 1) {
        this.rafId = requestAnimationFrame(tick);
      } else {
        this.display = endValue;
        this.from = endValue;
        this.rafId = null;

        this.cdr.markForCheck();
      }
    };

    this.rafId = requestAnimationFrame(tick);
  }

  ngOnDestroy(): void {
    this.cancelAnimation();
  }

  private cancelAnimation(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}
