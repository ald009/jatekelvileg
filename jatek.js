const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");

    // 8x8 cellás játék, de belső rács: 2n+1 (falas labirintus)
    function sizing(n) {
      let cells = n;
      if (cells % 2 == 1) {
        cells += 1;
      }
    }
    const size = cells + 1;
    const tile = canvas.width / size;

    let maze = [];
    let player = { x: 0, y: 0 };
    let showMaze = true;

    function generateMaze() {
      // 1 = fal, 0 = út
      maze = Array.from({ length: size }, () => Array(size).fill(1));

      function shuffle(arr) {
        return arr.sort(() => Math.random() - 0.5);
      }

      function carve(x, y) {
        maze[y][x] = 0;

        const dirs = shuffle([
          [2, 0],
          [-2, 0],
          [0, 2],
          [0, -2]
        ]);

        for (let [dx, dy] of dirs) {
          let nx = x + dx;
          let ny = y + dy;

          if (
            nx > 0 && ny > 0 &&
            nx < size - 1 && ny < size - 1 &&
            maze[ny][nx] === 1
          ) {
            maze[y + dy / 2][x + dx / 2] = 0;
            carve(nx, ny);
          }
        }
      }

      // indulás
      carve(1, 1);

      // start és cél
      maze[1][1] = 0;
      maze[size - 2][size - 2] = 2;

      player = { x: 1, y: 1 };
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          if (showMaze) {
            if (maze[y][x] === 1) {
              ctx.fillStyle = "black";
              ctx.fillRect(x * tile, y * tile, tile, tile);
            } else if (maze[y][x] === 2) {
              ctx.fillStyle = "green";
              ctx.fillRect(x * tile, y * tile, tile, tile);
            }
          }
          ctx.strokeRect(x * tile, y * tile, tile, tile);
        }
      }

      ctx.fillStyle = "red";
      ctx.fillRect(player.x * tile, player.y * tile, tile, tile);
    }

    function move(dx, dy) {
      const newX = player.x + dx;
      const newY = player.y + dy;

      if (newX < 0 || newY < 0 || newX >= size || newY >= size) return;

      if (maze[newY][newX] === 1) {
        alert("Vesztettél! Falba ütköztél.");
        location.reload();
        return;
      }

      player.x = newX;
      player.y = newY;

      if (maze[newY][newX] === 2) {
        alert("Nyertél!");
        location.reload();
      }

      draw();
    }

    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowUp": move(0, -1); break;
        case "ArrowDown": move(0, 1); break;
        case "ArrowLeft": move(-1, 0); break;
        case "ArrowRight": move(1, 0); break;
      }
    });

    generateMaze();
    draw();

    setTimeout(() => {
      showMaze = false;
      draw();
    }, 3000);