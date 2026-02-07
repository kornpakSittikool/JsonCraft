import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TypescriptTypeService {
  toTypescript(value: unknown, rootName = 'Root'): string {
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
}
