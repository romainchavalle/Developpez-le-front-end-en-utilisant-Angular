import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { OlympicService } from '../core/services/olympic.service';
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Olympic } from '../core/models/Olympic';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [NgxChartsModule, RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit, OnDestroy {

  // set up Types //
  olympics$! : Observable<Olympic[]>;
  lineData: LineData[] = [];
  medalsNumber: number = 0;
  athletesNumber: number = 0;
  subscription!: Subscription;

  constructor(private olympicService: OlympicService, private route: ActivatedRoute, private router: Router) {}

  // Unsubscribe to avoid data fleeing //
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    // get params of active url //
    const countryName = this.route.snapshot.paramMap.get('country');

    if (countryName) {
      // get data from service //
      this.olympics$ = this.olympicService.getOlympics();

      // set up variables for the template //
      this.subscription = this.olympics$.subscribe((olympics) => {

        // Find the country data corresponding to params url //
        const countryData = olympics.find((olympic) => olympic.country.toLowerCase() === countryName.toLowerCase());

        if(countryData) {

          // Set up line data for template //
          this.lineData.push(
            {
              name: countryData.country,
              series: countryData.participations.map((participation) => ({
                name: participation.year.toString(),
                value: participation.medalsCount
              }))
            }
          ),

          // Set up medals number & athletes number for template //
          this.medalsNumber = countryData.participations.reduce((total, participation)=> total + participation.medalsCount, 0),
          this.athletesNumber = countryData.participations.reduce((total, participation)=> total + participation.athleteCount, 0)
        } else {
          this.router.navigate(['/error']);
        }
      });
    }
  }
}

interface LineData {
  name: string,
  series: {
    name: string,
    value: number
  }[]}
