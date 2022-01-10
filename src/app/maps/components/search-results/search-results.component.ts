import { Component } from '@angular/core';
import { Feature } from '../../interfaces/places';
import { MapServiceService } from '../../services';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent {

  public selectedPlace: string = ''; 

  constructor(
    private placesService: PlacesService,
    private mapService: MapServiceService
  ) { }

    get isLoadingPlaces(): boolean {
      return this.placesService.isLoadingPlaces;
    }

    get places(): Feature[] {
      return this.placesService.places;
    }

    flyTo( place: Feature, index:number ) {
      //Change Color
      this.mapService.markers[index].getElement().parentElement?.setAttribute('fill', '#ccc');
      this.selectedPlace = place.id;
      const [ lng, lat ] = place.center;
      this.mapService.flyTo( [lng, lat] );      
    }

    getDirections( place: Feature ) {
      //Eliminar los otros lugares:       
      let places: Feature[] = [];
      places.push(place);            
      if(!this.placesService.userLocation) throw new Error('No hay userLocation')
      this.mapService.createMarkersFromPlaces(places, this.placesService.userLocation);
      const start = this.placesService.userLocation;
      const end = place.center as [number, number];
      this.mapService.getRouteBetweenPoints(start, end)
      this.placesService.deletePlaces();
      this.mapService.isNavigating = true;
      this.selectedPlace = '';
    }

}
