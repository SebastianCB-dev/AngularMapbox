import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import Mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

if( !navigator.geolocation ) {
  alert('Navegador no soporta la geolocalización');
  throw new Error('Navegador no soporta la geolocalización');
}

Mapboxgl.accessToken = 'pk.eyJ1Ijoic2ViYXN0aWFuY2IiLCJhIjoiY2t5N2UzOHBkMTN0MDJxcWUwdHN1Y2gwcCJ9.IQWE3vAnF89MnGFaqd2yCQ';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
