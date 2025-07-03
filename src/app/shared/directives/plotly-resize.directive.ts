import {Directive, ElementRef, inject, input, OnDestroy, OnInit} from '@angular/core';
import {PlotlyComponent} from 'angular-plotly.js';
import {debounceTime, delay, Subject} from 'rxjs';
import {toObservable} from '@angular/core/rxjs-interop';

@Directive({
  standalone: true,
  selector: '[appPlotlyResize]'
})
export class ResizeAppPlotlyDirective implements OnInit, OnDestroy {

  // Changing this input will resize plotly
  appPlotlyResize = input();

  /** Injected Dependencies */
  private el = inject(ElementRef);
  private plotlyComponent = inject(PlotlyComponent);

  private resizeObserver!: ResizeObserver;
  private resizeOccurred$ = new Subject<true>();


  constructor() {
    // When input is changed resize plotly component (manual resize update)
    toObservable(this.appPlotlyResize).pipe(delay(1)).subscribe(() => {
      this.resizePlotlyComponent();
    });

  }

  ngOnInit() {

    this.resizeObserver = new ResizeObserver(entries => {
      for (let _ of entries) {
        this.resizeOccurred$.next(true);
      }
    });

    this.resizeObserver.observe(this.el.nativeElement);

    // Debounce for performance reasons
    this.resizeOccurred$.pipe(debounceTime(10)).subscribe(() => {
      this.resizePlotlyComponent();
    })

  }

  private resizePlotlyComponent() {
    this.plotlyComponent.resizeHandler && this.plotlyComponent.resizeHandler(this.plotlyComponent.plotlyInstance as any);
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

}
