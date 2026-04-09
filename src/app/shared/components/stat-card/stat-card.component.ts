// ============================================================
// src/app/shared/components/stat-card/stat-card.component.ts
// ============================================================
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
   templateUrl: './stat-card.components.html',
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent {
  @Input() icon       = '';
  @Input() value      = '';
  @Input() label      = '';
  @Input() trend      = '';
  @Input() iconBg     = 'rgba(0,194,168,.1)';
  @Input() iconColor  = 'var(--accent)';
  @Input() valueColor = '';
  @Input() trendColor = '';
  @Input() trendIcon  = 'bi-arrow-up-right';
}
