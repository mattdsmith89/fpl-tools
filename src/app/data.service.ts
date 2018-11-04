import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Overview } from './models/overview';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private dataStore: {
    data: Overview
  };

  private httpResponseCode: number;
  private dataSubject: BehaviorSubject<Overview> = new BehaviorSubject(null);

  public get dataState(): string {
    if (!this.httpResponseCode) { return 'loading'; }
    if (this.httpResponseCode === 200) { return 'loaded'; }
    return 'failed';
  }

  public get data(): Observable<Overview> {
    return this.dataSubject.asObservable();
  }

  constructor(private http: HttpClient) {
    this.dataStore = { data: null };
  }

  public load(): void {
    this.httpResponseCode = null;
    this.http.get<Overview>(environment.overviewUri).subscribe(data => {
      this.httpResponseCode = 200;
      this.setData(data);
    }, error => {
      this.httpResponseCode = error.status;
    });
  }

  private setData(data: Overview): void {
    this.dataStore.data = data;
    this.dataSubject.next(Object.assign({}, this.dataStore).data);
  }
}
