import { Component, Input } from '@angular/core';
import { LogType } from '../app.component';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent {
  @Input() logs: LogType[];
}
