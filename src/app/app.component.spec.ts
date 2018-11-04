import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { Observable, of } from 'rxjs';
import { Overview } from './models/overview';
import { DataService } from './data.service';
import { Component } from '@angular/core';

class MockDataService {
  public wasLoaded = false;
  public get data(): Observable<Overview> {
    return of(null);
  }
  public load(): void {
    this.wasLoaded = true;
  }
}

@Component({ selector: 'fpl-notification', template: '' })
class StubNotificationComponent { }

describe('AppComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        StubNotificationComponent
      ],
      providers: [
        { provide: DataService, useClass: MockDataService }
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(`Matt's FPL Tools`);
  }));

  it('should load the data', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const service = TestBed.get(DataService);
    expect(service.wasLoaded).toBeTruthy();
  });
});
