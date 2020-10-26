import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true if current location matches the robotLocation', () => {
    component.robotState = {
      robotLocation: [0, 0],
      currentFacing: 'north'
    };

    let isCurrentLocation = component.isRobotLocation([0, 0]);
    expect(isCurrentLocation).toEqual(true);
    isCurrentLocation = component.isRobotLocation([0, 1]);
    expect(isCurrentLocation).toEqual(false);
  });
});
