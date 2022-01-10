import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Map, Popup, Marker } from 'mapbox-gl';
import { PlacesService } from '../../services';
import { MapServiceService } from '../../services/map-service.service';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {

  @ViewChild('mapDiv')
  mapDivElement!: ElementRef;
  
  constructor(
    private placesService: PlacesService,
    private mapService: MapServiceService
  ) { }

  ngAfterViewInit(): void {
    if(!this.placesService.userLocation) throw new Error('We do not have your ubication');

    const map = new Map({
      container: this.mapDivElement.nativeElement, // container ID      
      center: this.placesService.userLocation, // starting position [lng, lat]
      zoom: 14 // starting zoom
      }).setStyle(`mapbox://styles/mapbox/light-v10`);                  
      const popup = new Popup().setHTML(`
        <br>
        <h6>You're here</h6>
        <div style="text-align: center">😎</div>
      `);
      new Marker({
        color: 'red'
      }).setLngLat(this.placesService.userLocation)
      
      .setPopup( popup )
      .addTo( map );

      this.mapService.setMap( map );
  }

}
