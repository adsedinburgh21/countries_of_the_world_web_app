var Map = function( latLng, zoom){

  this.googleMap = new google.maps.Map( document.getElementById('map' ), {
    center: latLng,
    zoom: zoom
  } );

  this.addMarker = function( latLng, title ){
    var marker = new google.maps.Marker( {
      position: latLng,
      map: this.googleMap,
      title: title
    } );
    return marker;
  };

  this.addInfoWindow = function( latLng, title ){
    var marker = this.addMarker( latLng, title );
    var infoWindow = new google.maps.InfoWindow({
      content: title
    });
    infoWindow.open( this.googleMap, marker );
  };

};
