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

  private resetRight(): void {
    this.rightJsonText = '';
    this.rightLines = 0;
    this.rightStatus = 'Empty';
    this.scheduleRightResize();
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
