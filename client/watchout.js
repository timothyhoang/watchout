var body, board, height, width, nCircles, circleRadius, circlePositions;

var init = function(n, r) {
  body = d3.select('body');
  board = body.select('svg');
  height = board.attr('height');
  width = board.attr('width');
  nCircles = n;
  circleRadius = r;
  initializeMouse();
  initializeEnemies();
};

var generateNewPositions = function() {
  if (!circlePositions) {
    circlePositions = [];
    for (var i = 0; i < nCircles; i++) {
      circlePositions.push({});
    }
  }
  
  circlePositions.forEach(function(circlePosition) {
    circlePosition.x = Math.random() * (width - 2 * circleRadius) + circleRadius;
    circlePosition.y = Math.random() * (height - 2 * circleRadius) + circleRadius;
  });
};

var initializeEnemies = function() {
  generateNewPositions();
  
  board.selectAll('circle.enemy')
       .data(circlePositions)
       .enter().append('circle')
         .attr('class', 'enemy')
         .attr('cx', function(d) { return d.x; })
         .attr('cy', function(d) { return d.y; })
         .attr('r', circleRadius);
};

var update = function() {
  generateNewPositions();
  
  board.selectAll('circle.enemy')
       .data(circlePositions)
       .transition().duration(2500)
       .attr('cx', function(d) { return d.x; })
       .attr('cy', function(d) { return d.y; })
       .attr('r', circleRadius);  
};

var initializeMouse = function() {
  board.selectAll('circle.mouse')
       .data([{x: .5 * width, y: .5 * height}])
         .attr('fill', 'orange')
         .attr('cx', function(d) { return d.x; })
         .attr('cy', function(d) { return d.y; })
         .attr('r', circleRadius)
       .call(d3.behavior.drag().on('drag', handleMouseDrag));
};

var handleMouseDrag = function(d) {
  d3.select(this)
    .attr('cx', d.x = d3.event.x)
    .attr('cy', d.y = d3.event.y);
};

init(10, 10);
setInterval(update, 2500);

d3.selectAll('circle.mouse').on('.drag', function() { handleMouseDrag(); });