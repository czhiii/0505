// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

let circleX = 320; // 圓的初始 X 座標
let circleY = 240; // 圓的初始 Y 座標
let circleSize = 100; // 圓的寬高

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // 繪製圓
  fill(0, 255, 0); // 圓的顏色
  noStroke();
  ellipse(circleX, circleY, circleSize);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 獲取食指的座標 (keypoints[8])
        let indexFinger = hand.keypoints[8];
        let fingerX = indexFinger.x;
        let fingerY = indexFinger.y;

        // 檢測食指是否接觸到圓
        let distance = dist(fingerX, fingerY, circleX, circleY);
        if (distance < circleSize / 2) {
          // 如果接觸到圓，讓圓跟隨食指移動
          circleX = fingerX;
          circleY = fingerY;
        }

        // 繪製食指的點
        fill(255, 0, 0); // 食指的顏色
        noStroke();
        circle(fingerX, fingerY, 16);

        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }

        // Draw lines connecting keypoints 0 to 4
        for (let i = 0; i < 4; i++) {
          let start = hand.keypoints[i];
          let end = hand.keypoints[i + 1];
          line(start.x, start.y, end.x, end.y);
        }

        // Draw lines connecting keypoints 5 to 8
        for (let i = 5; i < 8; i++) {
          let start = hand.keypoints[i];
          let end = hand.keypoints[i + 1];
          line(start.x, start.y, end.x, end.y);
        }

        // Draw lines connecting keypoints 9 to 12
        for (let i = 9; i < 12; i++) {
          let start = hand.keypoints[i];
          let end = hand.keypoints[i + 1];
          line(start.x, start.y, end.x, end.y);
        }
      }
    }
  }
}

