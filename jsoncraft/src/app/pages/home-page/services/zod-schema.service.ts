import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ZodSchemaService {
  toZodSchema(value: unknown, rootName = 'Root'): string {
    return `const ${rootName}Schema = ${this.inferSchema(value, 0)};`;
  }

  private inferSchema(value: unknown, indent: number): string {
    if (value === null) {
      return 'z.null()';
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return 'z.array(z.unknown())';
      }

      const itemSchemas = Array.from(new Set(value.map((item) => this.inferSchema(item, indent))));
      const itemSchema =
        itemSchemas.length === 1 ? itemSchemas[0] : `z.union([${itemSchemas.join(', ')}])`;
      return `z.array(${itemSchema})`;
    }

    switch (typeof value) {
      case 'string':
        return 'z.string()';
      case 'number':
        return 'z.number()';
      case 'boolean':
        return 'z.boolean()';
      case 'object': {
        const entries = Object.entries(value as Record<string, unknown>);
        if (entries.length === 0) {
          return 'z.object({})';
        }

        const pad = '  '.repeat(indent + 1);
        const closePad = '  '.repeat(indent);
        const props = entries
          .map(([key, val]) => {
            const schema = this.inferSchema(val, indent + 1);
            const optional = this.isOptionalValue(val) ? `${schema}.optional()` : schema;
            return `${pad}${this.formatKey(key)}: ${optional},`;
          })
          .join('\n');
        return `z.object({\n${props}\n${closePad}})`;
      }
      default:
        return 'z.unknown()';
    }
  }

  private isOptionalValue(value: unknown): boolean {
    return value === '';
  }

  private formatKey(key: string): string {
    return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
  }
}
