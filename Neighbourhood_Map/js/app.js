'use strict';
//Making array of My location locations
var myLocations = [
	{
		places: 'Elante Mall',
		lat: 30.7061692,
		long: 76.800663
	},
	{
		places: 'Pvr Centra',
		lat: 30.7067345,
		long: 76.7939739
	},
	{
		places: 'Fun Republic',
		lat: 30.712325,
		long: 76.8427193
	},
	{
		places: 'DLF City Centre Mall',
		lat: 30.7288669,
		long: 76.8432539
	},
	{
		places: 'Piccadly Square Mall',
		lat: 30.7235273,
		long: 76.7652874
	}

];

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Declaring Variables.
var map;
var myClient;
var MySecret;

var Location = function(data){
	var self = this;
	this.places = data.places;
	this.lat = data.lat;
	this.long = data.long;
   	 this.street = "";
    	this.city = "";
	this.visible = ko.observable(true);

	var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll='+ this.lat + ','
	+ this.long + '&client_id=' + myClient + '&client_secret=' + MySecret + '&v=20160118' + '&query=' + this.places;
	
	$.getJSON(foursquareURL).done(function(data) {
		var results = data.response.venues[0];
		self.URL = results.url;
		if (typeof self.URL === 'undefined'){
			self.URL = "Not available";
		}
		self.street = results.location.formattedAddress[0];
		if(typeof self.street === 'undefined'){
			self.street = "street not available";
		}
     	self.city = results.location.formattedAddress[1];
			if(typeof self.city === 'undefined'){
				self.city = "City Not available";
			}
	}).fail(function() {
		alert("Could not load. Please try again");
	});


	this.infoWindow = new google.maps.InfoWindow({content: self.contentString});

    
	this.marker = new google.maps.Marker({
			position: new google.maps.LatLng(data.lat, data.long),
			map: map,
			title: data.places,
     
	});

	this.showMarker = ko.computed(function() {
		if(this.visible() === true) {
			this.marker.setMap(map);
		} else {
			this.marker.setMap(null);
		}
		return true;
	}, this);

	this.marker.addListener('click', function(){
		self.contentString = '<div class="info-window-content"><div class="title"><b>' + data.places + "</b></div>" +
         '<div><a href="' + self.URL +'">' + self.URL + "</a></div>" +
        '<div>' + self.street + "</div>" +
        '<div>' + self.city + "</div>" ;

        self.infoWindow.setContent(self.contentString);
	self.infoWindow.open(map, this);
	self.marker.setAnimation(google.maps.Animation.BOUNCE);
      	setTimeout(function() {
      		self.marker.setAnimation(null);
     	}, 800);
	setTimeout(function(){
				self.infoWindow.close(map,this);
				},1000);}
			       );
	this.bounce = function(place) {
		google.maps.event.trigger(self.marker, 'click');
	};
};

function Index() {
	var self = this;

	this.searchTerm = ko.observable("");

	this.locationList = ko.observableArray([]);

	map = new google.maps.Map(document.getElementById('map'), {
			zoom: 12,
			center: {lat: 30.74496, lng: 76.8076833},
           styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            }
        ]
	});
	// Foursquare API settings
	myClient = "WARFJCOVE1HJJT0TP34W5KEYAXW4DEGEYNG3D1O3IBLZXYXT";
	MySecret = "D5D4KQBXUAZS5NJW3LJCMUVDEWKSZYXXLAPNMFV55XQXLEU4";

	myLocations.forEach(function(locationItem){
		self.locationList.push( new Location(locationItem));
	});

	this.filteredList = ko.computed( function() {
		var filter = self.searchTerm().toLowerCase();
		if (!filter) {
			self.locationList().forEach(function(locationItem){
				locationItem.visible(true);
			});
			return self.locationList();
		} else {
			return ko.utils.arrayFilter(self.locationList(), function(locationItem) {
				var string = locationItem.places.toLowerCase();
				var result = (string.search(filter) >= 0);
				locationItem.visible(result);
				return result;
			});
		}
	}, self);

	this.mapElem = document.getElementById('map');
}

////////////////////////////////////////////////////////////////////////////////////////////

function First() {
	ko.applyBindings(new Index());
}

function unabletoLoad() {
	alert("Unable to reload App please check Internet connection.");
}

$(".button-collapse").sideNav();
