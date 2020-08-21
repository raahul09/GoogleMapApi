import { Component,  ViewChild,ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
// import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
// import { GoogleMap, MarkerIcon, } from "@ionic-native/google-maps";
declare var google:any;
@Component({
  selector: 'app-home',
   templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
    constructor(private geolocation: Geolocation) {
   }
  //  display map start
   @ViewChild('map',{read:ElementRef,static:false}) mapref:ElementRef;

   myMaker:any;
   coords:any;
   map:any;
   address: string;  // Readable Address
   latit: number;  // Location coordinates
   longit: number;
   accur: number;

   ionViewDidEnter() {
    this.initMap();
   }

  
   initMap (){
    this.coords = new google.maps.LatLng(23.0,76.0); 
  
    let MapOptionObj :google.maps.MapOptions={
      center:this.coords,
      zoom:10,
      mapTypeId:google.maps.MapTypeId.ROADMAP
     }
    this.map = new google.maps.Map(this.mapref.nativeElement, MapOptionObj);
  
  
  }
//----------------------------------------------------------------------------------------------
                              // marker on currrent location

                              

MapMarker(latx , lngy) {

  var mapPointer={
    center:{lat:latx,lng:lngy},
    zoom: 10,
  }
 this.map = new google.maps.Map(this.mapref.nativeElement, mapPointer);

 console.log(latx,lngy);

 var pointerMarker = {
   position: {lat:latx,lng:lngy},
   map: this.map
 }
   this.myMaker = new google.maps.Marker(pointerMarker);
}





// -----------------------------------------------------------------------------------------------
 //Get current coordinates of device
 getGeolocation() {
    this.geolocation.getCurrentPosition().then((resp) => {

     this.latit = resp.coords.latitude;
     this.longit = resp.coords.longitude;
     this.accur = resp.coords.accuracy;
    //  this.getGeoencoder(resp.coords.latitude, resp.coords.longitude);
    // this.getGeoencoder();
     console.log(this.longit,this.latit);
     this.MapMarker(this.latit,this.longit);

     console.log('called geolocation');
   }).catch((error) => {
     alert('Error getting location' + JSON.stringify(error));
   });
 }


// ---------------------------------Multipe marker on map ---------------------------------------------//
 customMarkerOnMap(): void {
   this.map = new google.maps.Map(this.mapref.nativeElement , 
    {
      zoom: 4,
      center: { lat: -25.363882, lng: 131.044922 }
    }
  );

  this.map.addListener("click", e => {
    this.placeMarkerAndPanTo(e.latLng, this.map);
  });
}

 placeMarkerAndPanTo(latLng: google.maps.LatLng, map: google.maps.Map) {
  new google.maps.Marker({
    position: latLng,
    map: map
  });
  map.panTo(latLng);
}
//-------------------------------------------------------------------------------


 customLatLngOnMap() {
  var myLatlng = {lat: -25.363, lng: 131.044};

  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 4, center: myLatlng});

  // Create the initial InfoWindow.
  var infoWindow = new google.maps.InfoWindow(
      {content: 'Click the map to get Lat/Lng!', position: myLatlng});
  infoWindow.open(map);

  console.log(myLatlng);
  

  // Configure the click listener.
  map.addListener('click', (mapsMouseEvent)=> {
    // Close the current InfoWindow.
    infoWindow.close();

    // Create a new InfoWindow.
    infoWindow = new google.maps.InfoWindow({position: mapsMouseEvent.latLng});
    infoWindow.setContent(mapsMouseEvent.latLng.toString());
    console.log(mapsMouseEvent.latLng.toString());
    
    infoWindow.open(this.myMaker);
  });
}
// -----------------------------------------------------------------------------------
// autoCompleteSearchLocation

// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.


initAutocomplete() {
  const map = new google.maps.Map(this.mapref.nativeElement,{
      center: { lat:this.latit, lng:this.longit },
      zoom: 13,
      mapTypeId: "roadmap"
    }
  );

  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input") as HTMLInputElement;
  const searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
  });

  let markers: google.maps.Marker[] = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(marker => {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();
    places.forEach(place => {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      const icon = {
        url: place.icon as string,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location
        })
      );

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}

// ---------------------------------------------------------------------------------
// direction by selectMode


xMap(): void {
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const directionsService = new google.maps.DirectionsService();
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 14,
      center: { lat: 37.77, lng: -122.447 }
    }
  );
  directionsRenderer.setMap(map);

  this.calculateAndDisplayRoute(directionsService, directionsRenderer);
  (document.getElementById("mode") as HTMLInputElement).addEventListener(
    "change",
    () => {
      this.calculateAndDisplayRoute(directionsService, directionsRenderer);
    }
  );
}

 calculateAndDisplayRoute(
  directionsService: google.maps.DirectionsService,
  directionsRenderer: google.maps.DirectionsRenderer
) {
  const selectedMode = (document.getElementById("mode") as HTMLInputElement)
    .value;
  directionsService.route(
    {
      origin: { lat: 37.77, lng: -122.447 }, // Haight.
      destination: { lat: 37.768, lng: -122.511 }, // Ocean Beach.
      // Note that Javascript allows us to access the constant
      // using square brackets and a string value as its
      // "property."
      // @ts-ignore
      travelMode: google.maps.TravelMode[selectedMode]
    },
    (response, status) => {
      if (status == "OK") {
        directionsRenderer.setDirections(response);
        console.log(directionsRenderer.setDirections(response));
        
      } else {
        window.alert("Directions request failed due to " + status);
      }
    }
  );
}



