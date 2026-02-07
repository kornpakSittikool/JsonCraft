import { TestBed } from '@angular/core/testing';

import { JsonFormatService } from './json-format.service';

describe('JsonFormatService', () => {
  let service: JsonFormatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonFormatService);
  });

  it('formats JSON with the default indentation', () => {
    const input = '{"a":1,"b":{"c":2}}';
    const expected = JSON.stringify(JSON.parse(input), null, 2);

    expect(service.format(input)).toBe(expected);
  });

  it('respects a custom indentation size', () => {
    const input = '{"a":1,"b":2}';
    const expected = JSON.stringify(JSON.parse(input), null, 4);

    expect(service.format(input, 4)).toBe(expected);
  });

  it('throws for invalid JSON input', () => {
    expect(() => service.format('{"a": }')).toThrow();
  });
});
