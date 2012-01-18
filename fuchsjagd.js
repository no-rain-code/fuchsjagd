// Target Object
function target(position, name) {
	this.name = name;
	this.position = position;
	this.bearing = 0;
	this.distance = 0;
	this.update = function(position) {
		this.bearing = calculateBearing(position, this.position);
		this.distance = calculateDistance(position, this.position);
	};
	this.getStrength = function(heading) {
		return calculateStrength(heading, this.bearing);
	};
	return true;
}

// Calculations
function calculateStrength(heading, bearing) {
  	var diff;
  	var strength = 0;
  	if (heading > bearing) {
  		diff = heading - bearing;
  	}else {
  		diff = bearing - heading;
  	}
  	if (diff > 180) {
  		diff = 360 - diff;
  	}
  	if (diff < 100) {
  		strength = 100 - diff;
  	}
  	strength = Math.pow(strength/100, 2)*100;
  	return strength;
}
      
function calculateDistance(position1, position2) {
  	var R = 6371; // km
	var lat1 = position1.coords.latitude;
	var lat2 = position2.coords.latitude;
	var lon1 = position1.coords.longitude;
	var lon2 = position2.coords.longitude;
	var dLat = convertDegreesToRadians(lat2-lat1);
	var dLon = convertDegreesToRadians(lon2-lon1); 
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(convertDegreesToRadians(lat1)) * Math.cos(convertDegreesToRadians(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;
	return d;
}
      
function calculateBearing(position1, position2) {
	var lat1 = position1.coords.latitude;
	var lat2 = position2.coords.latitude;
	var dLon = position1.coords.longitude - position2.coords.longitude;
	var y = Math.sin(dLon) * Math.cos(lat2);
	var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
	var brng = Math.atan2(y, x);		
	return (convertRadiansToDegrees(brng) + 360) % 360;
}
      
function convertDegreesToRadians(angle) {
	return Math.PI * angle / 180.0;
}

function convertRadiansToDegrees(angle) {
	return 180.0 * angle / Math.PI;
}

var contentString;

// Error handling
function onError() {
	clearTimeout(t);
	clearView();
	$('#space').css("lineHeight","4");
	if (navigator.geolocation) {
		contentString = "Error: The Geolocation service failed.";
	} else {
		contentString = "Error: Your Phone doesn't support geolocation. Are you in Siberia?";
	}
	divError.html(contentString);
}
	  

function onErrorHeading() {
	clearTimeout(t);
	clearView();
	$('#space').css("lineHeight","4");
    if (navigator.compass) {
    	contentString = "Error: The compass service failed.";
	} else {
		contentString = "Error: Your Phone doesn't support compass. Are you heading North?";
	}
	divError.html(contentString);
}

function onErrorLoading() {
	clearTimeout(t);
	clearView();
	$('#space').css("lineHeight","4");
	contentString = "Error: Connection to Fuchsjagd Backend failed.";
	divError.html(contentString);
}

function makeTarget(name) {
	return "<div class='meter-wrap'><div id=" + name + " class='meter-value' style='background-color: #0a0; width: 0%;'><div id='" + name + "text' class='meter-text'>"+ name + "</div></div></div><div class='betweenTargets'>&nbsp;</div>";
}

function makeCompass() {
	return "<img id='needle' class='needle' src='img/compass-pin.png'/>";
}