"use strict";
var map;
var markers;
var breweries = [
    {
        id: 1,
        name: "Unser Bier",
        address: "Gundeldingerstrasse 287, 4053 Basel",
        location: {lat: 47.5403194, lng: 7.592806}
    },
    {
        id: 2,
        name: "Stadtmauer Brauer Brauerei",
        address: "Leonhardsgraben 49, 4051 Basel",
        location: {lat: 47.55579940000001, lng: 7.5867448}
    },
    {
        id: 3,
        name: "Kitchen Brew",
        address: "Binningerstrasse 101, 4123 Allschwil",
        location: {lat: 47.5482873, lng: 7.548081000000001}
    },
    {
        id: 4,
        name: "Zur grünen Amsel",
        address: "Schmiedgasse 30, 4125 Riehen",
        location: {lat: 47.5846135, lng: 7.651654799999999}
    },
    {
        id: 5,
        name: "Volta Brau",
        address: "4056, Voltastrasse 30, 4056 Basel",
        location: {lat: 47.57106109999999, lng: 7.5800227}
    },
    {
        id: 6,
        name: "Zum Bierjohann",
        address: "Elsasserstrasse 17, 4056 Basel",
        location: {lat: 47.5676813, lng: 7.580805099999999}
    },
];

var Place = function(data){
  this.id = data.id;
  this.name = data.name;
  this.address = data.address;
  this.location = data.location;
};

var PlacesViewModel = function() {
  var self = this;
  this.places = {};
  this.markers = {};
  this.infowindows = {};
  this.isOpen = ko.observable(false);
  this.filterBy = ko.observable("");
  this.filteredPlaces = ko.observableArray();
  // Fill the places
  for (var i = 0; i < breweries.length; i++) {
      this.places[breweries[i].id] = new Place(breweries[i]);
  }
  this.toggleIsOpen = function(){
      console.log(self.isOpen());
      self.isOpen(!self.isOpen());
  }
  
  this.filterPlaces = function(){
    for (var iid in self.infowindows) {
        self.infowindows[iid].close();
    }
      self.filteredPlaces([]);
      if (self.filterBy()){
          for (var id in self.places) {
            if (self.places[id].name.toLowerCase().includes(self.filterBy().toLowerCase()) 
              || self.places[id].address.toLowerCase().includes(self.filterBy().toLowerCase())){
              self.filteredPlaces.push(self.places[id]);
              self.markers[id].setVisible(true);
            }
            else{
              self.markers[id].setVisible(false);
          }
          }
      }
      else {
          for (var id in self.places) {
            self.filteredPlaces.push(self.places[id]);
            self.markers[id].setVisible(true);
          }
      }
  }
  
  this.showOnMap = function(place){
    var marker = self.markers[place.id];
    var infowindow = self.infowindows[place.id];
    for (var iid in self.infowindows) {
        self.infowindows[iid].close();
    }
    marker.setAnimation(google.maps.Animation.BOUNCE);
    infowindow.open(map, marker);
    setTimeout(function(){ marker.setAnimation(null); }, 750);
  }
  
  this.bounceMarker = function(place){
    var marker = self.markers[place.id];
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ marker.setAnimation(null); }, 750);
  }

  this.presentSpecialMarker = function(place){
    var marker = self.markers[place.id];
    marker.setIcon("static/img/darkgreen_MarkerA.png");
  }

  this.presentDefaultMarker = function(place){
    var marker = self.markers[place.id];
    marker.setIcon("static/img/blue_MarkerA.png");
  }

  this.createMarkers = function(){
      for (var id in self.places) {
          var marker = new google.maps.Marker({
             position: self.places[id].location,
             map: map,
             title: self.places[id].name,
             mapTypeControl: false,
             animation: google.maps.Animation.DROP,
             icon: "static/img/blue_MarkerA.png"
          });
          var infowindow = new google.maps.InfoWindow({
              content: '<span class="info-name">' + self.places[id].name + '<span>'
          });
          (function(marker, infowindow){
              marker.addListener('click', function(){
                  for (var iid in self.infowindows) {
                      self.infowindows[iid].close();
                  }
                  marker.setAnimation(google.maps.Animation.BOUNCE);
                  infowindow.open(map, marker);
                  setTimeout(function(){ marker.setAnimation(null); }, 750);
              });
          })(marker, infowindow);
          self.markers[id] = marker;
          self.infowindows[id] = infowindow;
          console.log(self.places[id].name)
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
