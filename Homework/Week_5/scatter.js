// Matty Vermet, 11320524
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
      // calculate mean of data
      x_mean = 0;
      y_mean = 0;
      for (var k=0; k<pdata07.length; k++){
        x_mean += parseFloat(pdata07[k][3]);
        y_mean += pdata07[k][2];
      }
      x_mean /= 6;
      y_mean /= 6;

      // calculate coefficients
      var xr = 0;
      var yr = 0;
      var term1 = 0;
      var term2 = 0;
      for (i=0; i<pdata07.length; i++){
        xr = parseFloat(pdata07[i][3]) - x_mean;
        yr = pdata07[i][2] - y_mean;
        term1 += xr * yr;
        term2 += xr * xr;
      }
      var b1 = term1 / term2;
      var b0 = y_mean - (b1 * x_mean);

      reg = [];
      for (i=0; i < pdata07.length; i++){
        reg.push(b0 + (pdata07[i][2] * b1));
      }

      for (i=0; i < reg.length; i++){
        pdata07[i].push(reg[i]);
      }

      console.log(pdata07);

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
                     .domain(d3.extent(pdata07, function(d) {return d[3]}))
                     .range([padding, w - padding]);

      var yScale = d3.scaleLinear()
                     .domain([97, d3.max(pdata07, function(d) {return d[2];})])
                     .range([h+padding, padding]);


      var colorValue = d => d[0];
      var colorLabel = 'Countries';
      var colorScale = d3.scaleOrdinal()
                         .range(d3.schemeCategory10);

      // bl.ocks.org/anonymous/7a65777a1e310b76aca5d499e967c467

      var myChart = svg.selectAll("circle")
         .data(pdata07)
         .enter()
         .append("circle")
         .attr('transform', 'translate('+margin.left+','+margin.top+')')
         .attr('fill', d => colorScale(colorValue(d)))
         //.attr("data-legend",function(d) { return d[0]})
         .attr('fill-opacity', 0.6 )
         .attr("cx", function(d){
           return xScale(d[3]);
         })
         .attr("cy", function(d){
           return yScale(d[2]);
         })
         .attr("r", 9);

     var x1Buffer = pdata07[0][4];
     var x2Buffer = pdata07[5][4];
     var y1Buffer = pdata07[0][3];
     var y2Buffer = pdata07[5][3];
     console.log(pdata07[0][4])
     console.log(pdata07[5][4])

     var line = svg.append("line")
         .attr("x1", parseFloat(x1Buffer) - padding)
         .attr("y1", padding + margin.top + (parseFloat(y1Buffer) * 1.6))
         .attr("x2", w + parseFloat(x2Buffer) - padding - margin.right)
         .attr("y2", padding + margin.top + (parseFloat(y2Buffer) * 1.6))
         .attr("stroke-width", 4)
         .attr("stroke", "lightgrey");


      // var regression = d3.line()
      //    .x(function(d) { return d[3]})
      //    .y(function(d) { return d[4]});
      //
      // xScale.domain(d3.extent(pdata07, function(d) {return d[3]}));
      // yScale.domain(d3.extent(pdata07, function(d) {return d[2]}));

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
         .text("Consumer confidence index")

      // svg.selectAll("text")
      //    .data(pdata07)
      //    .enter()
      //    .append("text")
      //    .attr('transform', 'translate('+margin.left+','+margin.top+')')
      //    .text(function(d){
      //      return d[3] + ", " + d[2];
      //    })
      //    .attr("x", function(d) {
      //      return xScale(d[3]);
      //    })
      //    .attr("y", function(d) {
      //      return yScale(d[2]);
      //    })
      //    .attr("font-size", "11px")
      //    .attr("fill", "black");



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
       var hAxis = d3.axisBottom()
         .scale(hScale)
         .tickValues(hScale.domain().filter(function(d, i){
           return !(i % 0);
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

        d3.selectAll(".m")
          .on("click", function() {
            var date = this.getAttribute("value");

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

            xScale.domain(d3.extent(dataset, function(d) {return d[3]}))
            .range([padding, w - padding]);
            yScale.domain([97, d3.max(dataset, function(d) {return d[2];})])
            .range([h+padding, padding]);

            hScale.domain(d3.extent(dataset, function(d) { return d[3]}))
              .range([0, w]);

            hAxis.scale(hScale)
              .tickValues(hScale.domain().filter(function(d, i){
                return !(i % 0);
              }));

            vScale.domain([97, d3.max(dataset, function(d) {return d[2]; })])
              .range([h+padding, 0])
              .nice();

            vAxis.scale(vScale)
              .ticks(10)
              .tickPadding(5);

            myChart = svg.selectAll("circle")
                        .data(dataset)
            myChart.enter()
            .append("circle")
            .attr('fill', d => colorScale(colorValue(d)))
            .attr('fill-opacity', 0.6 )
            .attr("r", 9);

            // svg.selectAll("line")
            //   .remove()
            // // line.enter()
            // //     .append("line")
            // //     .attr("stroke", "lightgrey")
            // //     .attr("stroke-width", 3);
            //
            // // calculate mean of data
            // x_mean = 0;
            // y_mean = 0;
            // for (var k=0; k<dataset.length; k++){
            //   x_mean += parseFloat(dataset[k][3]);
            //   y_mean += dataset[k][2];
            // }
            // x_mean /= 6;
            // y_mean /= 6;
            //
            // // calculate coefficients
            // var xr = 0;
            // var yr = 0;
            // var term1 = 0;
            // var term2 = 0;
            // for (i=0; i<dataset.length; i++){
            //   xr = parseFloat(dataset[i][3]) - x_mean;
            //   yr = dataset[i][2] - y_mean;
            //   term1 += xr * yr;
            //   term2 += xr * xr;
            // }
            // var b1 = term1 / term2;
            // var b0 = y_mean - (b1 * x_mean);
            //
            // reg = [];
            // for (i=0; i < dataset.length; i++){
            //   reg.push(b0 + (dataset[i][2] * b1));
            // }
            //
            // for (i=0; i < reg.length; i++){
            //   dataset[i].push(reg[i]);
            // }
            // var x1 = dataset[0][4];
            // var x2 = dataset[5][4];
            // var y1 = dataset[0][3];
            // var y2 = dataset[5][3];

            // var line = svg.append("line")
            //     .attr("x1", parseFloat(x1) - padding)
            //     .attr("y1", padding + margin.top + (parseFloat(y1) * 1.6))
            //     .attr("x2", w + parseFloat(x2) - padding - margin.right)
            //     .attr("y2", padding + margin.top + (parseFloat(y2) * 1.6))
            //     .attr("stroke-width", 4)
            //     .attr("stroke", "lightgrey");

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
