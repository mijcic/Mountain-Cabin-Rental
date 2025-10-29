import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VikendicaDetaljiComponent } from './vikendica-detalji.component';

describe('VikendicaDetaljiComponent', () => {
  let component: VikendicaDetaljiComponent;
  let fixture: ComponentFixture<VikendicaDetaljiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VikendicaDetaljiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VikendicaDetaljiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
