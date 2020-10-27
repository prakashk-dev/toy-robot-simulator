import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

// this can come from api
const meta = {
  direction: [{
    id: 0,
    value: 'north',
    viewValue: 'NORTH'
  },
  {
    id: 1,
    value: 'east',
    viewValue: 'EAST'
  },
  {
    id: 2,
    value: 'south',
    viewValue: 'SOUTH'
  },
  {
    id: 3,
    value: 'west',
    viewValue: 'WEST'
  }]
};

type StatusType = 'info' | 'error';
type RobotLocationType = Array<number>;

// define types if they are used in multiple components
// All the types can be in a separate file if we have more
export type RobotStateType = {
  robotLocation: RobotLocationType,
  currentFacing: string
};
export type LogType = {
  status: StatusType,
  message: string
};

export type BoardType = Array<Array<RobotLocationType>>;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  // These will be used to create 5X5 board
  private xUnits = 5;
  private yUnits = 5;

  title = 'Toy Robot Simulator';
  board: BoardType = [];
  metaDirection = meta.direction;
  robotState: RobotStateType  = {
    robotLocation: [],
    currentFacing: null
  };
  logs: LogType[] = [];
  notification = null;
  myForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.board = this.createBoard(this.xUnits, this.yUnits);
  }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      xCoordinate: [null, [
        Validators.required,
        Validators.pattern('^[0-4]{1}$')
      ]],
      yCoordinate: [null, [
        Validators.required,
        Validators.pattern('^[0-4]{1}$')
      ]],
      facing: ''
    });
  }

  // this will create board for given number of x and y units
  createBoard(xUnits: number, yUnits: number): BoardType {
    const xAxis = [...new Array(xUnits).keys()];
    // reverse for yAxis as we want [0, 4] as the first element in the array
    const yAxis = [...new Array(yUnits).keys()].reverse();
    // create an array with xUnits of rows and yUnits of columns with [x,y] coordinates
    return xAxis.map(xd => yAxis.map(yd => [xd, yd]));
  }

  // get the input from form and place robot to the location
  placeRobot(form: FormGroup): void{
    const { xCoordinate, yCoordinate, facing } = form.value;
    if (this.isNextMoveInvalid(xCoordinate, yCoordinate)) {
      this.addLog({ status: 'error', message: `Your next move is outside the board. Try changing direction.`});
    } else {
      this.robotState = {
        robotLocation: [xCoordinate, yCoordinate],
        currentFacing: facing
      };
      this.addLog({ status: 'info', message: `Robot placed at X: ${xCoordinate}, Y: ${yCoordinate} facing ${facing}`});
    }
  }

  // refactor this function
  handleRotate(_, direction): void {
    const { robotLocation, currentFacing } = this.robotState;
    const currentDirectionIndex = this.metaDirection.findIndex(dir => dir.value === currentFacing);

    const nextIndex = this.getNextIndex(currentDirectionIndex, direction)
    const nextFacing = this.metaDirection[nextIndex]?.value;
    this.robotState = {
      ...this.robotState,
      currentFacing: nextFacing
    };
    this.addLog({ status: 'info', message: `Now facing ${nextFacing} at [${robotLocation}]`});
  }

  // get next index
  getNextIndex(currentIndex: number, direction: string): number{
    const nextIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    // lets round the index so that it will not go to negative or more than 3 as we only have 4 direction
    return (nextIndex + 4) % 4;
  }

  // add/subtract xAxis or yAxis depending on moving direction if the next move is valid
  handleMove(): void {
    const { robotLocation, currentFacing } = this.robotState;
    const prevRobotLocation = [...robotLocation];
    const newRobotLocation = [...robotLocation];
    if (currentFacing === 'north') {
      newRobotLocation[1] += 1;
    } else if (currentFacing === 'east') {
      newRobotLocation[0] += 1;
    } else if (currentFacing === 'south') {
      newRobotLocation[1] -= 1;
    } else {
      newRobotLocation[0] -= 1;
    }
    const [x, y] = newRobotLocation;
    if (this.isNextMoveInvalid(x, y)){
      this.addLog({ status: 'error', message: `Your next move is outside the board. Try changing direction.`});
    } else {
      this.robotState = {
        ...this.robotState,
        robotLocation: newRobotLocation
      };
      this.addLog({ status: 'info', message: `Moved from [${prevRobotLocation}] to [${newRobotLocation}]`});
    }
  }

  handleShowReport(): void{
    const { robotLocation, currentFacing } = this.robotState;
    const [ xCoordinate, yCoordinate] = robotLocation;
    this.notification = `${xCoordinate}, ${yCoordinate}, ${currentFacing}`;
  }

  handleRemoveNotification(): void{
      this.notification = null;

  }

  addLog(log: LogType): void {
    this.logs.push(log);
    // if the height of the content is more than the container, scroll to the last div
    const lastLog = document.getElementById('lastLog');
    lastLog.scrollIntoView();
  }

  isNextMoveInvalid(x: number, y: number): boolean{
    const maxXCoordinate = this.xUnits - 1;
    const maxYCoordinate = this.yUnits - 1;
    const minCoordinate = 0;
    return (x > maxXCoordinate || y > maxYCoordinate || x < minCoordinate || y < minCoordinate);
  }

  get xCoordinate(): AbstractControl {
    return this.myForm.get('xCoordinate');
  }
  get yCoordinate(): AbstractControl{
    return this.myForm.get('yCoordinate');
  }
  get facing(): AbstractControl{
    return this.myForm.get('facing');
  }
}
