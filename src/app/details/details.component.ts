import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from '../core/services/olympic.service';
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Olympic } from '../core/models/Olympic';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [NgxChartsModule, RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {

  olympics$! : Observable<Olympic[]>;
  lineData: LineData[] = [];
  medalsNumber: number = 0;
  athletesNumber: number = 0;

  constructor(private olympicService: OlympicService, private route: ActivatedRoute) {}

  ngOnInit(): void {
  // get params of active url
    const countryName = this.route.snapshot.paramMap.get('country') || 'Inconnu';

    // get data from service
    this.olympics$ = this.olympicService.getOlympics();

    // set up variables for the template
    this.olympics$.subscribe((olympics) => {

      const countryData = olympics.find((olympic) => olympic.country.toLowerCase() === countryName.toLowerCase());

      if(countryData) {
        this.lineData.push(
          {
            name: countryData.country,
            series: countryData.participations.map((participation) => ({
              name: participation.year.toString(),
              value: participation.medalsCount
            }))
          }
        ),

        this.medalsNumber = countryData.participations.reduce((total, participation)=> total + participation.medalsCount, 0),
        this.athletesNumber = countryData.participations.reduce((total, participation)=> total + participation.athleteCount, 0)
      }
    });
  }

}

interface LineData {
  name: string,
  series: {
    name: string,
    value: number
  }[]}
