import { TestBed } from '@angular/core/testing';

import { ServviceDossier } from './servvice-dossier';

describe('ServviceDossier', () => {
  let service: ServviceDossier;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServviceDossier);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
