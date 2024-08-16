// This is a simplified mock-up of a machine learning predictor
// In a real-world scenario, this would be connected to a trained model

const predictGraderAccuracy = (grader) => {
  // Mock features that might influence accuracy
  const experienceWeight = 0.4;
  const speedWeight = -0.2;
  const pastAccuracyWeight = 0.6;

  // Normalize speed (assuming max speed is 150)
  const normalizedSpeed = grader.speed / 150;

  // Calculate predicted accuracy
  let predictedAccuracy = 
    (grader.experience * experienceWeight) +
    (normalizedSpeed * speedWeight) +
    (grader.pastAccuracy * pastAccuracyWeight);

  // Ensure accuracy is between 0 and 100
  predictedAccuracy = Math.max(0, Math.min(100, predictedAccuracy));

  return predictedAccuracy.toFixed(2);
};

export default predictGraderAccuracy;

