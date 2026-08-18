import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PERIODS, PeriodKey } from '../../lib/selectors';

@Component({
  selector: 'app-period-selector',
  standalone: true,
  templateUrl: './period-selector.component.html',
})
export class PeriodSelectorComponent {
  @Input() value!: PeriodKey;
  @Input() compact = false;

  @Output() valueChange = new EventEmitter<PeriodKey>();

  readonly periods = PERIODS;

  selectPeriod(period: PeriodKey): void {
    this.valueChange.emit(period);
  }
}
