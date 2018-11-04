import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { DataService } from './data.service';
import { environment } from 'src/environments/environment';

describe('DataService', () => {
  let service: DataService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.get(DataService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the overview URI and emit data from observable', (done: DoneFn) => {
    service.load();

    const testRequest = httpTestingController.expectOne(environment.overviewUri);
    expect(testRequest.request.method).toBe('GET');

    let initialSubscription = true;
    service.data.subscribe(data => {
      if (initialSubscription) {
        expect(data).toBeNull();
        initialSubscription = false;
      } else {
        expect(data.nextGameweek).toBe(1);
        done();
      }
    }, fail);

    testRequest.flush({ nextGameweek: 1 });
  });
});
