import { Formula } from "./types";

export function SAT_Solver_Validator(formulas: Formula[], answer: Formula): boolean {
  const valueFunc = new Map<number, boolean>();
  answer.forEach((value) => valueFunc.set(Math.abs(value), value > 0 ? true : false));
  for (const formula of formulas) {
    let trueFlag = false;
    for (const term of formula) {
      const valueFuncSign = 2 * Number(valueFunc.get(Math.abs(term))) - 1;
      if (term * valueFuncSign > 0) {
        trueFlag = true;
        break;
      }
    }
    if (!trueFlag) return false;
  }
  return true;
}
