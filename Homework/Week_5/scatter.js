// Matty Vermet, 11320524
// Minor Programeren 2018
// Dataprocessing

window.onload = function() {

  console.log('Yes, you can!')
  var consumer_confidence = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"
  var women_science = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
  var requests = [d3.json(consumer_confidence), d3.json(women_science)];
  var pdata = [];
  var pdata07 = [];
  var pdata09 = [];
  var pdata11 = [];
  var pdata13 = [];
  var pdata15 = [];

  Promise.all(requests).then(function(response) {
      mydata = response;
      console.log(mydata);

      // extract data from datafile
      for (i=0; i <= 8; i+=2){
        pdata.push([
          "france",
          2007 + i,
          mydata[0].dataSets[0].series["0:0:0"].observations[i][0],
          mydata[1].dataSets[0].series["0:0"].observations[i][0].toFixed(2)
        ]);
        pdata.push([
          "netherlands",
          2007 + i,
          mydata[0].dataSets[0].series["1:0:0"].observations[i][0],
          mydata[1].dataSets[0].series["0:1"].observations[i][0].toFixed(2)
        ]);
        pdata.push([
          "portugal",
          2007 + i,
          mydata[0].dataSets[0].series["2:0:0"].observations[i][0],
          mydata[1].dataSets[0].series["0:2"].observations[i][0].toFixed(2)
        ]);
        pdata.push([
          "germany",
          2007 + i,
          mydata[0].dataSets[0].series["3:0:0"].observations[i][0],
          mydata[1].dataSets[0].series["0:3"].observations[i][0].toFixed(2)
        ]);
        pdata.push([
          "uk",
          2007 + i,
          mydata[0].dataSets[0].series["4:0:0"].observations[i][0],
          mydata[1].dataSets[0].series["0:4"].observations[i][0].toFixed(2)
        ]);
        pdata.push([
          "korea",
          2007 + i,
          mydata[0].dataSets[0].series["5:0:0"].observations[i][0],
          mydata[1].dataSets[0].series["0:5"].observations[i][0].toFixed(2)
        ]);
      };

      // store data of each year in different list
      for (var j=0; j<pdata.length; j++){
        if (pdata[j][1] === 2007){
          pdata07.push(pdata[j]);
        }
        if (pdata[j][1] === 2009){
          pdata09.push(pdata[j]);
        }
        if (pdata[j][1] === 2011){
          pdata11.push(pdata[j]);
        }
        if (pdata[j][1] === 2013){
          pdata13.push(pdata[j]);
        }
        if (pdata[j][1] === 2015){
          pdata15.push(pdata[j]);
        }
      }

      // set display margins
      var margin = {
        top: 30,
        right: 30,
        bottom: 40,
        left: 50
      }

      // set height and width of chart
      var h = 500 - margin.top - margin.bottom;
      var w = 600 - margin.right - margin.left;
      var padding = 30;

      // create new svg
      var svg = d3.select("body")
                  .append("svg")
                  .attr("width", 600+padding)
                  .attr("height", 500+padding);

      // set scales for plot
      var xScale = d3.scaleLinear()
                     .domain(d3.extent(pdata07, function(d) {return d[3]}))
                     .range([padding, w - padding]);

      var yScale = d3.scaleLinear()
                     .domain([97, d3.max(pdata07, function(d) {return d[2];})])
                     .range([h+padding, padding]);

      // set colors for circles
      var colorValue = d => d[0];
      var colorLabel = 'Countries';
      var colorScale = d3.scaleOrdinal()
                         .range(d3.schemeCategory10);

      // create tooltip
      var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      // add circles to svg to make scatterplot
      var myChart = svg.selectAll("circle")
         .data(pdata07)
         .enter()
         .append("circle")
         .attr('transform', 'translate('+margin.left+','+margin.top+')')
         .attr('fill', d => colorScale(colorValue(d)))
         .attr('fill-opacity', 0.6 )
         .attr("cx", function(d){
           return xScale(d[3]);
         })
         .attr("cy", function(d){
           return yScale(d[2]);
         })
         .attr("r", 20)

         // set tooltip settings/attributes
         .on('mouseover', function(d){
           tooltip.transition()
             .duration(200)
             .style('opacity', 0.9)
           tooltip.html(d[3] + "<br/>" + d[2])
             .style('left', (d3.event.pageX)+'px')
             .style('top', (d3.event.pageY - 28)+'px')
           d3.select(this).style('opacity', 0.5)
         })
         .on('mouseout', function(d){
           tooltip.transition()
             .duration(500)
             .style('opacity', 0)
           d3.select(this).style('opacity', 1)
         })

      // apply axis labels
      svg.append("text")
         .attr("class", "xtext")
         .attr("x",w/2 +20)
         .attr("y", h + margin.top + padding + 30)
         .attr("text-anchor", "middle")
         .attr("font-size", "13px")
         .attr("fill", "black")
         .text("Nr of women in science");

      svg.append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 0-5)
         .attr("x", -20-(h/2))
         .attr("dy","1em")
         .attr("font-size", "13px")
         .text("Consumer confidence index");

     // set scale of yaxis
     var vScale = d3.scaleLinear()
       .domain([97, d3.max(pdata07, function(d) {return d[2]; })])
       .range([h+padding, 0])
       .nice();

     // set yaxis values and scale
     var vAxis = d3.axisLeft()
       .scale(vScale)
       .ticks(10)
       .tickPadding(5)

     // apply styles to yaxis
     var vGuide = d3.select('svg')
       .append('g')
         vAxis(vGuide)
         vGuide.attr('transform', 'translate('+margin.left+','+margin.top+')')
         vGuide.selectAll('path')
           .style('fill', 'none')
           .style('stroke', '#999')
         vGuide.selectAll('line')
           .style('stroke', '#999');

     var hScale = d3.scaleBand()
       .domain(d3.extent(pdata07, function(d) { return d[3]}))
       .range([0, w]);

       // set xaxis values and scale
       var hAxis = d3.axisBottom(hScale);

       // apply styles to xaxis
       var hGuide = d3.select('svg')
         .append('g')
           hAxis(hGuide)
           hGuide.attr('transform', 'translate('+margin.left+','+(h+margin.top +padding)+')')
           hGuide.selectAll('path')
             .style('fill', 'none')
             .style('stroke', '#999')
           hGuide.selectAll('line')
             .style('stroke', '#999');



        // Change dataset looking at years
        d3.selectAll(".m")
          .on("click", function() {
            var date = this.getAttribute("value");

            // if matching year is clicked on, change dataset
            var dataset;
            if (date == "2007"){
              dataset = pdata07;
            }else if (date == "2009"){
              dataset = pdata09;
            }else if (date == "2011"){
              dataset = pdata11;
            }else if (date == "2013"){
              dataset = pdata13;
            }else if (date == "2015"){
              dataset = pdata15;
            }

            // Change scales for new dataset
            xScale.domain(d3.extent(dataset, function(d) {return d[3]}))
            .range([padding, w - padding]);
            yScale.domain([97, d3.max(dataset, function(d) {return d[2];})])
            .range([h+padding, padding]);
            hScale.domain(d3.extent(dataset, function(d) { return d[3]}))
              .range([0, w]);
            vScale.domain([97, d3.max(dataset, function(d) {return d[2]; })])
              .range([h+padding, 0])
              .nice();

            // change axis
            hAxis.scale(hScale);
            vAxis.scale(vScale)
              .ticks(10)
              .tickPadding(5);

            // select chart enter new circles
            myChart = svg.selectAll("circle")
                        .data(dataset)
            myChart.enter()
            .append("circle")
            .attr('fill', d => colorScale(colorValue(d)))
            .attr('fill-opacity', 0.6 )
            .attr("r", 9);

            // make transition to new circles
            myChart.transition()
                   .duration(700)
                   .ease(d3.easeLinear)
                   .attr("cx", function(d){
                     return xScale(d[3]);
                   })
                   .attr("cy", function(d){
                     return yScale(d[2]);
                   })
                   .attr('fill-opacity', 0.6);

            // exit old circles
            myChart.exit()
                   .transition()
                   .duration(700)
                   .ease(d3.easeCircleIn)
                   .attr("cx", w)
                   .remove();
                 });

  }).catch(function(e){
      throw(e);
  });
};
