import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersComponent } from './players.component';
import { Observable, of } from 'rxjs';
import { Overview } from '../models/overview';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';

class MockDataService {
  get data(): Observable<Overview> {
    return of({ players: [] } as Overview);
  }
}

describe('PlayersComponent', () => {
  let component: PlayersComponent;
  let fixture: ComponentFixture<PlayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlayersComponent],
      imports: [FormsModule, ScrollingModule],
      providers: [{ provide: DataService, useClass: MockDataService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
