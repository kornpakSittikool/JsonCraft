import { TestBed } from '@angular/core/testing';

import { TypescriptTypeService } from './typescript-type.service';

describe('TypescriptTypeService', () => {
  let service: TypescriptTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypescriptTypeService);
  });

  it('wraps primitive types into a named type', () => {
    expect(service.toTypescript('hello')).toBe('type Root = string;');
    expect(service.toTypescript(42, 'UserId')).toBe('type UserId = number;');
  });

  it('handles null and unknown values', () => {
    expect(service.toTypescript(null)).toBe('type Root = null;');
    expect(service.toTypescript(undefined)).toBe('type Root = unknown;');
  });

  it('infers array types, including empty and mixed arrays', () => {
    expect(service.toTypescript([])).toBe('type Root = unknown[];');
    expect(service.toTypescript([1, 2, 3])).toBe('type Root = number[];');
    expect(service.toTypescript([1, 'a'])).toBe('type Root = number | string[];');
  });

  it('formats object properties with indentation and quoted keys', () => {
    const value = {
      id: 1,
      'first-name': 'Ada',
      meta: { active: true }
    };

    const expected = [
      'type Root = {',
      '  id: number;',
      '  "first-name": string;',
      '  meta: {',
      '    active: boolean;',
      '  };',
      '};'
    ].join('\n');

    expect(service.toTypescript(value)).toBe(expected);
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
      'type Root = {',
      '  name?: string;',
      '  title: string;',
      '  meta: {',
      '    note?: string;',
      '  };',
      '};'
    ].join('\n');

    expect(service.toTypescript(value)).toBe(expected);
  });

  it('returns an empty object type for empty objects', () => {
    expect(service.toTypescript({})).toBe('type Root = {};');
  });
});
