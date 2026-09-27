import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

type ChatMessage = { role: 'user' | 'assistant'; text: string; sources?: string[]; time: string };
type WorkspaceFile = { name: string; path: string; size?: string; status: 'Indexed' | 'Indexing' | 'Ready' };
type WorkspaceFolder = { name: string; path: string; count: number };

@Component({ imports: [CommonModule, FormsModule, HttpClientModule], selector: 'app-root', styleUrl: './app.css', templateUrl: './app.html' })
export class App implements OnInit {
  protected readonly activeView = signal<'chat' | 'files'>('chat');
  protected readonly isUploading = signal(false);
  protected readonly isSending = signal(false);
  protected readonly connectionError = signal(false);
  protected readonly searchTerm = signal('');
  protected draft = '';
  protected readonly files = signal<WorkspaceFile[]>([]);
  protected readonly messages = signal<ChatMessage[]>([]);
  private readonly apiUrl = 'http://localhost:8000';
  constructor(private readonly http: HttpClient) {}
  ngOnInit(): void { this.loadFiles(); }
  protected setView(view: 'chat' | 'files'): void { this.activeView.set(view); }
  protected loadFiles(): void { this.http.get<{ files: string[] }>(`${this.apiUrl}/api/files`).subscribe({ next: (response) => { this.connectionError.set(false); this.files.set(response.files.map((path) => this.fileFromPath(path))); }, error: () => this.connectionError.set(true) }); }
  protected onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement; if (!input.files?.length) return;
    const selected = Array.from(input.files);
    const previews = selected.map((file) => ({ name: file.name, path: file.webkitRelativePath || file.name, size: this.formatBytes(file.size), status: 'Indexing' as const }));
    this.files.update((current) => [...previews, ...current]); this.isUploading.set(true);
    const payload = new FormData(); selected.forEach((file) => payload.append('files', file, file.webkitRelativePath || file.name));
    this.http.post(`${this.apiUrl}/api/index`, payload).subscribe({ next: () => { this.isUploading.set(false); this.loadFiles(); }, error: () => { this.isUploading.set(false); this.connectionError.set(true); this.files.update((current) => current.filter((file) => !previews.some((preview) => preview.path === file.path))); } }); input.value = '';
  }

  protected folders(): WorkspaceFolder[] {
    const grouped = new Map<string, number>();
    for (const file of this.files()) {
      const normalizedPath = file.path.replace(/\\/g, '/');
      const separator = normalizedPath.indexOf('/');
      if (separator > 0) {
        const folder = normalizedPath.slice(0, separator);
        grouped.set(folder, (grouped.get(folder) ?? 0) + 1);
      }
    }
    return Array.from(grouped, ([path, count]) => ({ name: path, path, count }));
  }

  protected deleteFolder(folder: WorkspaceFolder): void {
    if (!window.confirm(`Delete the uploaded folder “${folder.name}” and its indexed content?`)) return;

    this.http.delete(`${this.apiUrl}/api/files`, { body: { path: folder.path } }).subscribe({
      next: () => this.loadFiles(),
      error: () => this.connectionError.set(true),
    });
  }

  protected deleteFile(file: WorkspaceFile): void {
    if (!window.confirm(`Delete “${file.name}” and its indexed content?`)) return;

    this.http.delete(`${this.apiUrl}/api/files`, { body: { path: file.path } }).subscribe({
      next: () => this.loadFiles(),
      error: () => this.connectionError.set(true),
    });
  }
  protected handleEnter(event: Event): void { const keyEvent = event as KeyboardEvent; if (!keyEvent.shiftKey) { keyEvent.preventDefault(); this.sendMessage(); } }
  protected sendMessage(): void {
    const question = this.draft.trim(); if (!question || this.isSending()) return;
    this.messages.update((items) => [...items, { role: 'user', text: question, time: this.currentTime() }]); this.draft = ''; this.isSending.set(true);
    this.http.post<{ answer: string; sources: string[] }>(`${this.apiUrl}/api/chat`, { question }).subscribe({
      next: (response) => { this.messages.update((items) => [...items, { role: 'assistant', text: response.answer, sources: response.sources, time: this.currentTime() }]); this.isSending.set(false); this.connectionError.set(false); },
      error: () => { this.messages.update((items) => [...items, { role: 'assistant', text: 'I could not reach the local API. Start the FastAPI server and try again.', time: this.currentTime() }]); this.isSending.set(false); this.connectionError.set(true); }
    });
  }
  protected filteredFiles(): WorkspaceFile[] { const term = this.searchTerm().trim().toLowerCase(); return this.files().filter((file) => !term || file.name.toLowerCase().includes(term) || file.path.toLowerCase().includes(term)); }
  protected trackByPath(_: number, file: WorkspaceFile): string { return file.path; }
  private fileFromPath(path: string): WorkspaceFile { const name = path.split(/[\\/]/).pop() || path; return { name, path, status: 'Indexed' }; }
  private formatBytes(bytes: number): string { if (bytes < 1024) return `${bytes} B`; if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`; return `${(bytes / (1024 * 1024)).toFixed(1)} MB`; }
  private currentTime(): string { return new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit' }).format(new Date()); }
}
