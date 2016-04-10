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

$(document).ready(function() {
	
	var uluru = {lat: -25.363, lng: 131.044};
	
    var map = $('#map')
      .gmap3({
        zoom: 4,
        center: uluru
      });
	  
      map.cluster({
          size: 200,
          cb: function (markers) {
            if (markers.length > 1) { // 1 marker stay unchanged (because cb returns nothing)
              if (markers.length < 20) {
                return {
                  content: "<div class='cluster cluster-1'>" + markers.length + "</div>",
                  x: -26,
                  y: -26
                };
              }
              if (markers.length < 50) {
                return {
                  content: "<div class='cluster cluster-2'>" + markers.length + "</div>",
                  x: -26,
                  y: -26
                };
              }
              return {
                content: "<div class='cluster cluster-3'>" + markers.length + "</div>",
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
      }).then(function(cluster) {
			addMarker(map, cluster, {
				position: uluru
			}, "<div class='infowindow request'>text1</div>");
			addMarker(map, cluster, {
				position: {lat: 48.8620722, lng: 2.352047}
			}, "<div class='infowindow teach'>text2</div>");
			addMarker(map, cluster, {
				position: {lat: 44.28952958093682, lng: 6.152559438984804}
			}, "text3");
			addMarker(map, cluster, {
				position: {lat: 49.28952958093682, lng: -1.1501188139848408}
			}, "text4");
			addMarker(map, cluster, {
				position: {lat: 44.28952958093682, lng: -1.1501188139848408}
			}, "text5");
	  });
	 
	setInterval(function() {
		setInfoWindow("request");
		setInfoWindow("teach");
	}, 100);
	 
	var socket = io();
});