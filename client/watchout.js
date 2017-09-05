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
       .attr('cy', function(d) { return d.y; });
};

var initializeMouse = function() {
  board.select('circle.mouse')
       .data([{x: .5 * width, y: .5 * height}])
         .attr('fill', 'orange')
         .attr('cx', function(d) { return d.x; })
         .attr('cy', function(d) { return d.y; })
         .attr('r', circleRadius)
       .call(d3.behavior.drag().on('drag', handleMouseDrag));
};

var handleMouseDrag = function(d) {
  d3.select(this)
    .attr('cx', d.x = (d3.event.x < circleRadius) ? circleRadius : Math.min(d3.event.x, width - 2 * circleRadius))
    .attr('cy', d.y = (d3.event.y < circleRadius) ? circleRadius : Math.min(d3.event.y, height - 2 * circleRadius));
  
  updateScore();  
  
  var hit = isHit(d);
  if (hit) {
    if (d3.select(this).attr('fill') !== 'red') {
      updateCollisions();
    }
    
    resetCurrentScore();
    
    d3.select(this).attr('fill', 'red');
  } else {
    d3.select(this).attr('fill', 'orange');
  }
};

var isHit = function(mouse) {
  var hit = false;
  board.selectAll('circle.enemy').each(function(d) {
    var selection = d3.select(this);
    
    var distance = Math.sqrt(Math.pow(selection.attr('cx') - mouse.x, 2) + Math.pow(selection.attr('cy') - mouse.y, 2));
    
    if (distance < 2 * circleRadius) {
      hit = true;
    }
  });
  return hit;
};

var updateScore = function() {
  var currentScoreSelection = d3.select('div.current span');
  var currentScore = parseInt(currentScoreSelection.text());
  currentScoreSelection.text(currentScore + 1);
  
  var highscoreSelection = d3.select('div.highscore span');
  var highscore = parseInt(highscoreSelection.text()); 
  if (currentScore > highscore) {
    highscoreSelection.text(currentScore);
  }
};

var resetCurrentScore = function() {
  d3.select('div.current span').text(0);
};

var updateCollisions = function() {
  var collisionsSelection = d3.select('div.collisions span');
  var collisions = parseInt(collisionsSelection.text());
  collisionsSelection.text(collisions + 1);
};

init(5, 25);
setInterval(update, 2500);