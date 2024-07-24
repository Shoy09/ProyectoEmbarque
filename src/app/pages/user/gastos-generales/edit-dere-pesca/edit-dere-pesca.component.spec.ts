import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDerePescaComponent } from './edit-dere-pesca.component';

describe('EditDerePescaComponent', () => {
  let component: EditDerePescaComponent;
  let fixture: ComponentFixture<EditDerePescaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDerePescaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDerePescaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
