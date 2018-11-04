import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationComponent } from './notification.component';
import { DataService } from '../data.service';
import { Observable, of } from 'rxjs';
import { Overview } from '../models/overview';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class MockDataService {
  public get data(): Observable<Overview> {
    return of(null);
  }
}

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NotificationComponent
      ],
      imports: [NoopAnimationsModule],
      providers: [
        { provide: DataService, useClass: MockDataService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
