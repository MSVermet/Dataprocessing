window.onload = function() {

  var happyplanet = "HappyPlanet.json"
  var data = "Worldmap/world_countries.json"
  var requests = [d3.json(happyplanet), d3.json(data)];

  Promise.all(requests).then(function(response) {
      var HappyPlanet = response[0];
      var data = response[1];

      var format = d3.format(",");

      // Set tooltips
      var tip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function(d) {
                    return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>HappyPlanet Index: </strong><span class='details'>" + format(d.HappyPlanetIndex) +"</span>";
                  })

      var margin = {top: 0, right: 0, bottom: 0, left: 50},
                  width = 960 - margin.left - margin.right,
                  height = 650 - margin.top - margin.bottom;
      var padding = 20;

      var color = d3.scaleThreshold()
          .domain([10,15,20,25,30,35,40,45,50,55])
          .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)"]);

      var path = d3.geoPath();

      var svg = d3.select("#map").append("svg")
                  .attr("width", width)
                  .attr("height", height)
                  .append('g')
                  .attr('class', 'map');

      var projection = d3.geoMercator()
                         .scale(130)
                        .translate( [width / 2, (height) / 1.5]);

      var path = d3.geoPath().projection(projection);
      var t = d3.transition()
                .duration(750);

      var click;

      svg.call(tip);
      ready(data, HappyPlanet);

      function ready( data, HappyPlanet) {
        var IndexbyCountry = {};
        var LifebyCountry = {};
        var WellbeingbyCountry = {};
        var FootprintbyCountry = {};
        var InequalitybyCountry = {};

        HappyPlanet.forEach(function(d) { IndexbyCountry[d.name] = +d.HappyPlanetIndex; });
        data.features.forEach(function(d) { d.HappyPlanetIndex = IndexbyCountry[d.properties.name] });
        HappyPlanet.forEach(function(d) { LifebyCountry[d.name] = +d.Average_life_exp; });
        data.features.forEach(function(d) { d.Average_life_exp = LifebyCountry[d.properties.name]});
        HappyPlanet.forEach(function(d) { WellbeingbyCountry[d.name] = +d.Average_wellbeing; });
        data.features.forEach(function(d) { d.Average_wellbeing = WellbeingbyCountry[d.properties.name]});
        HappyPlanet.forEach(function(d) { FootprintbyCountry[d.name] = +d.Footprint; });
        data.features.forEach(function(d) { d.Footprint = FootprintbyCountry[d.properties.name]});
        HappyPlanet.forEach(function(d) { InequalitybyCountry[d.name] = +d.Inequality_of_outcomes; });
        data.features.forEach(function(d) { d.Inequality_of_outcomes = InequalitybyCountry[d.properties.name]});


        svg.append("g")
            .attr("class", "countries")
          .selectAll("path")
            .data(data.features)
          .enter().append("path")
            .attr("d", path)
            .style("fill", function(d) { return color(IndexbyCountry[d.properties.name]); })
            .style('stroke', 'white')
            .style('stroke-width', 1.5)
            .style("opacity",0.8)
            // tooltips
              .style("stroke","white")
              .style('stroke-width', 0.3)
              .on("click", function(d){

                d3.select("#chart > *").remove();

                var data = [];
                data.push({name: d.properties.name, value: (d.Average_life_exp/10).toFixed(2)},{name: d.properties.name, value: d.Average_wellbeing},{name: d.properties.name, value: d.Footprint});

                // Look for countries without information
                if (d.Average_life_exp === undefined){
                  console.log("nope");
                  var empty = d3.select("#chart").append("svg")
                                   .attr("width", 200)
                                   .attr("height", 100);
                  empty.append("text")
                      .attr("x", 60)
                      .attr("y", 45)
                      .attr("text-anchor", "middle")
                      .style("font-family", "sans-sherif")
                      .style("font-size", "20px")
                      .style("font-weight", "bold")
                      .text(d.properties.name)
                  empty.append("text")
                       .attr("x", 10)
                       .attr("y", 70)
                       .style("font-size", "16px")
                       .style("font-weight", "bold")
                       .style("fill", "darkOrange")
                       .text("No information available")
                }
                else{make_barchart(data)};
               })

              .on('mouseover',function(d){
                tip.show(d);

                d3.select(this)
                  .style("opacity", 1)
                  .style("stroke","white")
                  .style("stroke-width",3);
              })
              .on('mouseout', function(d){
                tip.hide(d);

                d3.select(this)
                  .style("opacity", 0.8)
                  .style("stroke","white")
                  .style("stroke-width",0.3);
              });

        svg.append("path")
            .datum(topojson.mesh(data.features, function(a, b) { return a.name !== b.name; }))
             // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
            .attr("class", "names")
            .attr("d", path);



        function make_barchart(data){

          // set display margins
          var margin = {
            top: 20,
            right: 20,
            bottom: 100,
            left: 20
          }

          // set height and width of chart
          var h = 300 - margin.top - margin.bottom;
          var w = 250 - margin.right - margin.left;

          var padding = 20;

          var colors = d3.scaleLinear()
                        .domain([0, 3])
                        .range(['#FCC90A', '#D50000']);

          var tooltip = d3.select("body").append("div")
                          .style('position','absolute')
                          .style('background', "rgba(0,0,0,0.6)")
                          .style('color', "#ffa500")
                          .style('border','1px #333 solid')
                          .style('padding', "6px")
                          .style('font-family', "sans-sherif")
                          .style('border-radius','3px');

          // specify scales
          var yScale = d3.scaleLinear()
            .domain([0, 10])
            // .domain(d3.extent(data, function(d) {return d.value}))
            .range([h + margin.top, margin.top]);

          console.log(d3.extent(data, function(d) {return d.value}))

          var xScale =  d3.scaleBand()
            .domain(d3.range(0, 3))
            .range([margin.right, w])


          var barchart = d3.select("#chart").append("svg")
                           .attr("width", w + margin.right + margin.left)
                           .attr("height", h + margin.top + margin.bottom);

            barchart.append('g')
                     // .attr('transform', 'translate('+margin.left+','+margin.top+')')
                     .selectAll("rect")
                      .data(data)
                      .enter()
                      .append("rect")
                      .attr("width", w / 4 + 1)
                      .attr("height",function(d) { return h - yScale(d.value); })
                      .attr("x",function(d,i) { return xScale(i); })
                      .attr("y",function(d) { return yScale(d.value); })
                      .attr("fill", function(d,i) {
                          return colors(i);
                      })
                      .attr("fill-opacity", 0.7)
                      // set tooltip for barchart
                      .on('mouseover', function(d){
                        tooltip.transition()
                          .duration(200)
                          .style('opacity', 0.9)
                        tooltip.html(d.value)
                          .style('left', (d3.event.pageX)+'px')
                          .style('top', (d3.event.pageY+'px'))
                        d3.select(this).style('opacity', 0.5)
                      })
                      .on('mouseout', function(d){
                        tooltip.transition()
                          .duration(500)
                          .style('opacity', 0)
                        d3.select(this).style('opacity', 1)
                      });

              var hScale =  d3.scaleBand()
                .domain(["Life expectancy (x10)", "Wellbeing", "Footprint"])
                .range([margin.right, w])

              barchart.append("g")
              .attr("class", "axis")
              .attr("transform", "translate(0," + h + ")")
              .call(d3.axisBottom(hScale).ticks(3))
              .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)");

              barchart.append("text")
                    .data(data)
                    .attr("x", 60)
                    .attr("y", 35)
                    .attr("text-anchor", "middle")
                    .style("font-family", "sans-sherif")
                    .style("font-size", "20px")
                    .style("font-weight", "bold")
                    .text(function(d){
                      return d.name;
                    });
                  };

            //click on Visualisation load page again
            d3.selectAll(".m").on("click", function() {
              location.href = "linkedviews.html";
            });

            // make new html page
            d3.selectAll(".s").on("click", function () {
              location.href = "story.html";
        });

        }

    }).catch(function(e){
        throw(e);
  });
};
