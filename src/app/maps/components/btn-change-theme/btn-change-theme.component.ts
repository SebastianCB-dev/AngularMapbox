import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MapServiceService, PlacesService } from '../../services';
import { Map, Popup, Marker, AnySourceData } from 'mapbox-gl';
@Component({
  selector: 'app-btn-change-theme',
  templateUrl: './btn-change-theme.component.html',
  styleUrls: ['./btn-change-theme.component.css']
})
export class BtnChangeThemeComponent implements OnInit {

  @ViewChild('buttonChangeTheme')
  btnChangeTheme!: ElementRef;
    
  mapDivElement!: ElementRef;
  
  public theme: string = 'Night';
  constructor(
    private placesService: PlacesService,
    private mapService: MapServiceService
  ) { }

  ngOnInit(): void {
  }

  changeThemeMap() {
    if(this.placesService.mapOption == 'dark') {
      this.placesService.mapOption = 'light';
      this.theme = 'Night';
      this.btnChangeTheme.nativeElement.classList.remove('btn-warning');
      this.btnChangeTheme.nativeElement.classList.add('btn-secondary');   
      if(this.mapService.map?.getLayer('RouteString')) {        
        this.mapService.map?.removeLayer('RouteString');
        this.mapService.map?.removeSource('RouteString');
      }
      this.mapService.map?.setStyle('mapbox://styles/mapbox/light-v10',{
        diff: false
      } ); 
      if(this.mapService.coords) {
        setTimeout(()=> {
          this.redibujarMapa(this.mapService.coords);
        },100) 
      }

      
      }   
      
    else {
      this.placesService.mapOption = 'dark';
      this.theme = 'Sun';
      this.btnChangeTheme.nativeElement.classList.remove('btn-secondary');
      this.btnChangeTheme.nativeElement.classList.add('btn-warning');     
      if(this.mapService.map?.getLayer('RouteString')) {     
        this.mapService.map?.removeLayer('RouteString');
        this.mapService.map?.removeSource('RouteString');
      }
      this.mapService.map?.setStyle('mapbox://styles/mapbox/dark-v10', {
        diff: false
      } ).addLayer; 
      if(this.mapService.coords) {  
        setTimeout(()=> {
          this.redibujarMapa(this.mapService.coords);
        },400)  
       
      }
    }

  }

  redibujarMapa(coords: number[][]) {
    // Polyline
    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords
            }
          }
        ]
      }
    }
    
    this.mapService.map?.addSource('RouteString', sourceData);
    this.mapService.map?.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        "line-cap": 'round',
        "line-join": 'round'
      },
      paint: {
        "line-color": 'red',
        'line-width': 3
      }
    });
  }
  
}
