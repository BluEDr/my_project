$(function() {
    var i, points = [], wirelib;
 
    wirelib = new gnosys.visual.Scene($("#canvas")[0]);
 
    // wirelib.strokeStyle = "black";
    for (i = 0; i < 20; i += 1) {
        points.push(Math.random() * 500 - 250,
                    -400 + Math.random() * 500 - 250,
                    Math.random() * 500 - 250);
    }
    wirelib.addLine(points);
 
     wirelib.strokeStyle = "rgb(255, 128, 0)";
     wirelib.addBox(0, 0, 0, 300, 300, 300);
 
    //wirelib.lineWidth = 10;
    wirelib.strokeStyle = "rgba(0, 0, 255, 0.5)";
    wirelib.addCircle(-200, 400, 0, 120, 32);
 
    // wirelib.lineWidth = 0.5;
    // wirelib.strokeStyle = "#ff00ff";
    // wirelib.addRect(200, 400, 0, 400, 250);
 
      wirelib.loop(24, function() {
         wirelib.rotateY(0.01);
         wirelib.draw();
     });
 
});
