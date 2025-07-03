import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformerTableComponent } from './transformer-table-component';

describe('TransformerTableComponent', () => {
  let component: TransformerTableComponent;
  let fixture: ComponentFixture<TransformerTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransformerTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransformerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
