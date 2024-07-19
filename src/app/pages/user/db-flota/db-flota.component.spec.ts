import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbFlotaComponent } from './db-flota.component';

describe('DbFlotaComponent', () => {
  let component: DbFlotaComponent;
  let fixture: ComponentFixture<DbFlotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbFlotaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbFlotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
