import { Component } from '@angular/core';
import { MapServiceService, PlacesService } from '../../services';


@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  private debounceTimer?: NodeJS.Timeout;


  constructor(
    private placesService: PlacesService,
    private mapService: MapServiceService
  ) { }

 
  onQueryChanged( query: string = '' ) {
    if( this.debounceTimer ) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout( () => {
      this.placesService.getPlacesByQuery(query);
    }, 350);
    

  }
}
