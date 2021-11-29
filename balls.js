class Ball{
  constructor(x, y, hor_step, ver_step, player){
    this.x = x; this.y = y; 
    this.r1 = hor_step / 1.5; this.r2 = ver_step / 1.5;
    this.x2 = -1; this.y2 = -1;
    this.player = player;
    this.speed = 0.05;
    
    this.h_step = hor_step; this.v_step = ver_step;
    
    this.frame = 0;
  }
  
  outOfBounds(){
    return this.x > width || this.x < 0 || 
      this.y > height || this.y < 0; 
  }
  
  show(num_balls, k){
    if (!this.outOfBounds()){
      let colors = [[255,0,0], [0,255,0], [0,0,255], [127,127,0], [0,50,130], [0,0,0], [30,70,20], [255,0,255]];
      let color = colors[this.player];
      fill(color[0],color[1],color[2]);
      let noiseX = 0, noiseY = 0;
      if (this.frame % 5 == 0){
        let range = 1.5
        noiseX = random(-range, range);
        noiseY = random(-range, range);
      }
      let variations = [[[-0.5,-0.5]], 
                       [[-0.7,-0.5],[-0.3,-0.5]],
                       [[-0.7,-0.4],[-0.3,-0.4], [-0.5,-0.6]],
                       [[-0.7,-0.7],[-0.3,-0.3], [-0.3,-0.7],[-0.7,-0.3]],
                       [[-0.7,-0.7],[-0.3,-0.3], [-0.3,-0.7],[-0.7,-0.3],[-0.5,-0.5]],
                       [[-0.7,-0.7],[-0.3,-0.3], [-0.3,-0.7],[-0.7,-0.3],[-0.5,-0.5], [-0.5,-0.5]],
                       [[-0.7,-0.7],[-0.3,-0.3], [-0.3,-0.7],[-0.7,-0.3],[-0.5,-0.5], [-0.5,-0.5], [-0.5,-0.5]],
                       [[-0.7,-0.7],[-0.3,-0.3], [-0.3,-0.7],[-0.7,-0.3],[-0.5,-0.5]], [-0.5,-0.5], [-0.5,-0.5], [-0.5,-0.5]];
      //console.log(num_balls);
      let variation = variations[num_balls-1][k];
      ellipse((this.x + variation[0]) * this.h_step + noiseX, (this.y + variation[1]) * this.v_step + noiseY, this.r1, this.r2);
      
      this.frame++;
      return true;
    }
    else return false;
  }
  
  move(){
    if (this.x2 != -1 && this.y2 != -1 && (abs(this.x-this.x2) > 0.01 || abs(this.y - this.y2) > 0.01)){
      let v = [this.x2 - this.x, this.y2 - this.y];
      this.x = this.x + v[0] * this.speed;
      this.y = this.y + v[1] * this.speed;
    } else if (this.x2 != -1 && this.y2 != -1){
      this.x = this.x2; this.y = this.y2;
      this.x2 = -1; this.y2 = -1;
    }
  }
  
  setPosition(x2,y2){
    this.x2 = x2; this.y2 = y2;
  }
  
  setPlayer(new_player){
    this.player = new_player;
  }
  
  getPlayer(){
    return this.player;
  }
}