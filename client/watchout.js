var body, board, height, width, nCircles, circleRadius, circlePositions, itemsVisited;

var init = function(n, r) {
  body = d3.select('body');
  board = body.select('svg');
  height = board.attr('height');
  width = board.attr('width');
  nCircles = n;
  circleRadius = r;
  currentScore = 0;
  highscore = 0;
  collisions = 0;
  itemsVisited = 0;
  hasCollision = false;
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
         .attr('fill', 'cyan')
         .attr('class', 'enemy')
         .attr('cx', function(d) { return d.x; })
         .attr('cy', function(d) { return d.y; })
         .attr('r', circleRadius);
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

var update = function() {
  var mouse = board.select('.mouse');
  
  generateNewPositions();
  
  board.selectAll('circle.enemy')
       .data(circlePositions)
       .transition().duration(2500)
       .attr('cx', function(d) { return d.x; })
       .attr('cy', function(d) { return d.y; })
       .tween('dummy', function(d) {
         var mouse = d3.select('.mouse');
         return function(t) {           
           var enemy = d3.select(this);
           handleCollisions(mouse, enemy);
           
           itemsVisited++;
           if (itemsVisited === nCircles) {
             updateCurrentScore();
             
             if (hasCollision) {
               if (mouse.attr('fill') !== 'red') {
                 updateCollisions();
               }
               resetCurrentScore();
               renderCurrentScore();
               mouse.attr('fill', 'red');
             } else {
               mouse.attr('fill', 'orange');
             }
             
             updateHighscore();
             
             itemsVisited = 0;
             hasCollision = false;
           }
         };
       });
};

var handleMouseDrag = function(d) {
  d3.select(this)
    .attr('cx', d.x = (d3.event.x < circleRadius) ? circleRadius : Math.min(d3.event.x, width - circleRadius))
    .attr('cy', d.y = (d3.event.y < circleRadius) ? circleRadius : Math.min(d3.event.y, height - circleRadius));
};

var handleCollisions = function(mouse, enemy) {
  var dx = enemy.attr('cx') - mouse.attr('cx');
  var dy = enemy.attr('cy') - mouse.attr('cy');
  if (Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) < 2 * circleRadius) {
    console.log('REACHED');
    hasCollision = true;
  }
};

var renderCurrentScore = function() {
  d3.select('div.current span').text(currentScore);
};

var updateCurrentScore = function() {
  currentScore++;
  renderCurrentScore();
};

var updateHighscore = function() {
  if (currentScore > highscore) {
    d3.select('div.highscore span').text(currentScore);
    highscore = currentScore;
  }  
};

var resetCurrentScore = function() {
  currentScore = 0;
};

var updateCollisions = function() {
  d3.select('div.collisions span').text(++collisions);
};

var run = function() {
  init(20, 10);
  setInterval((function() {
    update();
    return update;
  })(), 2500);
};

run();