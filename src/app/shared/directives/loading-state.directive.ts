import {Directive, ElementRef, HostBinding, inject, Input, Renderer2} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appLoadingState]'
})
export class LoadingStateDirective {

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  @Input()
  classToAdd!: string;

  @Input()
  set appLoadingState(condition: boolean) {

    this.isLoading = condition;

    if (!this.isLoading) {
      this.renderer.addClass(this.el.nativeElement, this.classToAdd);
    } else {
      this.renderer.removeClass(this.el.nativeElement, this.classToAdd);
    }

  }

  @HostBinding('class.loader')
  isLoading = false;



}


