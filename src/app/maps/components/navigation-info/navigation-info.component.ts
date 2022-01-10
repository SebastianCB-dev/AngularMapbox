import { Component, OnInit } from '@angular/core';
import { MapServiceService } from '../../services';

@Component({
  selector: 'app-navigation-info',
  templateUrl: './navigation-info.component.html',
  styleUrls: ['./navigation-info.component.css']
})
export class NavigationInfoComponent implements OnInit {

  

  constructor(
    private mapService: MapServiceService
  ) { }

  ngOnInit(): void {
  }

  get isNavigation(): boolean {
    return this.mapService.isNavigating;
  }

  get duration() {
    return this.mapService.durationNavigations;
  }

  get distance() {
    return this.mapService.kilometersNavigations;
  }
  get steps() {
    return this.mapService.steps;
  }

  closeToast() {
    this.mapService.isNavigating = false;
  }
}
