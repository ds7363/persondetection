// Assuming a constant real-world height of the detected object (e.g., average height of a person)
const OBJECT_REAL_HEIGHT_METERS = 1.7; // Average height of a person in meters

let detector;
let detectedObjects = [];

function setup() {
  createCanvas(640, 480);
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();

  // Load the COCO-SSD model
  detector = ml5.objectDetector('cocossd', modelLoaded);
}

function modelLoaded() {
  console.log('Model loaded!');
}

function draw() {
  background(255);
  // Draw the captured video onto the canvas
  image(capture, 0, 0, width, height);

  // Detect objects in the video
  detector.detect(capture, gotResults);

  // Draw detected objects
  drawDetectedObjects();
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }

  // Update detected objects array
  detectedObjects = results;
}

function drawDetectedObjects() {
  for (let i = 0; i < detectedObjects.length; i++) {
    let object = detectedObjects[i];

    // Estimate distance
    let distance = estimateDistance(object.height);

    // Draw bounding box and label
    stroke(0, 255, 0);
    noFill();
    rect(object.x, object.y, object.width, object.height);
    fill(0, 255, 0);
    textSize(16);
    text(object.label + ' (' + distance.toFixed(2) + 'm)', object.x + 10, object.y + 20);

    // Log if person detected
    if (object.label === 'person') {
      console.log('Person detected at', object.x, object.y, 'Distance:', distance.toFixed(2), 'm');
    } else {
      console.log('Detected:', object.label, 'Distance:', distance.toFixed(2), 'm');
    }
  }
}

function estimateDistance(objectHeightPixels) {
  // Assuming a simple linear relationship between object size in pixels and distance
  // This is a highly simplified model and may not be accurate in many cases
  // You may need to calibrate this relationship based on your specific setup
  const PIXELS_TO_METERS_CONVERSION = 100; // Example conversion factor
  let distance = (OBJECT_REAL_HEIGHT_METERS * PIXELS_TO_METERS_CONVERSION) / objectHeightPixels;
  return distance;
}
