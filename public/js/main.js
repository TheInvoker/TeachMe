var LOC_LIST = [];
var SB_LIST = [];

function addMarker(map, cluster, marker, content, markerCB) {
	map.marker(marker).then(function(marker) {
		markerCB(marker);
		if (content != null) {
			map.infowindow({
				'content' : content,
				'disableAutoPan' : true
			})
			.then(function (infowindow) {
				var map = this.get(0);
				marker.addListener('click', function(event, data) {
					infowindow.open(map, this);
				});
				marker["custom"] = {
					'map' : map,
					'infowindow' : infowindow
				};
			});
		}
		
		cluster.add(marker);
	});
}

function setInfoWindow(name) {
	var items = $("." + name + ".infowindow");
	items.each(function(i,x) {
		var parent = $(x).parent().parent().parent().prev().find("div").last();
		if (!parent.hasClass(name)) {
			parent.addClass(name);
		}	
	});
}

function cluster(map, class1, class2, class3, clusterCallback) {
	map.cluster({
		size: 200,
		cb: function (markers) {
		if (markers.length > 1) { // 1 marker stay unchanged (because cb returns nothing)
		  if (markers.length < 20) {
			return {
			  content: "<div class='cluster " + class1 + "'>" + markers.length + "</div>",
			  x: -26,
			  y: -26
			};
		  }
		  if (markers.length < 50) {
			return {
			  content: "<div class='cluster " + class2 + "'>" + markers.length + "</div>",
			  x: -26,
			  y: -26
			};
		  }
		  return {
			content: "<div class='cluster " + class3 + "'>" + markers.length + "</div>",
			x: -33,
			y: -33
		  };
		} else if (markers.length == 1) {
			var marker = markers[0];
			if ("custom" in marker) {
				var data = marker["custom"];
				var iw = data["infowindow"];
				var map = data["map"];
				iw.open(map, marker);
			}
		}
	  }
	}).then(clusterCallback);
}



function initMap() {

	getCurrentLocation(function(position) {
		
		var map = $('#map')
		  .gmap3({
			zoom: 13,
			center: position
		  });
		  
		
		var a = function(cluster) {
			for(var i=0; i<LOC_LIST.length; i+=1) {
				cluster.remove(LOC_LIST[i]);
				LOC_LIST[i].setMap(null);
			}
			LOC_LIST = [];
			
			getCurrentLocation(function(position) {
				getLocations(position, function(data) {
					if (data.status == 'ok') {
						var array = data.data;
						for(var i=0; i<array.length; i+=1) {
							addMarker(map, cluster, {
								position: array[i].pos
							}, "<div class='infowindow " + array[i].type + "'>" + array[i].text + "</div>", function(marker) {
								LOC_LIST.push(marker);
							});
						}
					}
				});
			});
		};
		cluster(map, "cluster-1", "cluster-2", "cluster-3", function(cluster) {
			a(cluster);
			setInterval(a, 60 * 1000, cluster);
		});

		var b = function(cluster) {
			for(var i=0; i<SB_LIST.length; i+=1) {
				cluster.remove(SB_LIST[i]);
				SB_LIST[i].setMap(null);
			}
			SB_LIST = [];
			
			$.ajax({
				type: 'GET',
				url: 'https://openapi.starbucks.com/location/v1/stores?radius=10&limit=50&brandCode=SBUX&latLng=' + position.lat + '%2C' + position.lng + '&apikey=7b35m595vccu6spuuzu2rjh4',
				dataType: 'json',
				headers: {
					'Accept': 'application/json'
				},
				success: function(storesData) {
					var array = storesData.items;
					for(var i=0; i<array.length; i+=1) {
						var pos = array[i].store.coordinates;
						addMarker(map, cluster, {
							position: {'lat' : pos.latitude, 'lng':pos.longitude},
							icon : "image/starbucks.png"
						}, null, function(marker) {
							SB_LIST.push(marker);
						});
					}
				},
				error:function(jqXHR, textStatus, errorThrown){
					alert("error");
				}
			});
		};
		cluster(map, "cluster-1", "cluster-2", "cluster-3", function(cluster) {
			b(cluster);
			setInterval(b, 60 * 1000, cluster);
		});

		setInterval(function() {
			setInfoWindow("request");
			setInfoWindow("teach");
		}, 100);
	
	});
}

function getLocations(position, callback) {
	$.ajax({
		type: 'POST',
		url: 'getlocations',
		dataType: 'json',
		data: position,
		beforeSend:function(){

		},
		success:function(data){
			callback(data);
		},
		error:function(jqXHR, textStatus, errorThrown){
			alert("error");
		}
	});
}

function getCurrentLocation(callback) {
	var defLocation = {'lat': 43.6532, 'lng': 79.3832};
	
	if ( navigator.geolocation ) {

		// Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
		navigator.geolocation.getCurrentPosition(function (pos) {

			callback({'lat':pos.coords.latitude, 'lng':pos.coords.longitude});
			
		}, function (error) {
			
			callback(defLocation);
			
			switch(error.code) {
				case error.PERMISSION_DENIED:
					alert("Could not get your location. User denied the request for Geolocation.");
					break;
				case error.POSITION_UNAVAILABLE:
					alert("Could not get your location. Location information is unavailable.");
					break;
				case error.TIMEOUT:
					alert("Could not get your location. The request to get user location timed out.");
					break;
				case error.UNKNOWN_ERROR:
					alert("Could not get your location. An unknown error occurred.");
					break;
				default:
					alert("Could not get your location. An unknown error occurred.");
			}
		}, {
			maximumAge: 500000, 
			enableHighAccuracy:true, 
			timeout: 12000
		});
	} else {
		callback(defLocation);
	}
}

$(document).ready(function() {
	var socket = io();
	initMap();
});