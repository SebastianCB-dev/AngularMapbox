import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MapServiceService } from '.';
import { PlacesApiClient } from '../api/placesApiClient';
import { Feature, PlacesResponse } from '../interfaces/places';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation?: [number, number];
  public mapOption: String = 'light';
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  get isUserLocationReady(): boolean {
    return !!this.userLocation;
  }

  constructor(
    private placesApi: PlacesApiClient,
    private mapService: MapServiceService
  ) {
    this.getUserLocation();
   }

  public async getUserLocation(): Promise<[number, number]> {

    return new Promise ( (res,rej)=> {

      navigator.geolocation.getCurrentPosition( 
        ( { coords } ) => {
          this.userLocation = [coords.longitude, coords.latitude];
          res( this.userLocation );
        },
        ( err ) => {
          alert('No se pudo obtener la geolocalización');
          console.log( err );
          rej();
        }
       );

    });


  }

  getPlacesByQuery( query: string = '' ) {
    // todo: evaluar cuando el query es nulo

    if(query.length === 0) {
      this.isLoadingPlaces = false;
      this.places = [];
      return;
    }
    if( !this.userLocation ) throw new Error('No hay userlocation');
    this.isLoadingPlaces = true;

    this.placesApi.get<PlacesResponse>( `/${ query }.json`, {
      params: {
        proximity: this.userLocation?.join(',')
      }
    }  )
      .subscribe( resp => {        
        this.isLoadingPlaces = false;
        this.places = resp.features; 
        this.mapService.createMarkersFromPlaces(this.places, this.userLocation!);       
      });
      
  }

  deletePlaces() {
    this.places = [];
  }

}
