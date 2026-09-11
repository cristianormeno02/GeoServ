import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { ProjectDialogComponent } from './project-dialog.component';

describe('ProjectDialogComponent', () => {
  let component: ProjectDialogComponent;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ProjectDialogComponent>>;

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });

    component = TestBed.runInInjectionContext(() => new ProjectDialogComponent({}));
  });

  it('should initialize mapOptions with hybrid mapTypeId by default (satellite with labels)', () => {
    expect(component.mapOptions.mapTypeId).toBe('hybrid');
  });
});
