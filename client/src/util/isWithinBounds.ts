export default function isWithinBounds(
  x: number,
  y: number,
  rect: DOMRect,
): boolean {
  return (
    rect.top <= y &&
    y <= rect.top + rect.height &&
    rect.left <= x &&
    x <= rect.left + rect.width
  );
}
