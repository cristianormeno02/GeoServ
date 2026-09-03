import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[mask="separator.2"]',
  standalone: true
})
export class NumericInputDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('focus')
  onFocus() {
    this.el.nativeElement.select();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === '.') {
      event.preventDefault();
      const input = this.el.nativeElement;
      const start = input.selectionStart ?? 0;
      const end = input.selectionEnd ?? 0;
      const value = input.value;
      input.value = value.substring(0, start) + ',' + value.substring(end);
      input.setSelectionRange(start + 1, start + 1);
      
      // Dispatch input event to notify form control and mask directive
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}
