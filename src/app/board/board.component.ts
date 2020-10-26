import { Component, Input } from '@angular/core';
import { BoardType, RobotStateType } from '../app.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent{
  @Input() board: BoardType;
  @Input() robotState: RobotStateType;

  // get the current location array and check if it is same as current robot location
  isRobotLocation(currentLocation: Array<number>): boolean {
    const [X, Y] = currentLocation;
    const [xCoordinate, yCoordinate] = this.robotState.robotLocation;
    return xCoordinate === X && yCoordinate === Y;
  }
}
