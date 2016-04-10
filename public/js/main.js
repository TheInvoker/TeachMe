$(document).ready(function() {
	
	var uluru = {lat: -25.363, lng: 131.044};
    var map = $('#map')
      .gmap3({
        zoom: 4,
        center: uluru
      });
	  
      map.marker({
        position: uluru
      })
      .infowindow({
        content: "text"
      })
      .then(function (infowindow) {
        var map = this.get(0);
        var marker = this.get(1);
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
      });
	  
      map.cluster({
          size: 200,
          markers: [
            {position: [48.8620722, 2.352047]},
            {position: [44.28952958093682, 6.152559438984804], icon: "http://maps.google.com/mapfiles/marker_green.png"},
            {position: [49.28952958093682, -1.1501188139848408]},
            {position: [44.28952958093682, -1.1501188139848408]}
          ],
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
            }
          }
      });
	  
	  
	  
	var socket = io();
});