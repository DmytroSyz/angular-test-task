import {Injectable} from '@angular/core';
import {Subject} from "rxjs";


export interface IChartData {
  labels: any[];
  datasets: any[];
}

export interface ITradeData {
  date: Date;
  price: number;
  type?: 'entry' | 'exit'
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public currentData: Subject<ITradeData[]> = new Subject();
  public currentData$ = this.currentData.asObservable();

  constructor() {
  }
}
