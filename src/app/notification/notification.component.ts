import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';
import { Gameweek } from '../models/gameweek';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'fpl-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({opacity: 0}),
        animate(250)
      ]),
      transition(':leave', [
        animate(250, style({opacity: 0}))
      ])
    ])
  ]
})
export class NotificationComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  private data: Gameweek;

  public show = true;

  public get gameweekName(): string {
    return this.data ? this.data.name : null;
  }

  public get gameweekDeadline(): Date {
    return this.data ? this.data.deadline : null;
  }

  constructor(private dataService: DataService) { }

  public hide(): void {
    this.show = false;
  }

  public ngOnInit(): void {
    this.subscriptions.push(this.dataService.data.subscribe(data => {
      this.data = data.gameweeks.find(gw => gw.id === data.nextGameweek);
    }));
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
