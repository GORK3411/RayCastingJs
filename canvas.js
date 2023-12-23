const miniMap = document.getElementById("2d");
const context2d = miniMap.getContext("2d");
const maxDistance = 300;
const angleSpeed = 0.02 * Math.PI;
const playerSpeed = 5;
const RayNumPerSide = 256;
const keypressed = new Set();

const angle_between_rays = Math.PI / (128 * 8);
const map = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
dist = [];

function DrawSquare(x, y, size, color) {
  size = size;
  color = color;
  context2d.fillStyle = color;
  context2d.fillRect(x, y, size, size);
}

const player = {
  size: 20,
  angle: 0,
  x: 110,
  y: 75,
};

a = document.querySelector(":root");
width = 400;
height = 400;
a.style.setProperty("--width", width);
a.style.setProperty("--height", height);
miniMap.width = width;
miniMap.height = width;

const wallsize = miniMap.width / map.length;
function drawMap() {
  for (wally = 0; wally < map.length; wally++) {
    for (wallx = 0; wallx < map[wally].length; wallx++) {
      if (map[wally][wallx] == 1) {
        new DrawSquare(wallx * wallsize, wally * wallsize, wallsize, "green");
        context2d.beginPath();
        context2d.moveTo(wallx * wallsize, 0);
        context2d.strokeStyle = "brown";
        context2d.lineTo(wallx * wallsize, wallsize * map.length);
        context2d.stroke();
      }
      context2d.beginPath();
      context2d.moveTo(0, wally * wallsize);
      context2d.strokeStyle = "brown";
      context2d.lineTo(wallsize * map[0].length, wally * wallsize);
      context2d.stroke();
    }
  }
}

function DrawPlayer() {
  context2d.fillStyle = "blue";
  context2d.clearRect(0, 0, window.innerWidth, window.innerHeight);
  context2d.fillRect(player.x, player.y, player.size, player.size);
}
3;
function DrawRay() {
  for (diff = -1 * RayNumPerSide; diff <= RayNumPerSide; diff++) {
    current_angle = player.angle + angle_between_rays * diff;
    context2d.beginPath();
    context2d.moveTo(pxcenter, pycenter);
    if (diff == 0) {
      context2d.strokeStyle = "red";
    } else {
      context2d.strokeStyle = "black";
    }

    if (
      distanceX(current_angle, pxcenter, pycenter, wallsize) <
      distanceY(current_angle, pxcenter, pycenter, wallsize)
    ) {
      dist[diff + RayNumPerSide] = {
        distance: distanceX(current_angle, pxcenter, pycenter, wallsize),
        axe: "x",
      };
    } else {
      dist[diff + RayNumPerSide] = {
        distance: distanceY(current_angle, pxcenter, pycenter, wallsize),
        axe: "y",
      };
    }

    /*console.log(
      distanceX(current_angle, pxcenter, pycenter, wallsize) +
        "\n" +
        distanceY(current_angle, pxcenter, pycenter, wallsize)
    );*/
    context2d.lineTo(
      pxcenter + Math.cos(current_angle) * dist[diff + RayNumPerSide].distance,
      pycenter + Math.sin(current_angle) * dist[diff + RayNumPerSide].distance
    );
    context2d.stroke();
  }
}

function distanceX(angle, Xplayer, Yplayer, wallsize) {
  X =
    (Math.floor(Xplayer / wallsize) + Math.ceil(Math.cos(angle + 0.0000001))) *
      wallsize -
    Xplayer;
  Y = Math.tan(angle) * X;
  step = 0;
  xstep = wallsize * Math.sign(Math.cos(angle));
  ystep = Math.tan(angle) * xstep;
  Xdist = Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2));
  Xcase = Math.round(
    (Xplayer + Math.cos(angle) * Xdist) / wallsize +
      Math.floor(Math.cos(angle + 0.0000001))
  );
  Ycase = Math.trunc((Yplayer + Math.sin(angle) * Xdist) / wallsize);
  while (
    Xcase >= 0 &&
    Xcase < map[0].length &&
    Ycase >= 0 &&
    Ycase < map.length &&
    map[Ycase][Xcase] != 1
  ) {
    step = step + 1;
    Xdist = Math.sqrt(
      Math.pow(X + step * xstep, 2) + Math.pow(Y + ystep * step, 2)
    );
    Xcase = Math.round(
      (Xplayer + Math.cos(angle) * Xdist) / wallsize +
        Math.floor(Math.cos(angle + 0.0000001))
    );
    Ycase = Math.trunc((Yplayer + Math.sin(angle) * Xdist) / wallsize);
  }
  if (Xdist > maxDistance) {
    Xdist = maxDistance;
  }
  //console.log(Xcase + "\n" + Ycase);

  return Xdist;
}

