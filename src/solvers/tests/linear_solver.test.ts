import { describe, expect, it } from "vitest";
import { SAT_Solver } from "../index";
import { SAT_Solver_Validator, randomFormulasGenerator } from "./utils";
import { convertFormulasToString } from "../utils";

describe("Check linear solver with random generated tests", () => {
  for (let i = 0; i < 3; i++) {
    const variablesCount = i + 2;
    const formulas = randomFormulasGenerator(i + 2, variablesCount, [1, 2]);

    const formulasToString = convertFormulasToString(formulas);
    const testName = `Should Answer correctly or return 'unsatisfiable' or 'solver_failed' for:\n${formulasToString}`;
    it(testName, () => {
      const result = SAT_Solver(formulas, variablesCount, "linear");
      const shouldFail = formulas.some((formula) => formula.length !== 1);
      const canBeSolved = typeof SAT_Solver(formulas, variablesCount, "brute_force") !== "string";

      if (shouldFail) {
        expect(result).toBe<typeof result>("solver_failed");
      } else if (!canBeSolved) {
        expect(result).toBe<typeof result>("unsatisfiable");
      } else {
        expect(result).not.toBeTypeOf("string");
        if (typeof result === "string") return;
        expect(result).toSatisfy(() => SAT_Solver_Validator(formulas, result));
      }
    });
  }
});
