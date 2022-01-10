import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MapServiceService, PlacesService } from '../../services';
import { Map, Popup, Marker } from 'mapbox-gl';
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
      this.mapService.map?.setStyle('mapbox://styles/mapbox/light-v10' );    
    }
    else {
      this.placesService.mapOption = 'dark';
      this.theme = 'Sun';
      this.btnChangeTheme.nativeElement.classList.remove('btn-secondary');
      this.btnChangeTheme.nativeElement.classList.add('btn-warning');
      this.mapService.map?.setStyle('mapbox://styles/mapbox/dark-v10' );    
    }

  }
}
