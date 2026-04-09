// ============================================================
// src/app/shared/components/ia-agent/ia-agent.component.ts
// ============================================================
import { Component, inject, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IaService } from '../../../core/services/ia.service';

@Component({
  selector: 'app-ia-agent',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ia-agent.component.html',
  styleUrls: ['./ia-agent.component.scss']
})
export class IaAgentComponent implements AfterViewChecked {
  readonly ia = inject(IaService);
  @ViewChild('msgContainer') msgContainer!: ElementRef;

  inputText = '';

  readonly suggestions = [
    '🔴 Patients critiques',
    '📊 Stats du jour',
    '💊 Stocks bas',
    '📅 Prochains RDV',
  ];

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  send(): void {
    const text = this.inputText.trim();
    if (!text) return;
    this.inputText = '';
    this.ia.sendMessage(text);
  }

  askSuggestion(text: string): void {
    this.ia.sendMessage(text);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.send();
  }

  private scrollToBottom(): void {
    try {
      this.msgContainer.nativeElement.scrollTop =
        this.msgContainer.nativeElement.scrollHeight;
    } catch { /* ignore */ }
  }
}
