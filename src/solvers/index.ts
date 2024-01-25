import { BruteForceSATSolver } from "./brute_force_solver";
import { CubicSATSolver } from "./cubic_solver";
import { LeanerSATSolver } from "./linear_solver";
import { parseFormulasToTree } from "./utils";
import { Formula, SATSolverType } from "../types";

export const SAT_Solver = (
  formulas: Formula[],
  variablesCount: number,
  solverType: SATSolverType,
): Formula | "unsatisfiable" | "solver_failed" => {
  const rootNode = parseFormulasToTree(formulas);
  // printTree(rootNode);
  if (solverType === "linear") {
    return LeanerSATSolver(rootNode);
  }

  if (solverType === "cubic") {
    return CubicSATSolver(rootNode);
  }

  if (solverType === "brute_force") {
    return BruteForceSATSolver(formulas, variablesCount);
  }

  return "unsatisfiable";
};
