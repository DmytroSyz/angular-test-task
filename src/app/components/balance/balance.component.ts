import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService, IChartData, ITradeData} from "../../services/data.service";

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

  public dataArr: ITradeData[] = [];

  public type: string = 'line';

  public data: IChartData = {
    labels: [],
    datasets: [
      {
        label: "Balance",
        data: []
      },

    ]
  };

  public options = {
    responsive: true,
    maintainAspectRatio: false
  };

  constructor(private readonly dataService: DataService) {
  }

  ngOnInit(): void {

    this.dataService.currentData$.subscribe((res: ITradeData[]) => {
      if (res) {
        res.forEach((res: ITradeData) => {
          if (res.type === 'entry') {
            this.dataArr.push({date: res.date, price: -res.price})
          }
          if (res.type === 'exit') {
            this.dataArr.push({date: res.date, price: res.price})
          }
        });
        const sortDataArr = this.dataArr.sort((a: ITradeData, b: ITradeData) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateA > dateB ? 1 : -1;
        });
        let balance = 0;
        const balanceArr: number[] = [];
        const dateArrToLocale: string[] = [];
        sortDataArr.forEach((res: ITradeData) => {
          balanceArr.push(balance = balance + res.price);
          dateArrToLocale.push(res.date.toLocaleDateString());
        });

        this.data = {
          labels: dateArrToLocale,
          datasets: [
            {
              label: "Balance",
              data: balanceArr
            },

          ]
        };
      }
    })
  }
}
