import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Assignment } from '../assignments/assignment.model';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css'],
})
export class DialogBoxComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Assignment
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {}
}
