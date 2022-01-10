import { ThrowStmt } from '@angular/compiler';
import { Component } from '@angular/core';
import { MapServiceService } from '../../services';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrls: ['./btn-my-location.component.css']
})
export class BtnMyLocationComponent   {

  constructor(
    private mapService: MapServiceService,
    private placesService: PlacesService
  ) { }

  goToMyLocation() {
    if(!this.placesService.userLocation) throw new Error('No hay ubicación');
    if(!this.mapService.isMapReady) throw new Error('No hay mapa disponible');    

    this.mapService.flyTo(this.placesService.userLocation);
  }

}
