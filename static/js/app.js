"use strict";
var map;
var places = {};
var markers = {};
var infowindows = {};
var foursquare_client_id = "3G1MBSYT0JTINL05LEBCLW3HDZZZJPOS1HFOJELBTOTHHLI4";
var foursquare_client_secret = "SHETVMNBXMJNEFSGCL125YEFV1QKKOQHAIRK0SBOO52UR0MB";
var foursquare_url = "https://api.foursquare.com/v2/venues/";
var foursquare_version = "20170218";
var breweries = [
    {
        id: 1,
        name: "Unser Bier",
        address: "Gundeldingerstrasse 287, 4053 Basel",
        location: {lat: 47.5403194, lng: 7.592806},
        foursquare_id: "4bc075d92a89ef3b8084f088",
    },
    {
        id: 2,
        name: "Brauerei Fischerstube",
        address: "Rheingasse 45, 4058 Basel",
        location: {lat: 47.5592976, lng: 7.5909853},
        foursquare_id: "4bd2fd4a462cb7135941dd07",
    },
    {
        id: 3,
        name: "Kitchen Brew",
        address: "Binningerstrasse 101, 4123 Allschwil",
        location: {lat: 47.5482873, lng: 7.548081000000001},
        foursquare_id: "582c44701b95ff77da9fd99a",
    },
    {
        id: 4,
        name: "Zur grünen Amsel",
        address: "Schmiedgasse 30, 4125 Riehen",
        location: {lat: 47.5846135, lng: 7.651654799999999},
        foursquare_id: "4d97164c0caaa143792988b3",
    },
    {
        id: 5,
        name: "Volta Brau",
        address: "4056, Voltastrasse 30, 4056 Basel",
        location: {lat: 47.57106109999999, lng: 7.5800227},
        foursquare_id: "545282ad498eca0126354087",
    },
    {
        id: 6,
        name: "Zum Bierjohann",
        address: "Elsasserstrasse 17, 4056 Basel",
        location: {lat: 47.5676813, lng: 7.580805099999999},
        foursquare_id: "58418e6a9e3d773ecacd3686",
    },
    {
        id: 7,
        name: "Restaurant Hasenburg",
        address: "Chateau Lapin, Schneidergasse 20, 4051 Basel",
        location: {lat: 47.5580587, lng: 7.5845113},
        foursquare_id: "4b4383e6f964a5202ce225e3",
    },
];

var Place = function(data){
  this.id = data.id;
  this.name = data.name;
  this.address = data.address;
  this.location = data.location;
  this.foursquare_id = data.foursquare_id;
};

var PlacesViewModel = function() {
  var self = this;
  this.isOpen = ko.observable(false);
  this.filterBy = ko.observable("");
  this.filteredPlaces = ko.observableArray();
  // Fill the places
  for (var i = 0; i < breweries.length; i++) {
      places[breweries[i].id] = new Place(breweries[i]);
  }
  this.toggleIsOpen = function(){
      console.log(self.isOpen());
      self.isOpen(!self.isOpen());
  }
  
  this.filterPlaces = function(){
    for (var iid in infowindows) {
        infowindows[iid].close();
    }
      self.filteredPlaces([]);
      if (self.filterBy()){
          for (var id in places) {
            if (places[id].name.toLowerCase().includes(self.filterBy().toLowerCase()) 
              || places[id].address.toLowerCase().includes(self.filterBy().toLowerCase())){
              self.filteredPlaces.push(places[id]);
              markers[id].setVisible(true);
            }
            else{
              markers[id].setVisible(false);
          }
          }
      }
      else {
          for (var id in places) {
            self.filteredPlaces.push(places[id]);
            markers[id].setVisible(true);
          }
      }
  }
  
  this.showOnMap = function(place){
    var marker = markers[place.id];
    var infowindow = infowindows[place.id];
    for (var iid in infowindows) {
        infowindows[iid].close();
    }
    marker.setAnimation(google.maps.Animation.BOUNCE);
    infowindow.open(map, marker);
    setTimeout(function(){ marker.setAnimation(null); }, 750);
  }
  
  this.bounceMarker = function(place){
    var marker = markers[place.id];
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ marker.setAnimation(null); }, 750);
  }

  this.presentSpecialMarker = function(place){
    var marker = markers[place.id];
    marker.setIcon("static/img/darkgreen_MarkerA.png");
  }

  this.presentDefaultMarker = function(place){
    var marker = markers[place.id];
    marker.setIcon("static/img/blue_MarkerA.png");
  }

  this.createMarkers = function(){
      for (var id in places) {
          var marker = new google.maps.Marker({
             position: places[id].location,
             map: map,
             title: places[id].name,
             mapTypeControl: false,
             animation: google.maps.Animation.DROP,
             icon: "static/img/blue_MarkerA.png"
          });
          var infowindow = new google.maps.InfoWindow({
              content: '<h4 class="info-name">' + places[id].name + '</h4>'
                       + '<address style="color: black;">' + places[id].address + '</address>',
          });
          (function(marker, infowindow){
              marker.addListener('click', function(){
                  for (var iid in infowindows) {
                      infowindows[iid].close();
                  }
                  marker.setAnimation(google.maps.Animation.BOUNCE);
                  infowindow.open(map, marker);
                  setTimeout(function(){ marker.setAnimation(null); }, 750);
              });
          })(marker, infowindow);
          markers[id] = marker;
          infowindows[id] = infowindow;
          get4SInfo(places[id]);
          console.log(places[id].name)
      }
  }

  this.createMarkers();
  this.filterPlaces();
};

