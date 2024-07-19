import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMecanismooComponent } from './create-mecanismoo.component';

describe('CreateMecanismooComponent', () => {
  let component: CreateMecanismooComponent;
  let fixture: ComponentFixture<CreateMecanismooComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMecanismooComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMecanismooComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
