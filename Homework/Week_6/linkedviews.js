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
                var data = [];
                data.push((d.Average_life_exp/10).toFixed(2), d.Average_wellbeing, d.Footprint);
                make_barchart(data);
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

          var margin = {top: 20, right: 20, bottom: 30, left: 20};
          var w = 300;
          var h = 100;

          var padding = 20;

          var colors = d3.scaleLinear()
                        .domain([0,data.length])
                        .range(['#77b7ea', '#705f7f']);

          var tooltip = d3.select("body").append("div")
                          .style('position','absolute')
                          .style('background', "rgba(0,0,0,0.6)")
                          .style('color', "#ffa500")
                          .style('border','1px #333 solid')
                          .style('padding', "6px")
                          .style('font-family', "sans-sherif")
                          .style('border-radius','3px');


          console.log(data)
          var barchart = d3.select("#chart").append("svg")
                           .attr("width", w + margin.right + margin.left)
                           .attr("height", h + margin.top + margin.bottom)
                           .append('g')
                           .attr('transform', 'translate('+margin.left+','+margin.top+')')
                           .selectAll("rect")
                            .data(data)
                            .enter()
                            .append("rect")
                            .attr("width", w / 3 - 2)
                            .attr("height", function(d){
                              return d * 8;
                            })
                            .attr("x", function(d, i) {
                              return i * (w / 3);
                            })
                            .attr("y", function(d){
                              return h - (d *8);
                            })
                            .attr("fill", function(d,i) {
                                return colors(i);
                            })
                            // set tooltip for barchart
                            .on('mouseover', function(d){
                              tooltip.transition()
                                .duration(200)
                                .style('opacity', 0.9)
                              tooltip.html(d)
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


                  d3.select("#chart")
                    .on("click", function() {

                      d3.select("#chart > *").remove();

                    })






        }

        };
        var LifebyCountry = {};
        HappyPlanet.forEach(function(d) { LifebyCountry[d.name] = +d.Average_life_exp; });
        data.features.forEach(function(d) { d.Average_life_exp = LifebyCountry[d.properties.name]});
        console.log(data);







        // var xScale =  d3.scaleBand()
        //   .domain(d3.range(0, 177))
        //   .range([0, width])
        //
        // var yScale = d3.scaleLinear()
        //   .domain([0, 100])
        //   .range([0, height]);
        //
        // var colors = d3.scaleLinear()
        //   .domain([0,177])
        //   .range(['#77b7ea', '#705f7f'])


        // var barchart = d3.select("#chart").append("svg")
        //                  .attr("width", width)
        //                  .attr("height", height)
        //                  .append('g')
        //                  .attr('transform', 'translate('+margin.left+','+margin.top+')')
        //                  .selectAll('rect')
        //                  .style('fill', function(d, i){
        //                    return colors(i);
        //                  })
        //                  .data(Object.values(LifebyCountry))
        //                  .enter().append('rect')
        //                  .attr('width', xScale.bandwidth())
        //                  .attr('height', function(d){
        //                    return yScale(d);
        //                  })
        //                  .attr('x', function(d, i){
        //                    return xScale(i);
        //                  })
        //                  .attr('y', function(d){
        //                    return yScale(d)
        //                  });







    }).catch(function(e){
        throw(e);
  });
};
