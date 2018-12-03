// Matty Vermet, 11320524
window.onload = function() {

  console.log('Yes, you can!')
  var consumer_confidence = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"
  var women_science = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
  var requests = [d3.json(consumer_confidence), d3.json(women_science)];
  var pdata = [];

  Promise.all(requests).then(function(response) {
      mydata = response;
      console.log(mydata);
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

      console.log(pdata);

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

      var svg = d3.select("body")
                  .append("svg")
                  .attr("width", 600+padding)
                  .attr("height", 500+padding);

      var xScale = d3.scaleLinear()
                     .domain(d3.extent(pdata, function(d) {return d[1]}))
                     .range([padding, w - padding]);

      var yScale = d3.scaleLinear()
                     .domain([97, d3.max(pdata, function(d) {return d[2];})])
                     .range([h+padding, padding]);

      var rScale = d3.scaleLinear()
                     .domain([0, d3.max(pdata, function(d) {return d[2]; })])
                     .range([2,5]);

      var colorValue = d => d[0];
      var colorLabel = 'Countries';
      var colorScale = d3.scaleOrdinal()
                         .range(d3.schemeCategory10);

      // bl.ocks.org/anonymous/7a65777a1e310b76aca5d499e967c467

      var myChart = svg.selectAll("circle")
         .data(pdata)
         .enter()
         .append("circle")
         .attr('transform', 'translate('+margin.left+','+margin.top+')')
         .attr('fill', d => colorScale(colorValue(d)))
         //.attr("data-legend",function(d) { return d[0]})
         .attr('fill-opacity', 0.6 )
         .attr("cx", function(d){
           return xScale(d[1]);
         })
         .attr("cy", function(d){
           return yScale(d[2]);
         })
         .attr("r", 9);


      svg.selectAll("text")
         .data(pdata)
         .enter()
         .append("text")
         .attr('transform', 'translate('+margin.left+','+margin.top+')')
         .text(function(d){
           return d[2];
         })
         .attr("x", function(d) {
           return xScale(d[1]);
         })
         .attr("y", function(d) {
           return yScale(d[2]);
         })
         .attr("font-size", "11px")
         .attr("fill", "black");



     // set scale of yaxis
     var vScale = d3.scaleLinear()
       .domain([97, d3.max(pdata, function(d) {return d[2]; })])
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
       .domain(d3.range(2007, 2016))
       .range([0, w]);

       // set xaxis values and scale
       var hAxis = d3.axisBottom()
         .scale(hScale)
         .tickValues(hScale.domain().filter(function(d, i){
           return !(i % 1);
         }));

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






  }).catch(function(e){
      throw(e);
  });
};
