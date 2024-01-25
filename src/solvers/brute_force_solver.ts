import { Formula } from "../types";
import { convertValueFunctionToFormula } from "./utils";

export function BruteForceSATSolver(
  formulas: Formula[],
  variablesCount: number,
): Formula | "unsatisfiable" {
  for (let mask = 0; mask < 1 << variablesCount; mask++) {
    const valueFunc = new Map<number, boolean>();

    for (let i = 0; i < variablesCount; i++) {
      valueFunc.set(i + 1, Boolean(mask & (1 << i)));
    }
    if (BruteForceSolver(formulas, valueFunc)) {
      return convertValueFunctionToFormula(valueFunc);
    }
  }
  return "unsatisfiable";
}

function BruteForceSolver(formulas: Formula[], valueFunc: Map<number, boolean>): boolean {
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
