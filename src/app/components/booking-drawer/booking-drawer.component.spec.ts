import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDrawerComponent } from './booking-drawer.component';

describe('BookingDrawerComponent', () => {
  let component: BookingDrawerComponent;
  let fixture: ComponentFixture<BookingDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingDrawerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
