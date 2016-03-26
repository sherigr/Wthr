
// get hour of day for greeting
function greeting() {
	var now = new Date();
	var currentHr = now.getHours();
	if (currentHr < 12) {
		// return "good morning";
		$('.greeting h2').append('morning');
	}
	else if (currentHr >= 12 && currentHr < 18) {
		// return "good afternoon"
		$('.greeting h2').append('afternoon');
	}
	else {
	// return "good evening"
	$('.greeting h2').append('evening');	
	}
}
greeting();


// delay prompt to enter location
function locationPrompt() {
		setTimeout(function() { $('.location-prompt').fadeIn(1500) }, 1500);
}
locationPrompt();

function form() {
	setTimeout(function() { $('#location').fadeIn( 2000) }, 2000);
}
form();

setTimeout(function() { $('#footer').fadeIn( 4000 ) }, 2000);

// Current Weather Condition Comment
function clearWeather() {
	var clear = ["The future's so bright, you gotta wear shades",
	"Break out those sunglasses, you're going to need them today",
	"Here comes the sun dooh dooh dooh dooh"
	];
	var clearComment = (Math.floor(Math.random()*clear.length));
	return clear[clearComment];
}

function rainyWeather() {
	var rainyComments = ["Aww, bad hair day today!",
	"Break out the umbrella today",
	"Watch out for those nasty puddles!"
	];
	 var rainComment = (Math.floor(Math.random()*rainyComments.length));
	 return rainyComments[rainComment];
}

function cloudyWeather() {
	var cloudyComments = ["It's cloudy but no chance of Meatballs",
	"Look at the bright side, no sun glare to contend with",
	"Maybe the sun will come out tomorrow? Then again, it might not."
	];
	var cloudy = (Math.floor(Math.random()*cloudyComments.length));
	return cloudyComments[cloudy];
}

function snowCondition() {
	var snowComments = ["Well, at least it's not rain",
	"Wait, what? Snow?!",
	"Warm up that arm...SNOWBALL FIGHT in the forecast!"
	];
	var snow = (Math.floor(Math.random()*snowComments.length));
	return snowComments[snow];
}

function windyCondtion() {
	var windComments = ["Hang on tight, the wind is kicking up",
		"Aarg, the wind makes for a bad hair day",
		"THe answer is blowing in the wind"
	];
	var wind = (Math.floor(Math.random()*windComments.length));
	return windComments[wind];
}

function partlyCloudy() {
	var pcComments = ["Partly cloudy but partly clear",
	'Partly cloudy...like the glass is half empty. Or is it half full?',
	'Not a bad weather day today'
	];
	var pcComment = (Math.floor(Math.random()*pcComments.length));
	return pcComments[pcComment];
}
function evening() {
	var nightComments = ["It's dark out, does it matter if there are clouds?",
	"See any stars out there?", "Another day nearly over"
	];
	var nightComment = (Math.floor(Math.random()*nightComments.length));
	return nightComments[nightComment];
}

