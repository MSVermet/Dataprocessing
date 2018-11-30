// Matty Vermet, 11320524
window.onload = function() {

  console.log('Yes, you can!')
  var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
  var requests = [d3.json(womenInScience)];

  Promise.all(requests).then(function(response) {
      console.log(response);
  }).catch(function(e){
      throw(e);
  });
};
