"use strict";
var map;
var markers;
var breweries = [
    {
        name: "Unser Bier",
        address: "Gundeldingerstrasse 287, 4053 Basel",
        location: {lat: 47.5403194, lng: 7.592806}
    },
    {
        name: "Stadtmauer Brauer Brauerei",
        address: "Leonhardsgraben 49, 4051 Basel",
        location: {lat: 47.55579940000001, lng: 7.5867448}
    },
    {
        name: "Kitchen Brew",
        address: "Binningerstrasse 101, 4123 Allschwil",
        location: {lat: 47.5482873, lng: 7.548081000000001}
    },
    {
        name: "Zur grünen Amsel",
        address: "Schmiedgasse 30, 4125 Riehen",
        location: {lat: 47.5846135, lng: 7.651654799999999}
    },
    {
        name: "Volta Brau",
        address: "4056, Voltastrasse 30, 4056 Basel",
        location: {lat: 47.57106109999999, lng: 7.5800227}
    },
    {
        name: "Zum Bierjohann",
        address: "Elsasserstrasse 17, 4056 Basel",
        location: {lat: 47.5676813, lng: 7.580805099999999}
    },
];

var Place = function(data){
  this.name = data.name;
  this.address = data.address;
  this.location = data.location;
};

var PlacesViewModel = function() {
  var self = this;
  this.places = [];
  this.markers = [];
  this.isOpen = ko.observable(false);
  this.filterBy = ko.observable("");
  this.filteredPlaces = ko.observableArray();
  // Fill the places
  for (var i = 0; i < breweries.length; i++) {
      this.places.push(new Place(breweries[i]));
  }
  this.toggleIsOpen = function(){
      console.log(self.isOpen());
      self.isOpen(!self.isOpen());
  }
  
  this.filterPlaces = function(){
      if (self.filterBy()){
          self.filteredPlaces([]);
          for (var i = 0; i < self.places.length; i++) {
            if (self.places[i].name.toLowerCase().includes(self.filterBy().toLowerCase()) 
              || self.places[i].address.toLowerCase().includes(self.filterBy().toLowerCase())){
              self.filteredPlaces.push(self.places[i]);
              self.markers[i].setVisible(true);
            }
            else{
              self.markers[i].setVisible(false);
          }
          }
      }
      else {
          self.filteredPlaces(self.places);
      }
  }

  this.createMarkers = function(){
      for (var i = 0; i < self.places.length; i++) {
          var marker = new google.maps.Marker({
             position: self.places[i].location,
             map: map,
             title: self.places[i].name,
             mapTypeControl: false,
          });
          var infowindow = new google.maps.InfoWindow({
              content: '<span class="info-name">' + self.places[i].name + '<span>'
          });
          (function(marker, infowindow){
              marker.addListener('click', function(){
                  infowindow.open(map, marker);
              });
          })(marker, infowindow);
          self.markers[i] = marker;
          console.log(self.places[i].name)
      }
  }

  this.createMarkers();
  this.filterPlaces();
};

// MAP INITIALIZATION
function init() {
  map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 47.5546676, lng: 7.5594406},
      zoom: 12,
  });
  ko.applyBindings(new PlacesViewModel());
}