$(function() {

	// check user doesn't enter valid search
	var correctInfo = true;
		
	$('#location').on('submit', function(e) {
		e.preventDefault();
		var location = $('#search-location').val();
		$('#home-gif').hide();
		$('.location-prompt').hide();
		$('.another-location').text("Search another location?").fadeIn(1500);
		$('.greeting').hide();
		// clear form after location entered
		$('#search-location').val('');


		$.ajax({ 
			
				url: 'http://api.wunderground.com/api/[API KEY]/conditions/forecast/astronomy/q/US/' + location + '.json',
				dataType: 'jsonp',

				success: function(data) {
					if(!data.current_observation) {
						// alert('Please enter city,st OR zip');
						$('.another-location').text("please enter valid info");
						return null;
					} 
					var fullLocation = data.current_observation.display_location.full;
					// var zip = data.current_observation.display_location.zip;
					var currentCondition = data.current_observation.weather;
					var currentTemp = Math.round(data.current_observation.temp_f);
					var feelsLike = Math.round(data.current_observation.feelslike_f);
					var forecastedHigh = data.forecast.simpleforecast.forecastday[0].high.fahrenheit;
					var forecastedLow = data.forecast.simpleforecast.forecastday[0].low.fahrenheit;
					var imgUrl = data.current_observation.icon_url;
					var sunRiseHr = data.sun_phase.sunrise.hour;
					var sunRiseMin = data.sun_phase.sunrise.minute;
					var sunsetHr = data.sun_phase.sunset.hour;
					var sunsetMin = data.sun_phase.sunset.minute;
					var day = data.forecast.simpleforecast.forecastday[0].date.weekday_short; 
					var month = data.forecast.simpleforecast.forecastday[0].date.monthname_short;
					var date = data.forecast.simpleforecast.forecastday[0].date.day;
					var year = data.forecast.simpleforecast.forecastday[0].date.year;
					var humidity = data.current_observation.relative_humidity;
					var windchill = data.current_observation.windchill_f;
					var precip = data.current_observation.precip_today_in;
					var uvIndex = data.current_observation.UV;
					// var windString = data.current_observation.wind_string;
					var windDir = data.current_observation.wind_dir;
					var windMph = data.current_observation.wind_mph;

					// slice hour from local time string, the 2 digits before first :
					var localHr = data.current_observation.local_time_rfc822;
					var hour = localHr.substr(localHr.indexOf(':') -2, 2);

									
					if(currentCondition === 'Rain' || currentCondition === 'Thunderstorms' || currentCondition === 'T-Storms' || currentCondition === "Thunderstorms and Rain") {
						weatherGif('cry')
					} else {
						weatherGif('dancing');
					}


					// change sunset from 24 hr time
					sunsetHr = sunsetHr - 12;

					// API returns 999 string when none or sometimes " "
					if(precip === "-999.00" || precip === "") {
						precip = 0;
					} 
					// change returned string to number and remove decimal
					precip = parseInt(precip).toFixed();
					uvIndex = parseInt(uvIndex).toFixed();

					// set background pictures based on current condition
					function weatherBackground() {
						if(currentCondition === "Rain" || currentCondition === "Drizzle" || currentCondition == 'Freezing Drizzle' || currentCondition === "Freezing Rain") {
							$('body').removeClass('home-background partly-cloudy clear cloudy t-storms snow night');
							$('body').addClass('rain');
							$('.weather-comment').html(rainyWeather());
						}
						else if(currentCondition === "Clear" || currentCondition === "Mostly Clear" || currentCondition === "Sun" || currentCondition === "Sunny" || currentCondition === "Mostly Sunny") {
							$('body').removeClass('home-background partly-cloudy rain cloudy t-storms snow night');
							$('body').addClass('clear');
							$('.weather-comment').html(clearWeather());
						}
						else if(currentCondition === "Mostly Cloudy" || currentCondition === "Cloudy" || currentCondition === "Overcast" || currentCondition === "Windy") {
							$('body').removeClass('home-background partly-cloudy rain clear t-storms snow night');
							$('body').addClass('cloudy');
							$('.weather-comment').html(cloudyWeather());
						}
						else if(currentCondition === "Thunderstorm" || currentCondition === "Thunderstorms and Rain") {
							$('body').removeClass('home-background partly-cloudy rain cloudy clear snow night');
							$('body').addClass('t-storms');
							$('.weather-comment').html(rainyWeather());
						}
						else if(currentCondition === "Snow" || currentCondition === "Blizzard" ) {
							$('body').removeClass('home-background partly-cloudy rain cloudy t-storms clear night');
							$('body').addClass('snow');
							$('.weather-comment').html(snowCondition());
						}
						//if hour of location searched is 6 or later
						else if(hour >= 18) {
							$('body').removeClass('home-background partly-cloudy rain cloudy t-storms snow clear');
							$('body').addClass('night');
							$('.weather-comment').html(evening());
							// $('.weather').css('color', '#E7EC31'); added to CSS
						}
						else {
							$('body').removeClass('home-background clear rain cloudy t-storms snow night');
							$('body').addClass('partly-cloudy');
							$('.weather-comment').html(partlyCloudy());
						}
					}
					weatherBackground();

					
					$('#today').text(day + " " + month + " " + date + ", " + year);
					$('#location-full').text(fullLocation);
					// $('#zip').text(zip);
					$('#currently').html(currentCondition + " " + currentTemp + "&deg; f");
					$('#feels-like').html("feels like: " + feelsLike + "&deg; f");
					$('#humidity').text("humidity: " + humidity);
					$('#forecasted-high').html("high&sol;low: " + "<span id='combined-forecast'>" + forecastedHigh +"&deg;" + '&sol;' + forecastedLow + "&deg;</span");
					$('#current-icon').attr('src', imgUrl);
					$('#sunrise').text("sunrise: " + sunRiseHr + ":" + sunRiseMin +"am");
					$('#sunset').text("sunset: " + sunsetHr + ":" + sunsetMin +"pm");
					if(windchill !== "NA") {
						$('#windchill').html("windchill: " + windchill + "&deg; f").show();
					} else {
						$('#windchill').hide();
					}
					$('#precip').text("precip: " + precip + " in");
					$('#uv-index').text("UV index: " + uvIndex);
					// $('#wind-string').text("wind: " + windString);
					$('#wind-string').text("wind: " + windDir + " " + windMph + "mph");
						
				}
				
		});
	});

	// Giphy Related
	var giphyApi = 'http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=';

	// gif on home page
	function homeGif() {
		var thumbsUp = 'thumbs+up';
		$.get(giphyApi + thumbsUp).done(function(gif) {
			var openingGif = gif.data.image_url;
			$('.opening-gif').attr('src', openingGif);
			setTimeout(function() { $('.opening-gif').addClass('shown-gif').fadeIn(2000) }, 3000);
		});
	}
	homeGif();

	// get weather gif based on current condition
	function weatherGif(str) {
		$.get(giphyApi + str).done(function(gif) {
			var responseGif = gif.data.image_url;
			$('.weather-gif').attr('src', responseGif);
		});
	}



});  