// ---------------------------------------------------------------------------------------



initap(): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 8,
      center: { lat: 40.731, lng: -73.997 }
    }
  );
  const geocoder = new google.maps.Geocoder();
  const infowindow = new google.maps.InfoWindow();

  (document.getElementById("submit") as HTMLElement).addEventListener(
    "click",
    () => {
      this.geocodeLatLng(geocoder, map, infowindow);
    }
  );
}

 geocodeLatLng(
  geocoder: google.maps.Geocoder,
  map: google.maps.Map,
  infowindow: google.maps.InfoWindow
) {
  const input = (document.getElementById("latlng") as HTMLInputElement).value;
  const latlngStr = input.split(",", 2);
  console.log(latlngStr);
  
  const latlng = {
    lat: parseFloat(latlngStr[0]),
    lng: parseFloat(latlngStr[1])
  };
  geocoder.geocode(
    { location: latlng },
    (
      results: google.maps.GeocoderResult[],
      status: google.maps.GeocoderStatus
    ) => {
      if (status === "OK") {
        if (results[0]) {
          map.setZoom(11);
          const marker = new google.maps.Marker({
            position: latlng,
            map: map
          });
          infowindow.setContent(results[0].formatted_address);
          infowindow.open(map, marker);
        } else {
          window.alert("No results found");
        }
      } else {
        window.alert("Geocoder failed due to: " + status);
      }
    }
  );
}

}













// NOTE Extra Code Of GeoCoder & Nativecoder

//  Geocoder configuration
//  geoencoderOptions: NativeGeocoderOptions = {
//    useLocale: true,
//    maxResults: 5
//  };


 //geocoder method to fetch address from coordinates passed as arguments
//  getGeoencoder(latitude, longitude) {
//   getGeoencoder() {
//   console.log('called geocoder');
  
//    this.nativeGeocoder.reverseGeocode(52.5072095, 13.1452818, this.geoencoderOptions)
//    .then((result: NativeGeocoderResult[]) => console.log(JSON.stringify(result[0])))
//    .catch((error: any) => console.log(error));
//     //  .then((result: NativeGeocoderResult[]) => {
//     //    console.log(result[0]);
       
//     //    this.address = this.generateAddress(result[0]);
//     //  })
//     //  .catch((error: any) => {
//     //    alert('Error getting location' + JSON.stringify(error));
//     //  });
//  }

//  //Return Comma saperated address
//  generateAddress(addressObj) {
//    console.log("called generateaddress");
   
//    let obj = [];
//    let address = "";
//    for (let key in addressObj) {
//      obj.push(addressObj[key]);
//    }
//    obj.reverse();
//    for (let val in obj) {
//      if (obj[val].length)
//        address += obj[val] + ', ';
//    }
//    console.log(address.slice(0,-2));
   
//    return address.slice(0, -2);
   

//  }
