import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { LogComponent } from './log/log.component';
import { MaterialModule } from './material/material.module';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        LogComponent,
        BoardComponent
      ],
      imports: [MaterialModule, BrowserAnimationsModule, ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have a correct title`, () => {
    expect(component.title).toEqual('Toy Robot Simulator');
  });

  it('should render correct title in HTML', () => {
    const compiled = fixture.nativeElement;
    const titleText  = compiled.querySelector('h1').textContent;
    expect(titleText).toContain('Toy Robot Simulator');
  });

  it('should create a board with correct number of elements', () => {
    const xUnits = 5;
    const yUnits = 5;
    const board = component.createBoard(xUnits, yUnits);
    // number of rows should be 5
    expect(board.length).toEqual(5);
    // each rows should contains five units
    expect(board[0].length).toEqual(5);
    // each unit should contains x,y coordinates
    expect(board[0][0].length).toEqual(2);
  });

  it('should place the robot in the correct coordinates', () => {
    const myForm = component.myForm;
    const robotState = {
      xCoordinate: 1,
      yCoordinate: 1,
      facing: 'north'
    };
    myForm.setValue(robotState);
    component.placeRobot(myForm);

    const { robotLocation, currentFacing } = component.robotState;
    expect(robotLocation).toEqual([robotState.xCoordinate, robotState.yCoordinate]);
    expect(currentFacing).toEqual(robotState.facing);

  });

  it('should have log with status error when placing robot outside the board', () => {
    const myForm = component.myForm;
    const robotState = {
      xCoordinate: 11,
      yCoordinate: 11,
      facing: 'north'
    };
    myForm.setValue(robotState);
    component.placeRobot(myForm);

    const { logs } = component;
    expect(logs.length).toEqual(1);
    expect(logs[0].status).toEqual('error');
  });

  it('should have log with status info when placing robot inside the board', () => {
    const myForm = component.myForm;
    const robotState = {
      xCoordinate: 3,
      yCoordinate: 3,
      facing: 'south'
    };
    myForm.setValue(robotState);
    component.placeRobot(myForm);

    const { logs } = component;
    expect(logs.length).toEqual(1);
    expect(logs[0].status).toEqual('info');
  });

  it('should rotate to the correct direction', () =>{
    component.robotState = {
      robotLocation: [0, 0],
      currentFacing: 'north'
    };
    component.handleRotate({}, 'left');
    expect(component.robotState.currentFacing).toEqual('west');

    component.handleRotate({}, 'right');
    expect(component.robotState.currentFacing).toEqual('north');
  });

  it('shold move to the correct coordinates', () => {
    component.robotState = {
      robotLocation: [0, 0],
      currentFacing: 'north'
    };

    component.handleMove();
    const expectedRobotState = { robotLocation: [0, 1], currentFacing: 'north' };
    expect(expectedRobotState).toEqual(component.robotState);

  });

  it('should have correct notification when executing handleShowReport function', () => {
    component.robotState = {
      robotLocation: [0, 0],
      currentFacing: 'north'
    };
    component.handleShowReport();
    const expectedNotification = '0, 0, north';
    expect(component.notification).toEqual(expectedNotification);

  });

  it('should return true if next move is inside the board and false if outside - func isNextMoveInvalid', () => {
    const invalidYCoordinate = component.isNextMoveInvalid(1, 5);
    const invalidXCoordinate = component.isNextMoveInvalid(5, 1);
    const validMove = component.isNextMoveInvalid(2, 2);

    expect(invalidXCoordinate).toEqual(true);
    expect(invalidYCoordinate).toEqual(true);
    expect(validMove).toEqual(false);

  });

  it('should have a correct log message when robot is moving', () => {
    component.robotState = {
      robotLocation: [0, 0],
      currentFacing: 'north'
    };
    component.handleMove();
    component.handleMove();
    const recentlyAddedLog = component.logs[component.logs.length - 1];
    expect(recentlyAddedLog.message).toEqual('Moved from [0,1] to [0,2]');

  });

  it('should have a correct log message when robot is changing direction', () => {
    component.robotState = {
      robotLocation: [0, 0],
      currentFacing: 'north'
    };
    component.handleRotate({}, 'left');
    component.handleRotate({}, 'left');
    const recentlyAddedLog = component.logs[component.logs.length - 1];
    expect(recentlyAddedLog.message).toEqual('Now facing south at [0,0]');

  });

  it('should return index within the range of direction array', () => {
    let nextIndex = component.getNextIndex(0, 'left');
    // 0-1 should equal 3
    expect(nextIndex).toEqual(3);
    nextIndex = component.getNextIndex(3, 'right');
    // 3+1 should equal 0
    expect(nextIndex).toBe(0);

    // make sure normal addition and subtraction also work
    nextIndex = component.getNextIndex(0, 'right');
    expect(nextIndex).toBe(1);
    nextIndex = component.getNextIndex(3, 'left');
    expect(nextIndex).toBe(2);


  })

});
