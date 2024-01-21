import { Formula, SATSolverType } from "./types";

export const SAT_Solver = (
  formulas: Formula[],
  solverType: SATSolverType,
): Formula | "unsatisfiable" => {

  return "unsatisfiable";
};
