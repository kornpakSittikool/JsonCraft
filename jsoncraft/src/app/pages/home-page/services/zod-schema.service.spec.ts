import { TestBed } from '@angular/core/testing';

import { ZodSchemaService } from './zod-schema.service';

describe('ZodSchemaService', () => {
  let service: ZodSchemaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZodSchemaService);
  });

  it('wraps primitive values into a named schema', () => {
    expect(service.toZodSchema('hi')).toBe('const RootSchema = z.string();');
    expect(service.toZodSchema(1, 'UserId')).toBe('const UserIdSchema = z.number();');
  });

  it('marks empty string properties as optional', () => {
    const value = {
      name: '',
      title: 'Engineer',
      meta: {
        note: ''
      }
    };

    const expected = [
      'const RootSchema = z.object({',
      '  name: z.string().optional(),',
      '  title: z.string(),',
      '  meta: z.object({',
      '    note: z.string().optional(),',
      '  }),',
      '});'
    ].join('\n');

    expect(service.toZodSchema(value)).toBe(expected);
  });
});
