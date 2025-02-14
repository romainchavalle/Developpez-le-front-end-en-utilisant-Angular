import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';
import { Olympic } from '../core/models/Olympic';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgxChartsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {

  // set up Types
  olympics$! : Observable<Olympic[]>;
  chartData: ChartData[] = [];
  olympicsNumber: number = 0;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {

    this.olympics$ = this.olympicService.getOlympics();

    this.olympics$.subscribe((olympics) => {

      // CALCUL CHART DATA //
      for (let olympic of olympics) {
        this.chartData.push({
          name: olympic.country,
          value: this.olympicService.countMedals(olympic)
        })
      }

      // CALCUL OLYMPICS NUMBER //
      const allYears = olympics.flatMap((olympic) =>
        olympic.participations.map((participation) => participation.year));
      const uniqueYears = new Set(allYears);
      this.olympicsNumber = uniqueYears.size
    });

  }

  // Navigating into differents views
  onSelect(event: any) {
    const countryName = event.name;
    this.router.navigate(['/details', countryName]);
  }
}

interface ChartData {
  name: string | number;
  value: number;
}
