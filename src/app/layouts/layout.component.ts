// ============================================================
// src/app/layout/layout.component.ts
// ============================================================
import { Component, signal, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';
import { TopbarComponent } from '../shared/components/topbar/topbar.component';
import { IaAgentComponent } from '../shared/components/ia-agent/ia-agent.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, IaAgentComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  sidebarOpen = signal(false);

  toggleSidebar(): void { this.sidebarOpen.update(v => !v); }
  closeSidebar():  void { this.sidebarOpen.set(false); }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 991) this.sidebarOpen.set(false);
  }
}
