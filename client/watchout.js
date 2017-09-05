var body, board, height, width, nCircles, circleRadius, circlePositions;

var init = function(n, r) {
  body = d3.select('body');
  board = body.select('svg');
  height = board.attr('height');
  width = board.attr('width');
  nCircles = n;
  circleRadius = r;
  generateNewPositions();
  enter();
};

var generateNewPositions = function() {
  if (!circlePositions) {
    circlePositions = [];
    for (var i = 0; i < nCircles; i++) {
      circlePositions.push({});
    }
  }
  
  circlePositions.forEach(function(circlePosition) {
    circlePosition.x = Math.min(width - circleRadius, (Math.random() * width) + circleRadius);
    circlePosition.y = Math.min(height - circleRadius, (Math.random() * height) + circleRadius);
  });
};

var enter = function() {
  board.selectAll('circle')
       .data(circlePositions)
       .enter().append('circle')
         .attr('cx', function(d) { return d.x; })
         .attr('cy', function(d) { return d.y; })
         .attr('r', circleRadius);  
};

var update = function() {
  generateNewPositions();
  board.selectAll('circle')
       .data(circlePositions)
       .transition(1000)
       .attr('cx', function(d) { return d.x; })
       .attr('cy', function(d) { return d.y; })
       .attr('r', circleRadius);  
};

init(10, 10);
setInterval(update, 1000);