var PLAY = 1;
var END = 0;
var gameState = PLAY;


var trex , trex_running,ground,invisibleGround,cloud,cloudImage,obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,
obstacle6,trex_collided,score,cloudsGroup,
obstaclesGroup;

var gameOverImg,restartImg

var jumpSound,checkPointSound,dieSound

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided=loadAnimation("trex_collided.png");
  groundImage = loadAnimation("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3")
}
function setup() {
  createCanvas(600, 200);
  
  //create sprite for trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running" , trex_running);
  trex.addAnimation("collided" , trex_collided);
   trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20)
  ground.addAnimation("ground",groundImage);
  ground.x=ground.width/2
  
  //creating invisible ground
  invisibleGround=createSprite(200,190,400,10);
  invisibleGround.visible=false
  
  //create Sprite for restart and game over
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale=0.5
  restart.scale=0.5
   
  
  score = 0;
  
  //create clouds and obstacles group
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  trex.setCollider("circle",0,0,40);
  trex.debug = false;
  

}

function draw() {
  background("white");
  
  text("Score: "+score,500,50);
 
  
  if(gameState === PLAY){
    //move the ground
      ground.velocityX=(-6 );
    
    //update the scoring
    score=score + Math.round(frameCount/550)
    
    if(score>0 && score%100 === 0){
      checkPointSound.play()
    }
   
    //Spawn the clouds
  spawnClouds();
  
  //Spawn obstacles on the ground
  spawnObstacles();
    
    //resetting the ground
    if(ground.x<0){
    ground.x=ground.width/2
  }
    //jump when space is pressed
  if(keyDown("space") && trex.y>=160){
    trex.velocityY = -12;
    jumpSound.play()
  }
    
    gameOver.visible=false
    restart.visible=false
  
  trex.velocityY = trex.velocityY + 0.8 ;
    if(obstaclesGroup.isTouching(trex)){
      
      //adding AI to Trex
     // trex.velocityY = -12;
      //jumpSound.play();
      
      
      gameState=END;
      dieSound.play();
    }
    
  }
  else if(gameState === END){
    //stop the ground
      ground.velocityX=0;
    trex.velocityY = 0;
    
     gameOver.visible=true
    restart.visible=true
    
    
    
     
    //change Animation
    
    trex.changeAnimation("collided" ,trex_collided)
    
    //stop clouds and obstacles
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //set lifetime of the game objets so that they never diseppear
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1)
    
  }
  
  
  //stop trex from faliing down
  trex.collide(invisibleGround);

  
  
  drawSprites();
}
function spawnClouds(){
  if(frameCount % 60 === 0){
  cloud = createSprite(600,100,40,10);
  cloud.addImage(cloudImage);
    cloud.y = Math.round(random(10,60));
  cloud.scale=0.5
  cloud.velocityX = -3;
    
    //assigning lifetime to the variable
    cloud.lifetime = 200
    
    //adjust depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1; 
    //add each cloud to group
    cloudsGroup.add(cloud);
 }
}
function spawnObstacles(){
  if(frameCount % 60 === 0){
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX=-(6 + score/100)
    
    //to generate random obstacle
    var rand = Math.round(random(1,6));
        
        switch(rand){
          case 1 : obstacle.addImage(obstacle1);
            break;
            case 2 : obstacle.addImage(obstacle2);
            break;
            case 3 : obstacle.addImage(obstacle3);
            break;
            case 4 : obstacle.addImage(obstacle4);
            break;
            case 5 : obstacle.addImage(obstacle5);
            break;
            case 6 : obstacle.addImage(obstacle6);
            break;
            
        }
    //assign scale and lifetime for obstacles
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
          
        
  }
}
