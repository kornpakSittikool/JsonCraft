import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  standalone: true
})
export class HomePage {
  @ViewChild('rightArea') rightArea?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('leftArea') leftArea?: ElementRef<HTMLTextAreaElement>;
  leftJsonText = '';
  leftStatus: 'Empty' | 'Valid' | 'Invalid' = 'Empty';
  rightJsonText = '';
  rightLines = 0;
  rightStatus: 'Empty' | 'Valid' = 'Empty';

  onLeftJsonInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    const value = textarea.value;
    this.leftJsonText = value;
    this.autoResize(textarea);

    try {
      if (!value.trim()) {
        this.leftStatus = 'Empty';
        this.resetRight();
        return;
      }

      const parsed = JSON.parse(value);
      const formatted = JSON.stringify(parsed, null, 2);

      this.leftStatus = 'Valid';
      this.rightJsonText = formatted;
      this.rightLines = formatted ? formatted.split(/\r\n|\r|\n/).length : 0;
      this.rightStatus = formatted ? 'Valid' : 'Empty';

      this.scheduleRightResize();
    } catch {
      this.leftStatus = 'Invalid';
      this.resetRight();
    }
  }

  clearBoth(): void {
    this.leftJsonText = '';
    this.leftStatus = 'Empty';
    this.rightJsonText = '';
    this.rightLines = 0;
    this.rightStatus = 'Empty';

    if (this.leftArea?.nativeElement) {
      this.leftArea.nativeElement.value = '';
      this.autoResize(this.leftArea.nativeElement);
    }

    this.scheduleRightResize();
  }

  changeToJson(): void {
    const value = this.leftArea?.nativeElement?.value ?? this.leftJsonText;

    if (!value.trim()) {
      this.leftStatus = 'Empty';
      this.resetRight();
      return;
    }

    try {
      const parsed = JSON.parse(value);
      const formatted = JSON.stringify(parsed, null, 2);

      this.leftStatus = 'Valid';
      this.rightJsonText = formatted;
      this.rightLines = formatted ? formatted.split(/\r\n|\r|\n/).length : 0;
      this.rightStatus = formatted ? 'Valid' : 'Empty';
      this.scheduleRightResize();
    } catch {
      this.leftStatus = 'Invalid';
      this.resetRight();
    }
  }

  changeToTypescript(): void {
    const value = this.leftArea?.nativeElement?.value ?? this.leftJsonText;

    if (!value.trim()) {
      this.leftStatus = 'Empty';
      this.resetRight();
      return;
    }

    try {
      const parsed = JSON.parse(value);
      const output = this.toTypescript(parsed);

      this.leftStatus = 'Valid';
      this.rightJsonText = output;
      this.rightLines = output ? output.split(/\r\n|\r|\n/).length : 0;
      this.rightStatus = output ? 'Valid' : 'Empty';
      this.scheduleRightResize();
    } catch {
      this.leftStatus = 'Invalid';
      this.resetRight();
    }
  }

  private resetRight(): void {
    this.rightJsonText = '';
    this.rightLines = 0;
    this.rightStatus = 'Empty';
    this.scheduleRightResize();
  }

  private toTypescript(value: unknown, rootName = 'Root'): string {
    return `type ${rootName} = ${this.inferType(value, 0)};`;
  }

  private inferType(value: unknown, indent: number): string {
    if (value === null) {
      return 'null';
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return 'unknown[]';
      }

      const itemTypes = Array.from(new Set(value.map((item) => this.inferType(item, indent))));
      const joined = itemTypes.length === 1 ? itemTypes[0] : itemTypes.join(' | ');
      return `${joined}[]`;
    }

    switch (typeof value) {
      case 'string':
      case 'number':
      case 'boolean':
        return typeof value;
      case 'object': {
        const entries = Object.entries(value as Record<string, unknown>);
        if (entries.length === 0) {
          return '{}';
        }

        const pad = '  '.repeat(indent + 1);
        const closePad = '  '.repeat(indent);
        const props = entries
          .map(([key, val]) => `${pad}${this.formatKey(key)}: ${this.inferType(val, indent + 1)};`)
          .join('\n');
        return `{\n${props}\n${closePad}}`;
      }
      default:
        return 'unknown';
    }
  }

  private formatKey(key: string): string {
    return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
  }

  private autoResize(textarea?: HTMLTextAreaElement | null): void {
    if (!textarea) {
      return;
    }

    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  private scheduleRightResize(): void {
    setTimeout(() => {
      this.autoResize(this.rightArea?.nativeElement);
    }, 0);
  }
}
