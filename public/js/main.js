function addMarker(map, cluster, marker, content) {
	map.marker(marker).then(function(marker) {
		map.infowindow({
			'content' : content
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
		
		cluster.add(marker);
	});
}

function setInfoWindow(name) {
	var items = $("." + name + ".infowindow");
	if (items.length > 0) {
		var parents = items.parent().parent().parent().prev().find("div").last();
		if (!parents.hasClass(name)) {
			parents.addClass(name);
		}
	}
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

var LOC_CLUSTER = null;

function initMap(position) {

    var map = $('#map')
      .gmap3({
        zoom: 13,
        center: position
      });
	  
	  
	  
	var getLoc = function() {
		// TODO remove this cluster
		if (LOC_CLUSTER) {
			
		}
		cluster(map, "cluster-1", "cluster-2", "cluster-3", function(cluster) {
			LOC_CLUSTER = cluster;
			getLocations(position, function(data) {
				if (data.status == 'ok') {
					var array = data.data;
					for(var i=0; i<array.length; i+=1) {
						addMarker(map, cluster, {
							position: array[i].pos
						}, "<div class='infowindow " + array[1].type + "'>" + array[1].text + "</div>");
					}
				}
			});
		});
	};
	setInterval(function() {
		getLoc();
	}, 1000*60);
	getLoc();
	
	
	
	 
	setInterval(function() {
		setInfoWindow("request");
		setInfoWindow("teach");
	}, 100);
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

$(document).ready(function() {
	var socket = io();
	
	var defLocation = {'lat': 43.6532, 'lng': 79.3832};
	
	if ( navigator.geolocation ) {

		// Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
		navigator.geolocation.getCurrentPosition(function (pos) {

			initMap({'lat':pos.coords.latitude, 'lng':pos.coords.longitude});

		}, function (error) {
			
			initMap(defLocation);
			
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
			timeout: 6000
		});
	} else {
		initMap(defLocation);
	}
});