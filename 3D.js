const world = document.getElementById("3d");
const context3d = world.getContext("2d");
const totalRays = RayNumPerSide * 2 + 1;

const width3d = 500;
const height3d = 500;
world.width = width3d;
world.height = height3d;
function drawRect() {
  context3d.clearRect(0, 0, window.innerWidth, window.innerHeight);
  context3d.fillStyle = "#59320a";
  context3d.fillRect(0, height3d / 2, width3d, height3d / 2);

  context3d.fillStyle = "#00d8e3";
  context3d.fillRect(0, 0, width3d, height3d / 2);

  for (i = 0; i < dist.length; i++) {
    if (dist[i].axe == "x") {
      context3d.fillStyle = "#278100";
    } else {
      context3d.fillStyle = "#237400";
    }

    rayAngle = Math.abs(RayNumPerSide - i) * angle_between_rays;
    diffAngle = Math.abs(rayAngle);
    a = Math.abs(dist[i].distance * Math.cos(diffAngle));
    while (diffAngle < 0) {
      diffAngle = diffAngle + 2 * Math.PI;
    }
    while (diffAngle >= 2 * Math.PI) {
      diffAngle = diffAngle - 2 * Math.PI;
    }
    line = (wallsize * height3d) / a;

    context3d.fillRect(
      (width3d * i) / totalRays,
      (height3d - line) / 2,
      width3d / totalRays + 1,
      line
    );
  }
}
addEventListener("keydown", (e) => {
  keypressed.add(e.key);
  console.clear();
  drawRect();
});
drawRect();
