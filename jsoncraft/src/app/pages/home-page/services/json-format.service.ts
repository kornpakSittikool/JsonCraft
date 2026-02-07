import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class JsonFormatService {
  format(value: string, indent = 2): string {
    const parsed = JSON.parse(value);
    return JSON.stringify(parsed, null, indent);
  }
}
