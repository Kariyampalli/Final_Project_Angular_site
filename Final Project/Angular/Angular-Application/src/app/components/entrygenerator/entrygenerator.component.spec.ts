import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntrygeneratorComponent } from './entrygenerator.component';

describe('EntrygeneratorComponent', () => {
  let component: EntrygeneratorComponent;
  let fixture: ComponentFixture<EntrygeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntrygeneratorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntrygeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
