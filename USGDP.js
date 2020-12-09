var bodyelem = d3.select('body');
bodyelem.append('h1').attr("id", "title").text("US GDP");

var width = 825,
  height = 400,
  barWidth = width / 275;

  var tooltip = d3
  .select('body')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0);

var overlay = d3
  .select('body')
  .append('div')
  .attr('class', 'overlay')
  .style('opacity', 0);
var svgContainer = d3
  .select('body')
  .append('svg')
  .attr('width', width + 100)
  .attr('height', height + 60);
const req = new XMLHttpRequest();
req.open("GET","https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",true);
req.send();
req.onload = function(){
  const jsonn = JSON.parse(req.responseText);
  var yearswithQuarter = [];
  var yearno = [];
  var yearr = [];

  var yearsDate = jsonn.data.map(function (item) {
    return new Date(item[0]);
  });

  var xMax = new Date(d3.max(yearsDate));
  xMax.setMonth(xMax.getMonth() + 3);
  var xScale = d3
    .scaleTime()
    .domain([d3.min(yearsDate), xMax])
    .range([0, width]);

  var xAxis = d3.axisBottom().scale(xScale);
  var gdp = [];
  for(let year of jsonn["data"])
  {
    yearno.push(parseInt(year[0].substring(0,4)));
    yearr.push(year[0]);
    if(year[0].substring(5,7) == "01")
    {
      yearswithQuarter.push(year[0].substring(0,4)+" Q1");
    }
    else if(year[0].substring(5,7) == "04")
    {
      yearswithQuarter.push(year[0].substring(0,4) + " Q2");
      yearno[yearno.length -1 ] += 0.25;
    }
    else if(year[0].substring(5,7) == "07")
    {
      yearswithQuarter.push(year[0].substring(0,4) + " Q3");
      yearno[yearno.length -1 ] += 0.5;
    }
    else if(year[0].substring(5,7) == "10")
    {
      yearswithQuarter.push(year[0].substring(0,4) + " Q4");
      yearno[yearno.length -1 ] += 0.75;
    }
    gdp.push(year[1]);
  }
  const yScale = d3.scaleLinear().domain([0, d3.max(gdp)]).range([height,0]);
  svgContainer
    .append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr("transform", "translate(50,430)");

    var yAxis = d3.axisLeft(yScale);

  svgContainer
    .append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr("transform", "translate(50,30)");
  svgContainer.selectAll("rect")
    .data(gdp)
    .enter()
    .append("rect")
    .attr('class', 'bar')
    .attr('data-date', function (d, i) {
      return yearr[i];
    })
    .attr('data-gdp', function (d, i) {
      return gdp[i];
    })
    .attr("x", (d, i) =>xScale(yearsDate[i]) + 50 )
    .attr("y",(d, i) => yScale(d)+ 30)
    .attr("width", barWidth)
    .attr("height", (d, i) => height - yScale(d))



    .on('mouseover', function (d, i) {
      overlay
        .transition()
        .duration(0)
        .style('height', height - yScale(d) + 'px')
        .style('width', barWidth + 'px')
        .style('opacity', 0.9)
        .style('left', i * barWidth + 0 + 'px')
        .style('top', yScale(d) + 'px')
        .style('transform', 'translateX(60px)');
      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip
        .html(
          yearswithQuarter[i] +'<br>' +gdp[i]
        )
        .attr('data-date', jsonn['data'][i][0])
        .style('left', i * barWidth + 30 + 'px')
        .style('top', height - 100 + 'px')
        .style('transform', 'translateX(60px)');
    })
    .on('mouseout', function () {
      tooltip.transition().duration(200).style('opacity', 0);
      overlay.transition().duration(200).style('opacity', 0);
    });
}