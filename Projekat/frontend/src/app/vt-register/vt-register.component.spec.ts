import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VtRegisterComponent } from './vt-register.component';

describe('VtRegisterComponent', () => {
  let component: VtRegisterComponent;
  let fixture: ComponentFixture<VtRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VtRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VtRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
