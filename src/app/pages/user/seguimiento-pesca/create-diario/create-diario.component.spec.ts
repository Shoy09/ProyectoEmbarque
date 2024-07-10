import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDiarioComponent } from './create-diario.component';

describe('CreateDiarioComponent', () => {
  let component: CreateDiarioComponent;
  let fixture: ComponentFixture<CreateDiarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDiarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
