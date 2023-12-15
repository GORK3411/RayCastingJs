const miniMap = document.getElementById("2d");
const context2d = miniMap.getContext("2d");
const maxDistance = 300;
const angleSpeed = 0.02 * Math.PI;
const playerSpeed = 5;
const RayNum = 64;
const angleofview = 90;
const keypressed = new Set();
const wallsize = 50;
const map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 1, 1, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [1, 0, 1, 0, 0, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

function DrawSquare(x, y, size, color) {
  size = size;
  color = color;
  context2d.fillStyle = color;
  context2d.fillRect(x, y, size, size);
}

const player = {
  size: 20,
  angle: 0.00001,
  x: 110,
  y: 75,
};
miniMap.width = 500;
miniMap.height = 500;

function draw() {
  pxcenter = player.x + player.size / 2;
  pycenter = player.y + player.size / 2;
  context2d.fillStyle = "blue";
  context2d.clearRect(0, 0, window.innerWidth, window.innerHeight);
  context2d.fillRect(player.x, player.y, player.size, player.size);

  for (wally = 0; wally < map.length; wally++) {
    for (wallx = 0; wallx < map[wally].length; wallx++) {
      if (map[wally][wallx] == 1) {
        new DrawSquare(wallx * wallsize, wally * wallsize, wallsize, "green");
        context2d.beginPath();
        context2d.moveTo(wallx * wallsize, 0);
        context2d.strokeStyle = "brown";
        context2d.lineTo(wallx * wallsize, miniMap.height);
        context2d.stroke();
      }
      context2d.beginPath();
      context2d.moveTo(0, wally * wallsize);
      context2d.strokeStyle = "brown";
      context2d.lineTo(miniMap.width, wally * wallsize);
      context2d.stroke();
    }
  }

  for (diff = -1 * RayNum; diff <= RayNum; diff++) {
    xstep = wallsize / Math.tan(player.angle + diff * Math.PI);
    ystep = wallsize * Math.tan(player.angle + diff * Math.PI);
    step = 0;
    stepXdirection = Math.sign(Math.cos(player.angle + 0.00000001));
    stepYdirection = Math.sign(Math.sin(player.angle + 0.00000001));
    context2d.beginPath();
    context2d.moveTo(pxcenter, pycenter);
    if (diff == 0) {
      context2d.strokeStyle = "red";

      // distance 1 //

      if (player.angle < Math.PI / 2 || player.angle > (3 * Math.PI) / 2) {
        stepdirection = 1;
        Xnearest = Math.ceil(pxcenter / wallsize) * wallsize;
      } else {
        stepdirection = -1;
        Xnearest = Math.floor(pxcenter / wallsize) * wallsize;
      }

      Ynearest = Math.tan(player.angle) * (Xnearest - pxcenter) + pycenter;
      distance1 = Math.sqrt(
        Math.pow(Xnearest - pxcenter, 2) + Math.pow(Ynearest - pycenter, 2)
      );
      yindex = Math.floor((Ynearest + step * ystep) / wallsize);
      xindex =
        (Xnearest + step * wallsize) / wallsize -
        Math.ceil(Math.cos(player.angle + 0.00001 + Math.PI));
      while (
        distance1 <= maxDistance &&
        xindex >= 0 &&
        xindex < map[0].length &&
        yindex >= 0 &&
        yindex < map.length &&
        map[yindex][xindex] == 0
      ) {
        step = step + stepdirection;
        distance1 = Math.sqrt(
          Math.pow(Xnearest + step * wallsize - pxcenter, 2) +
            Math.pow(Ynearest + step * ystep - pycenter, 2)
        );

        yindex = Math.floor((Ynearest + step * ystep) / wallsize);
        xindex =
          (Xnearest + step * wallsize) / wallsize -
          Math.ceil(Math.cos(player.angle + 0.000001 + Math.PI));
      }
      if (distance1 > maxDistance) {
        distance1 = maxDistance;
      }

      console.log("distance1 = " + distance1);

      // distance 2 //

      if (player.angle < Math.PI) {
        stepYdirection = +1;
        Ynearest = Math.ceil(pycenter / wallsize) * wallsize;
      } else {
        stepYdirection = -1;
        Ynearest = Math.floor(pycenter / wallsize) * wallsize;
      }

      Xnearest = pxcenter + (Ynearest - pycenter) / Math.tan(player.angle);

      distance2 = Math.sqrt(
        Math.pow(Xnearest - pxcenter, 2) + Math.pow(Ynearest - pycenter, 2)
      );

      xindex = Math.floor(Xnearest / wallsize);
      yindex =
        Math.floor(Ynearest / wallsize) -
        Math.ceil(Math.sin(player.angle + Math.PI));
      console.log("xindex = " + xindex + " yindex = " + yindex);
      while (
        distance2 <= maxDistance &&
        xindex >= 0 &&
        xindex < map[0].length &&
        yindex >= 0 &&
        yindex < map.length &&
        map[yindex][xindex] == 0
      ) {
        step = step + stepYdirection;

        xindex = Math.floor((Xnearest + step * xstep) / wallsize);
        yindex =
          Math.floor((Ynearest + step * wallsize) / wallsize) -
          Math.ceil(Math.sin(player.angle + Math.PI));

        distance2 = Math.sqrt(
          Math.pow(Xnearest + step * xstep - pxcenter, 2) +
            Math.pow(Ynearest + step * wallsize - pycenter, 2)
        );
      }
      if (distance2 > maxDistance) {
        distance2 = maxDistance;
      }

      console.log("disntance 2 = " + distance2);

      mindistance = Math.min(distance1, distance2);
      context2d.lineTo(
        pxcenter + Math.cos(player.angle) * mindistance,
        pycenter + Math.sin(player.angle) * mindistance
      );
    } /*else {
      context2d.strokeStyle = "black";
      context2d.lineTo(
        pxcenter +
          Math.cos(
            player.angle + (diff * angleofview * Math.PI) / (RayNum * 180 * 2)
          ) *
            maxDistance,
        pycenter +
          Math.sin(
            player.angle + (diff * angleofview * Math.PI) / (RayNum * 180 * 2)
          ) *
            maxDistance
      );
    }*/

    context2d.stroke();
  }
}

function move() {
  if (keypressed.has("w")) {
    player.y += Math.sin(player.angle) * playerSpeed;
    player.x += Math.cos(player.angle) * playerSpeed;
  }

  if (keypressed.has("s")) {
    player.x -= Math.cos(player.angle) * playerSpeed;
    player.y -= Math.sin(player.angle) * playerSpeed;
  }
  if (keypressed.has("d")) {
    player.angle += angleSpeed;
  }
  if (keypressed.has("a")) {
    player.angle -= angleSpeed;
  }
  console.clear();
  if (player.angle >= 2 * Math.PI) {
    player.angle = player.angle - 2 * Math.PI;
  }
  if (player.angle < 0) {
    player.angle = player.angle + 2 * Math.PI;
  }

  console.log(
    "X: " +
      Math.ceil(Math.cos(player.angle + Math.PI)) +
      " Y: " +
      Math.ceil(Math.sin(player.angle + Math.PI))
  );
  draw();
}

addEventListener("keydown", (e) => {
  keypressed.add(e.key);
  move();
});
addEventListener("keyup", (e) => {
  keypressed.delete(e.key);
  move();
});
draw();

/*player.x + player.size >= wall[1].x &&
player.x <= wall[1].x + wall[1].size &&
player.y + player.size >= wall[1].y &&
player.y <= wall[1].y + wall[1].size*/

/*if (
        player.angle + diff * Math.PI < 0.5 * Math.PI ||
        player.angle + diff * Math.PI > 1.5 * Math.PI
      ) {
        xnearest = Math.ceil(pxcenter / 50) * 50;
        stepdirection = 1;
      } else {
        stepdirection = -1;
        xnearest = Math.floor(pxcenter / 50) * 50;
      }
      console.log(xnearest);
      console.log(
        Math.floor(
          (pycenter +
            (xnearest - pxcenter) * Math.tan(player.angle + diff * Math.PI) +
            ystep * step) /
            50
        )
      );
      while (
        map[
          Math.floor(
            (pycenter +
              (xnearest - pxcenter) * Math.tan(player.angle + diff * Math.PI) +
              ystep * step) /
              50
          )
        ][(xnearest + step * wallsize) / 50] != 1 &&
        (xnearest + step * wallsize) / Math.cos(player.angle) < 500
      ) {
        step += 1;
      }
      if ((xnearest + step * wallsize) / Math.cos(player.angle) > 500) {
        context2d.lineTo(
          pxcenter +
            Math.cos(player.angle + (diff * Math.PI) / 180) * maxDistance,
          pycenter +
            Math.sin(player.angle + (diff * Math.PI) / 180) * maxDistance
        );
      } else {
        context2d.lineTo(
          xnearest + step * wallsize,
          pycenter +
            (xnearest - pxcenter) * Math.tan(player.angle + diff * Math.PI) +
            ystep * step
        );*/
