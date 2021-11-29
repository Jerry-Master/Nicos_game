let WIDTH = 700;
let HEIGHT = 700;
let N, M;
let hor_step;
let ver_step;
let FRAMES = 0;
let TOTAL_PLAYERS = 3;
let current_player = 0;
let turns = 0;
let disabled_players = Array(8).fill(false);
let can_move = true;

let grid;

let game_started = false;
function startGame(){
  game_started = true;
  
  TOTAL_PLAYERS = slider.value();
  msg_players.html('Number of players: ' + str(TOTAL_PLAYERS));
  
  N = sliderN.value();
  M = sliderM.value();
  msgN.html('N = ' + str(N));
  msgM.html('M = ' + str(M));
  
  hor_step = WIDTH / M;
  ver_step = HEIGHT / N;
  
  grid = Array(M).fill().map(()=>Array(N).fill().map(()=>Array(1).fill(0)));
  
  button.remove();
}
function setup() {
  createCanvas(WIDTH, HEIGHT);
  
  slider = createSlider(1, 8, 2, 1);
  slider.position(10, HEIGHT+30);
  slider.style('width', '200px');
  
  msg_players = createP('Number of players: 2');
  msg_players.position(10, HEIGHT-10);
  
  msg = createP('1');
  msg.position(10, HEIGHT+30);
  
  msg = createP('8');
  msg.position(200, HEIGHT+30);
  
  sliderN = createSlider(1, 100, 10, 1);
  sliderN.position(250, HEIGHT+30);
  sliderN.style('width', '200px');
  
  msgN = createP('N = ' + str(N));
  msgN.position(250, HEIGHT-10);
  
  sliderM = createSlider(1, 100, 15, 1);
  sliderM.position(250, HEIGHT+60);
  sliderM.style('width', '200px');
  
  msgM = createP('M = ' + str(M));
  msgM.position(250, HEIGHT+30);
  
  button = createButton("Start Game");
  button.mousePressed(startGame);
  button.position(WIDTH / 2, HEIGHT / 2);
}

function draw() { 
  if (!game_started){
    TOTAL_PLAYERS = slider.value();
    msg_players.html('Number of players: ' + str(TOTAL_PLAYERS));

    N = sliderN.value();
    M = sliderM.value();
    msgN.html('N = ' + str(N));
    msgM.html('M = ' + str(M));
  }
  else {
    FRAMES++;
    if (FRAMES >= 1000000){
      FRAMES = 0;
      last_frame = -1;
    }
    background(255);
  
    draw_grid(N,M);

    let num_players_balls = Array(TOTAL_PLAYERS).fill(0);
    for (let i = 0; i < M; i++){
      for (let j = 0; j < N; j++){
        let num_balls = grid[i][j][0];
        let player_;
        if (num_balls > 0){
          player_ = grid[i][j][1].getPlayer();
        }
        for (let k = 0; k < num_balls; k++){
          grid[i][j][k+1].show(num_balls, k);
          grid[i][j][k+1].move();

          num_players_balls[player_]++;
        }
      }
    }

    for (let i = 0; i < TOTAL_PLAYERS; i++){
      if (turns > TOTAL_PLAYERS-1 && num_players_balls[i] == 0){
        disabled_players[i] = true;
      }
    }
  }
}

function draw_grid(n,m){
  fill(0);
  for (let i = 0; i <= n; i++){
    line(0,ver_step*i, WIDTH,ver_step*i);
  }
  
  for (let i = 0; i <= m; i++){
    line(hor_step*i,0, hor_step*i, HEIGHT);
  }
}

function mouseClicked(){
  if (can_move && mouseX < WIDTH && mouseY < HEIGHT && mouseX >= 0 && mouseY >= 0 && FRAMES > 30){
    movement();
  }
}

function touchEnded(){
  if (can_move && mouseX < WIDTH && mouseY < HEIGHT && mouseX >= 0 && mouseY >= 0 && FRAMES > 30){
    movement();
  }
}

function movement(){
  if (game_started){
    can_move = false;
    let _=0;
    while (disabled_players[current_player] || _==8){
      current_player++;
      current_player = current_player % TOTAL_PLAYERS;
      _++;
    }
      
    let x = int(mouseX / hor_step);
    let y = int(mouseY / ver_step);

    let adj = compute_adj(x,y);
    if (grid[x][y][0] < adj){
      if (grid[x][y][0] > 0){
        let cell_player = grid[x][y][1].getPlayer();
        if (cell_player == current_player){
          grid[x][y][0]++;
          grid[x][y].push(new Ball(x+1,y+1, hor_step, ver_step, current_player));
          turns++;
        } else {
          current_player--;
        }
      } else {
        grid[x][y][0]++;
        grid[x][y].push(new Ball(x+1,y+1, hor_step, ver_step, current_player));
        turns++;
      }
    } 
    if (grid[x][y][0] == adj) {
      explode(x,y).then(function(value){
        current_player++;
        current_player = current_player % TOTAL_PLAYERS;
        can_move = true;
      });
    } else {
      current_player++;
      current_player = current_player % TOTAL_PLAYERS;
      can_move = true;
    }
  }
}

async function explode(x,y){
  let adj = compute_adj(x,y);
  if (grid[x][y][0] >= adj){
    let dirs = compute_dirs(x,y);

    let K = grid[x][y][0];
    grid[x][y][0] = 0;
    for (let k = 0; k < K; k++){
      let b = grid[x][y].pop();
      let x2 = x + 1 + dirs[k][0];
      let y2 = y + 1 + dirs[k][1];
      if (true || grid[x2-1][y2-1][0] < compute_adj(x2-1,y2-1)){
        b.setPosition(x2, y2);
        grid[x2-1][y2-1].push(b);
        grid[x2-1][y2-1][0]++;
      }
      for (let i = 1; i <= grid[x2-1][y2-1][0]; i++){
        grid[x2-1][y2-1][i].setPlayer(current_player);
      }
    }
    await sleep(1000);
    let arr = Array(K);
    for (let k = 0; k < K; k++){
      let x2 = x + 1 + dirs[k][0];
      let y2 = y + 1 + dirs[k][1];
      arr[k] = explode(x2-1, y2-1);
    }
    for (let k = 0; k < K; k++){
      await arr[k];
    }
  }
}

function compute_adj(x,y){
  let adj = 4;
  if ((x == 0 && y == 0) || (x == 0 && y == N-1) || (x == M-1 && y == 0) || (x == M-1 && y == N-1)){
    adj = 2;
  } else if (x == 0 || y == 0 || y == N-1 || x == M-1 ){
    adj = 3;
  }
  return adj;
}

function compute_dirs(x,y){
  let dirs = [[1,0], [-1,0], [0,1], [0,-1]];
  if (x == 0 && y == 0){
    dirs = [[1,0], [0,1]];
  } else if (x == M-1 && y == 0){
    dirs = [[-1,0], [0,1]];
  } else if (x == 0 && y == N-1){
    dirs = [[1,0], [0,-1]];
  } else if (x == M-1 && y == N-1){
    dirs = [[-1,0], [0,-1]];
  } else if (x == 0){
    dirs = [[1,0], [0,1], [0,-1]];
  } else if (y == 0){
    dirs = [[1,0], [0,1], [-1,0]];
  } else if (x == M-1){
    dirs = [[-1,0], [0,-1], [0,1]];
  } else if (y == N-1){
    dirs = [[-1,0], [0,-1], [1,0]];
  }
  dirs.push(...[[0,0],[0,0],[0,0],[0,0]]);
  return dirs;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}