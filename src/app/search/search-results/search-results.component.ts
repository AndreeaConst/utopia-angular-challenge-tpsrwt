import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent {
  @Input() characters$: Observable<any>;

  @Input() searchField = new FormControl('');
  @Output() searchFieldChange: EventEmitter<FormControl> = new EventEmitter();

  @Input() searchTerm = new BehaviorSubject<string>('');
  @Output() searchTermChange: EventEmitter<BehaviorSubject<string>> =
    new EventEmitter();

  dialogRef: MatDialogRef<DialogComponent>;

  constructor(public dialog: MatDialog) {}

  setStatusColor(status: string) {
    if (status === 'Alive') {
      return 'green';
    }
    if (status === 'Dead') {
      return 'red';
    }
  }

  openDialog(char) {
    this.dialogRef = this.dialog.open(DialogComponent, {
      data: {
        c: char,
      },
    });

    this.dialogRef.afterClosed().subscribe((res: string) => {
      if (!res) {
        return;
      }
      this.searchField.patchValue(res);
      this.searchFieldChange.emit(this.searchField);

      this.searchTerm.next(res);
      this.searchTermChange.emit(this.searchTerm);
    });
  }
}
