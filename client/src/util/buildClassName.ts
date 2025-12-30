type T = string | null;

export function c(...args: T[]) {
  let classes = "";
  for (const arg of args) {
    if (arg) {
      classes += `${arg} `;
    }
  }
  return classes;
}
