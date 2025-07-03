import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoltagesPopoverComponent } from './voltages-popover.component';

describe('VoltagesPopoverComponen', () => {
  let component: VoltagesPopoverComponent;
  let fixture: ComponentFixture<VoltagesPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoltagesPopoverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoltagesPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
