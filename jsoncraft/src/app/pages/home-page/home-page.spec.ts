import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePage } from './home-page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  const flushTimers = () => new Promise((resolve) => setTimeout(resolve, 0));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('formats valid JSON to the right side and updates statuses', async () => {
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    const raw = '{"a":1,"b":{"c":2}}';
    const formatted = JSON.stringify(JSON.parse(raw), null, 2);

    textarea.value = raw;
    component.onLeftJsonInput({ target: textarea } as unknown as Event);
    await flushTimers();

    expect(component.leftStatus).toBe('Valid');
    expect(component.rightStatus).toBe('Valid');
    expect(component.rightJsonText).toBe(formatted);
    expect(component.rightLines).toBe(formatted.split(/\r\n|\r|\n/).length);
  });

  it('marks invalid JSON and clears the right side', async () => {
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = '{"a": }';

    component.onLeftJsonInput({ target: textarea } as unknown as Event);
    await flushTimers();

    expect(component.leftStatus).toBe('Invalid');
    expect(component.rightStatus).toBe('Empty');
    expect(component.rightJsonText).toBe('');
    expect(component.rightLines).toBe(0);
  });

  it('sets empty status when input is blank', async () => {
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = '   ';

    component.onLeftJsonInput({ target: textarea } as unknown as Event);
    await flushTimers();

    expect(component.leftStatus).toBe('Empty');
    expect(component.rightStatus).toBe('Empty');
    expect(component.rightJsonText).toBe('');
    expect(component.rightLines).toBe(0);
  });

  it('clears both sides when clearBoth is called', async () => {
    const textareas = fixture.nativeElement.querySelectorAll('textarea') as NodeListOf<HTMLTextAreaElement>;
    const leftTextarea = textareas[0];

    leftTextarea.value = '{"hello":"world"}';
    component.onLeftJsonInput({ target: leftTextarea } as unknown as Event);
    await flushTimers();

    component.clearBoth();
    await flushTimers();

    expect(component.leftJsonText).toBe('');
    expect(component.leftStatus).toBe('Empty');
    expect(component.rightJsonText).toBe('');
    expect(component.rightLines).toBe(0);
    expect(component.rightStatus).toBe('Empty');
    expect(leftTextarea.value).toBe('');
  });

  it('changeToJson formats left JSON into the right side', async () => {
    const textareas = fixture.nativeElement.querySelectorAll('textarea') as NodeListOf<HTMLTextAreaElement>;
    const leftTextarea = textareas[0];
    const raw = '{"user":{"id":1,"active":true}}';
    const formatted = JSON.stringify(JSON.parse(raw), null, 2);

    leftTextarea.value = raw;
    component.leftJsonText = raw;

    component.changeToJson();
    await flushTimers();

    expect(component.leftStatus).toBe('Valid');
    expect(component.rightStatus).toBe('Valid');
    expect(component.rightJsonText).toBe(formatted);
    expect(component.rightLines).toBe(formatted.split(/\r\n|\r|\n/).length);
  });

  it('changeToTypescript generates a type definition from left JSON', async () => {
    const textareas = fixture.nativeElement.querySelectorAll('textarea') as NodeListOf<HTMLTextAreaElement>;
    const leftTextarea = textareas[0];
    const raw = '{"name":"Ada","age":30,"tags":["x","y"],"meta":{"active":true}}';

    leftTextarea.value = raw;
    component.leftJsonText = raw;

    component.changeToTypescript();
    await flushTimers();

    const expected = [
      'type Root = {',
      '  name: string;',
      '  age: number;',
      '  tags: string[];',
      '  meta: {',
      '    active: boolean;',
      '  };',
      '};'
    ].join('\n');

    expect(component.leftStatus).toBe('Valid');
    expect(component.rightStatus).toBe('Valid');
    expect(component.rightJsonText).toBe(expected);
    expect(component.rightLines).toBe(expected.split(/\r\n|\r|\n/).length);
  });
});
