import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'fpl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public get hasData(): Observable<boolean> {
    return this.dataService.data.pipe(map(data => data !== null));
  }

  public get loading(): boolean {
    return this.dataService.dataState === 'loading';
  }

  public get failed(): boolean {
    return this.dataService.dataState === 'failed';
  }

  constructor(private dataService: DataService) { }

  public ngOnInit(): void {
    this.dataService.load();
  }
}
