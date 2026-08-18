import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-card',
  standalone: true,
  templateUrl: './section-card.component.html',
})
export class SectionCardComponent {
  @Input() title?: string;
  @Input() description?: string;
  @Input() className = '';
  @Input() bodyClassName = '';
}
