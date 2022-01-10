import { Injectable } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';
import { Feature } from '../interfaces/places';
import { DirectionsApiClient } from '../api/directionsApiClient';
import { DirectionsResponse, Route, Step } from '../interfaces/directions';

@Injectable({
  providedIn: 'root'
})
export class MapServiceService {

  public map?: Map;
  public markers: Marker[] = [];
  public isNavigating: boolean = false;;
  public kilometersNavigations: number = 0;
  public durationNavigations: number = 0;
  public steps: Step[] = [];

  get isMapReady() {
    return !!this.map;
  }

  constructor(
    private directionApi: DirectionsApiClient
  ) {

  }
  setMap(map: Map) {
    this.map = map;
  }

  flyTo( coords: LngLatLike ) {
    if(!this.isMapReady) throw new Error('The map is not initialized!!');

    this.map?.flyTo({
      zoom: 14,
      center: coords
    })

  }

  createMarkersFromPlaces( places: Feature[], userLocation: [number, number] ) {

    if( !this.map ) throw new Error('The map is not initialized!!');
    
    this.markers.forEach( marker => marker.remove() );
    const newMarkers = [];

    for (const place of places) {
      const [lng, lat] = place.center;
      const popup = new Popup()
      .setHTML(`
      <h6>${ place.text }</h6>
      <span>${ place.place_name }</span>
      `)

      const newMarker = new Marker()
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(this.map);

      newMarkers.push(newMarker);
    }

    this.markers = newMarkers;

    if(places.length === 0) return;

    // Limites del mapa
    const bounds = new LngLatBounds();
    bounds.extend(userLocation);
    newMarkers.forEach( marker => bounds.extend(marker.getLngLat()));
    this.map.fitBounds( bounds, {
      padding: 200
    } )
    

  }

  getRouteBetweenPoints( start: [number, number], end: [number, number]) {

    this.directionApi.get<DirectionsResponse>(`/${ start.join(',')};${end.join(',')}`)
      .subscribe( resp => this.drawPolyline(resp.routes[0]));

  }

  private drawPolyline( route: Route ) {
    // Todo Agregar Distancia y duracion
    this.kilometersNavigations = route.distance / 1000;
    this.durationNavigations = route.duration / 60;
    this.steps = route.legs[0].steps;         
    if(!this.map) throw new Error('The map is not initialized!!');

    const coords = route.geometry.coordinates;    
    const bounds = new LngLatBounds();

    coords.forEach( ([lng , lat] ) => {
      const newCoord: [number, number] = [lng, lat];
      bounds.extend( newCoord )
    });

    this.map?.fitBounds( bounds, {
      padding: 200
    });

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

    // Todo: limpiar ruta previa

    if(this.map.getLayer('RouteString')) {
      this.map?.removeLayer('RouteString');
      this.map?.removeSource('RouteString');
    }
    this.map.addSource('RouteString', sourceData);
    this.map.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        "line-cap": 'round',
        "line-join": 'round'
      },
      paint: {
        "line-color": '#CA0000',
        'line-width': 3
      }
    })

   
  }

  deleteMarkers(userLocation: [number, number]) {
    this.markers.forEach( marker => marker.remove() );
    this.map?.setCenter(userLocation);
    this.map?.setZoom(14);
  }

}