function distanceY(angle, Xplayer, Yplayer, wallsize) {
  Y =
    (Math.floor(Yplayer / wallsize) + Math.ceil(Math.sin(angle + 0.0000001))) *
      wallsize -
    Yplayer;
  X = Y / Math.tan(angle + 0.0000001);
  ystep = wallsize * Math.sign(Math.sin(angle + 0.0000001));
  xstep = ystep / Math.tan(angle + 0.0000001);
  Ydist = Math.sqrt(Math.pow(X, 2) + Math.pow(Y, 2));
  step = 0;
  Xcase = Math.floor((X + Xplayer) / wallsize);
  Ycase = Math.round(
    (Y + Yplayer) / wallsize + Math.floor(Math.sin(angle + 0.00001))
  );
  while (
    Xcase >= 0 &&
    Xcase < map[0].length &&
    Ycase >= 0 &&
    Ycase < map.length &&
    map[Ycase][Xcase] != 1
  ) {
    step = step + 1;
    Ydist = Math.sqrt(
      Math.pow(X + step * xstep, 2) + Math.pow(Y + ystep * step, 2)
    );
    Xcase = Math.floor((X + Xplayer + step * xstep) / wallsize);
    Ycase = Math.round(
      (Y + Yplayer + step * ystep) / wallsize +
        Math.floor(Math.sin(angle + 0.00001))
    );
  }
  if (Ydist > maxDistance) {
    Ydist = maxDistance;
  }
  //console.log(Xcase + "\n" + Ycase);
  //console.log("X:" + (Xplayer + X) + "\nY:" + (Y + Yplayer));
  return Ydist;
}

function GetLength() {
  let dists = [];
  for (diff = -1 * RayNumPerSide; diff <= RayNumPerSide; diff++) {
    let current_angle = player.angle + diff * angle_between_rays;
  }
  return dists;
}

function draw() {
  pxcenter = player.x + player.size / 2;
  pycenter = player.y + player.size / 2;
  DrawPlayer(player.x, player.y, player.size, player.size);
  drawMap();
  DrawRay();
}

function move() {
  pxcenter = player.x + player.size / 2;
  pycenter = player.y + player.size / 2;
  coordX = Math.floor(pxcenter / wallsize);
  coordY = Math.floor(pycenter / wallsize);
  minDistCollision = 20;
  if (keypressed.has("w")) {
    Xcase = Math.floor(
      (pxcenter +
        minDistCollision * Math.sign(Math.cos(player.angle + 0.000001)) +
        Math.cos(player.angle + 0.00001) * playerSpeed) /
        wallsize
    );
    Ycase = Math.floor(
      (pycenter +
        minDistCollision * Math.sign(Math.sin(player.angle + 0.000001)) +
        Math.sin(player.angle + 0.00001) * playerSpeed) /
        wallsize
    );
    if (map[Ycase][coordX] == 0) {
      player.y += Math.sin(player.angle) * playerSpeed;
    }

    if (map[coordY][Xcase] == 0) {
      player.x += Math.cos(player.angle) * playerSpeed;
    }
  }

  if (keypressed.has("s")) {
    Xcase = Math.floor(
      (pxcenter -
        minDistCollision * Math.sign(Math.cos(player.angle + 0.000001)) -
        Math.cos(player.angle + 0.001) * playerSpeed) /
        wallsize
    );
    Ycase = Math.floor(
      (pycenter -
        minDistCollision * Math.sign(Math.sin(player.angle + 0.0000001)) -
        Math.sin(player.angle + 0.000001) * playerSpeed) /
        wallsize
    );
    if (map[Ycase][coordX] == 0) {
      player.y -= Math.sin(player.angle) * playerSpeed;
    }

    if (map[coordY][Xcase] == 0) {
      player.x -= Math.cos(player.angle) * playerSpeed;
    }
  }
  if (keypressed.has("d")) {
    player.angle += angleSpeed;
  }
  if (keypressed.has("a")) {
    player.angle -= angleSpeed;
  }
  if (player.angle >= 2 * Math.PI) {
    player.angle = player.angle - 2 * Math.PI;
  }
  if (player.angle < 0) {
    player.angle = player.angle + 2 * Math.PI;
  }

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

document.getElementById("2d").addEventListener("mousedown", (e) => {
  change_map(e.clientX, e.clientY);
});
function change_map(Xmouse, Ymouse) {
  mouseCaseX = Math.floor(Xmouse / wallsize);
  mouseCaseY = Math.floor(Ymouse / wallsize);
  console.log(mouseCaseX + " " + mouseCaseY);

  map[mouseCaseY][mouseCaseX] = Math.abs(map[mouseCaseY][mouseCaseX] - 1);
  draw();
  drawRect();
}
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
