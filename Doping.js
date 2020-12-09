var bodyelem = d3.select('body');
bodyelem.append('h1').attr("id", "title").text("Doping");

var margin = {
    top: 100,
    right: 20,
    bottom: 30,
    left: 60
  },
  width = 920 - margin.left - margin.right,
  height = 630 - margin.top - margin.bottom;


  var div = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip')
  .attr('id', 'tooltip')
  .style('opacity', 0);

var svg = d3
  .select('body')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .attr('class', 'graph')
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
const req = new XMLHttpRequest();
req.open("GET","https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json",true);
req.send();
req.onload = function(){
const jsonn = JSON.parse(req.responseText);

const doper = [];
var yearr = jsonn.map(function (item) {
    return item.Year;
  });
var minsec = jsonn.map(function (item) {
    let temp = item.Time.split(':');
    return new Date(1970,0,1,0,temp[0],temp[1]);
  });

  var xScale = d3
  .scaleLinear()
  .domain([d3.min(yearr) - 1, d3.max(yearr) + 1])
  .range([0, width]);

  var yScale = d3
  .scaleTime()
  .range([0, height])
  .domain([d3.min(minsec),d3.max(minsec)]);
  var timeFormat = d3.timeFormat('%M:%S');
  var xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));

var yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);
var color = d3.scaleOrdinal(d3.schemeCategory10);
svg
    .append('g')
    .attr('class', 'x axis')
    .attr('id', 'x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

    svg
    .append('g')
    .attr('class', 'y axis')
    .attr('id', 'y-axis')
    .call(yAxis)

  svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -160)
    .attr('y', -44)
    .style('font-size', 18)
    .text('Time in Minutes');

    svg
    .selectAll('.dot')
    .data(jsonn)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('r', 6)
    .attr('cx', function (d) {
      return xScale(d.Year);
    })
    .attr('cy', function (d,i) {
      return yScale(minsec[i]);
    })
    .attr('data-xvalue', function (d) {
      return d.Year;
    })
    .attr('data-yvalue', function (d,i) {
      return minsec[i].toISOString();
    })
    .style('fill', function (d) {
      return color(d.Doping !== '');
    })
    
    .on('mouseover', function (d) {
        div.style('opacity', 0.9);
        div.attr('data-year', d.Year);
        div
          .html(
            d.Name +
              ': ' +
              d.Nationality +
              '<br/>' +
              'Year: ' +
              d.Year +
              ', Time: ' +
              timeFormat(d.Time) +
              (d.Doping ? '<br/><br/>' + d.Doping : '')
          )
          .style('left', d3.event.pageX + 'px')
          .style('top', d3.event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        div.style('opacity', 0);
      });
  








    var legendContainer = svg.append('g').attr('id', 'legend');

  var legend = legendContainer
    .selectAll('#legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'legend-label')
    .attr('transform', function (d, i) {
      return 'translate(0,' + (height / 2 - i * 20) + ')';
    });

  legend
    .append('rect')
    .attr('x', width - 18)
    .attr('width', 18)
    .attr('height', 18)
    .style('fill', color);

  legend
    .append('text')
    .attr('x', width - 24)
    .attr('y', 9)
    .attr('dy', '.35em')
    .style('text-anchor', 'end')
    .text(function (d) {
      if (d) {
        return 'Riders with doping allegations';
      } else {
        return 'No doping allegations';
      }
    });
};
