window.onload = function() {

  var fileName = "HappyPlanet.json";
  var txtFile = new XMLHttpRequest();
  txtFile.onreadystatechange = function() {
      if (txtFile.readyState === 4 && txtFile.status == 200) {
          var mydata = JSON.parse(txtFile.responseText);
          console.log(mydata);
        }
  }

  txtFile.open("GET", fileName);
  txtFile.send(); {


    var map = new Datamap({element: document.getElementById('container')});

    d3.csv("DataHappyPlanet.csv", function(data){

        color.domain([ d3.min(data, function(d){ return d.HappyPlanetIndex; }),
          d3.max(data, function(d){ return d.HappyPlanetIndex; })
          ]);
        });

    d3.json("Worldmap/worldmap.json", function(json){
        //Merge the agriculture and GeoJSON data
        //Loop through once for each agriculture data value
        for(var i = 0; i < data.length; i++){
          // grab state name
          var dataCountry = data[i].Country;

          //grab data value, and convert from string to float
          var dataHappyPlanet= parseFloat(data[i].HappyPlanetIndex);

          //find the corresponding state inside the GeoJSON
          for(var n = 0; n < json.features.length; n++){

            // properties name gets the states name
            var jsonCountry = json.features[n].properties.name;
            // if statment to merge by name of state
            if(dataCountry == jsonCountry){
              //Copy the data value into the JSON
              // basically creating a new value column in JSON data
              json.features[n].properties.value = dataHappyPlanet;

              //stop looking through the JSON
              break;
            }
          }
        }};

      }};
