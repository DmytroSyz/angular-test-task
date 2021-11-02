import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {fromEvent} from "rxjs";
import {DataService} from "../../services/data.service";
import {debounceTime} from "rxjs/operators";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-trades',
  templateUrl: './trades.component.html',
  styleUrls: ['./trades.component.scss']
})
export class TradesComponent implements OnInit, AfterViewInit {

  public errorArr: string[] = [];

  public profit: number | null = null;

  public formGroup!: FormGroup;

  @ViewChild('exitPriceInput')
  exitPriceInput!: ElementRef;

  @ViewChild('entryPriceInput')
  entryPriceInput!: ElementRef;

  constructor(private dataService: DataService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      entryPrice: ['', [Validators.required, Validators.min(1)]],
      exitPrice: ['', [Validators.required, Validators.min(1)]],

      entryDate: ['', [Validators.required]],
      exitDate: ['', [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    fromEvent(this.entryPriceInput.nativeElement, 'input').pipe(debounceTime(500)).subscribe(() => {
      this.profit = this.formGroup.controls['exitPrice'].value - this.formGroup.controls['entryPrice'].value;
    });
    fromEvent(this.exitPriceInput.nativeElement, 'input').pipe(debounceTime(500)).subscribe(() => {
      this.profit = this.formGroup.controls['exitPrice'].value - this.formGroup.controls['entryPrice'].value;
    });
  }

  click() {
    this.errorArr = [];
    if (this.formGroup.invalid) {
      if (!this.formGroup.controls['entryDate'].value) {
        this.errorArr.push('Enter entry date')
      }
      if (!this.formGroup.controls['entryPrice'].value) {
        this.errorArr.push('Enter entry price')
      }
      if (!this.formGroup.controls['exitDate'].value) {
        this.errorArr.push('Enter exit date')
      }
      if (!this.formGroup.controls['exitPrice'].value) {
        this.errorArr.push('Enter exit price')
      }
      return;
    }
    this.dataService.currentData.next([{
      date: this.formGroup.controls['entryDate'].value,
      price: this.formGroup.controls['entryPrice'].value,
      type: 'entry'
    },
      {
        date: this.formGroup.controls['exitDate'].value,
        price: this.formGroup.controls['exitPrice'].value,
        type: 'exit'
      }
    ]);
    this.formGroup.reset();
  }

}