function get4SInfo(place){
  $.ajax({
    url: foursquare_url + place.foursquare_id,
    type: "GET",
    data: {
        client_id: foursquare_client_id,
        client_secret: foursquare_client_secret,
        v: foursquare_version,
        query: place.name,
        ll: place.location.lat.toString() + "," + place.location.lng.toString()
    },
    success: function(data){
        // Icon for 4S downloaded from www.iconarchive.com
        console.log(place.name, data["response"]["venue"]["canonicalUrl"]);
        var fs_url =  data["response"]["venue"]["canonicalUrl"];
        var infowindowContent = '<h4 class="info-name">' + place.name + '</h4>'
                 + '<address style="color: black;">' + place.address + '</address>'
                 + '<a target="_blank" class="forsquare-url" href="' + fs_url
                 + '"><img width="30px" style="padding:5px;" src="static/img/Foursquare-5-icon.png"></a>';
        infowindows[place.id].setContent(infowindowContent);
    },
    fail: function(){
        console.log("Checking data for ", place.name, "failed.");
        var infowindowContent = '<h4 class="info-name">' + place.name + '</h4>'
                 + '<address style="color: black;">' + place.address + '</address>'
                 + '<span class="fs-error">Failed to load 4S info.<span>';
        infowindows[place.id].setContent(infowindowContent);
    }
  })
}

// MAP INITIALIZATION
function init() {
    var styles = [  
        {  
           "featureType":"administrative",
           "elementType":"all",
           "stylers":[  
              {  
                 "visibility":"on"
              },
              {  
                 "lightness":33
              }
           ]
        },
        {  
           "featureType":"landscape",
           "elementType":"all",
           "stylers":[  
              {  
                 "color":"#f2e5d4"
              }
           ]
        },
        {  
           "featureType":"poi.park",
           "elementType":"geometry",
           "stylers":[  
              {  
                 "color":"#c5dac6"
              }
           ]
        },
        {  
           "featureType":"poi.park",
           "elementType":"labels",
           "stylers":[  
              {  
                 "visibility":"on"
              },
              {  
                 "lightness":20
              }
           ]
        },
        {  
           "featureType":"road",
           "elementType":"all",
           "stylers":[  
              {  
                 "lightness":20
              }
           ]
        },
        {  
           "featureType":"road.highway",
           "elementType":"geometry",
           "stylers":[  
              {  
                 "color":"#c5c6c6"
              }
           ]
        },
        {  
           "featureType":"road.arterial",
           "elementType":"geometry",
           "stylers":[  
              {  
                 "color":"#e4d7c6"
              }
           ]
        },
        {  
           "featureType":"road.local",
           "elementType":"geometry",
           "stylers":[  
              {  
                 "color":"#fbfaf7"
              }
           ]
        },
        {  
           "featureType":"water",
           "elementType":"all",
           "stylers":[  
              {  
                 "visibility":"on"
              },
              {  
                 "color":"#acbcc9"
              }
           ]
        }
    ];
  map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 47.567605, lng: 7.612194},
      zoom: 13,
      styles: styles,
  });
  ko.applyBindings(new PlacesViewModel());
}
