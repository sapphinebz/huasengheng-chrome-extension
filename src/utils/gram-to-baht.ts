export function gramToBaht(weightInGrams: number) {
  if (isNaN(weightInGrams)) {
    throw new Error("Invalid input: weight must be a number.");
  }

  const weightInBaht = weightInGrams / 15.244;

  return weightInBaht;
}
