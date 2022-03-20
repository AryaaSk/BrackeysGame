import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelBuilderComponent } from './level-builder.component';

describe('LevelBuilderComponent', () => {
  let component: LevelBuilderComponent;
  let fixture: ComponentFixture<LevelBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LevelBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
