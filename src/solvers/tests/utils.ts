import { Formula } from "../../types";

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

export function randomFormulasGenerator(
  formulasCount: number,
  variablesCount: number,
  formulaLengthRage: [number, number] = [1, 3],
): Formula[] {
  const formulas = [];
  const range = Math.min(Math.max(Math.abs(formulaLengthRage[1] - formulaLengthRage[0]), 1), 30);
  const leastLength = Math.min(formulaLengthRage[0], 1);
  while (formulasCount--) {
    const formulaLength = Math.floor(getRandomNumber() * range) + leastLength;
    formulas.push(
      Array.from(
        { length: formulaLength },
        () => Math.ceil(getRandomNumber() * variablesCount) * (getRandomNumber() >= 0.5 ? 1 : -1),
      ),
    );
  }
  return formulas;
}

function getRandomNumber() {
  return Math.random() * Math.random();
}
