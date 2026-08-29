import { Component, computed, ElementRef, signal, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgClass } from "@angular/common";

import { PageHeaderComponent } from "../page-header//page-header.component";
import { SectionCardComponent } from "../section-card/section-card.component";
import { EmptyStateComponent } from "../empty-state//empty-state.component";

import { FinanceStoreService } from "../../services/store.service";
import { faqs } from "../../lib/finance-data";
import { formatDate, relativeDay } from "../../lib/format";
import { AgentService } from "../../services/agent-reply.service";

interface Faq {
  category: string;
  q: string;
  a: string;
}

@Component({
  standalone: true,
  selector: "app-help",
  imports: [FormsModule, NgClass, PageHeaderComponent, SectionCardComponent, EmptyStateComponent],
  templateUrl: "./help.component.html",
})
export class HelpComponent {
  @ViewChild("list") listRef?: ElementRef<HTMLDivElement>;

  readonly formatDate = formatDate;
  readonly relativeDay = relativeDay;

  query = signal("");
  draft = signal("");

  private openQuestion = signal<Record<string, string | null>>({});

  constructor(
    readonly store: FinanceStoreService,
    private readonly agent: AgentService,
  ) {}

  filtered = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return faqs;
    return faqs.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  });

  grouped = computed(() => {
    const map = new Map<string, Faq[]>();
    for (const f of this.filtered()) {
      map.set(f.category, [...(map.get(f.category) ?? []), f]);
    }
    return [...map.entries()];
  });

  isOpen(category: string, question: string): boolean {
    return this.openQuestion()[category] === question;
  }

  toggle(category: string, question: string): void {
    this.openQuestion.update((state) => ({
      ...state,
      [category]: state[category] === question ? null : question,
    }));
  }

  isAgent(text: string, from: string): boolean {
    return from === "agent" || text.startsWith("__agent__");
  }

  displayText(text: string): string {
    return text.replace("__agent__", "");
  }

  updateQuery(value: string): void {
    this.query.set(value);
  }

  updateDraft(value: string): void {
    this.draft.set(value);
  }

  send(): void {
    const text = this.draft().trim();
    if (!text) return;

    this.store.sendMessage(text);
    this.draft.set("");

    const reply = this.agent.reply(text);
    setTimeout(() => this.store.sendMessage(`__agent__${reply}`), 10);
    setTimeout(() => this.scrollToBottom(), 60);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.send();
  }

  private scrollToBottom(): void {
    this.listRef?.nativeElement.scrollTo({ top: 99999, behavior: "smooth" });
  }
}
