"use strict";
var map;
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
  this.isOpen = ko.observable(false);
  this.places = ko.observableArray();
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
          for (var i = 0; i < self.places().length; i++) {
              console.log("Adding", self.places()[i]);
            //   self.filteredPlaces.push(self.places()[i]);
          }
      }
      else {
          self.filteredPlaces(self.places());
      }
  }
  
  this.filterPlaces();
};

// MAP INITIALIZATION
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 47.5546676, lng: 7.5594406},
      zoom: 14,
  });
}






ko.applyBindings(new PlacesViewModel());