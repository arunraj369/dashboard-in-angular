import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmpAddEditComponent } from '../emp-add-edit/emp-add-edit.component';
import { EmployeeService } from '../services/employee.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';
import { CoreService } from '../core/core.service';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';

import { DeleteComponent } from '../delete/delete.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'fullName',
    'empid',
    'email',
    'dob',
    'gender',
    'experience',
    'password',
    'action',
  ];

  dataSource!: MatTableDataSource<any>;
  // pipe: DatePipe;

  // filterForm = new FormGroup({
  //   fromDate: new FormControl(),
  //   toDate: new FormControl(),
  // });

  // get fromDate() {
  //   return this.filterForm.get('fromDate')!.value;
  // }
  // get toDate() {
  //   return this.filterForm.get('toDate')!.value;
  // }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private _empService: EmployeeService,
    private _coreService: CoreService
  ) {
    // this.pipe = new DatePipe('en');
    // this.dataSource.filterPredicate = (data, filter) => {
    //   if (this.fromDate && this.toDate) {
    //     return data.created >= this.fromDate && data.created <= this.toDate;
    //   }
    //   return true;
    // };
  }

  // applyFilters() {
  //   this.dataSource.filter = '' + Math.random();
  // }
  ngOnInit(): void {
    this.getEmployeeList();
  }

  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(EmpAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEmployeeList();
        }
      },
    });
  }

  getEmployeeList() {
    this._empService.getEmployeeList().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteEmployee(id: number) {
    const dialogRef = this._dialog.open(DeleteComponent, {
      data: {
        message: 'Are you sure want to delete?',
        buttonText: {
          ok: 'Delete',
          cancel: 'Cancel',
        },
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this._empService.deleteEmployee(id).subscribe({
          next: (res) => {
            this._coreService.openSnackBar('Employee deleted!', 'done');
            this.getEmployeeList();
          },
          error: console.log,
        });
      }
    });
  }

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(EmpAddEditComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEmployeeList();
        }
      },
    });
  }
}
