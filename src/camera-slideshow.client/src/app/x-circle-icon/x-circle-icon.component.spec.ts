import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XCircleIconComponent } from './x-circle-icon.component';

describe('XCircleIconComponent', () => {
  let component: XCircleIconComponent;
  let fixture: ComponentFixture<XCircleIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XCircleIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XCircleIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
