import { Formula, SATSolverType } from "./types";

export const SAT_Solver = (
  formulas: Formula[],
  solverType: SATSolverType,
): Formula | "unsatisfiable" | "solver_failed" => {
  if (solverType === "linear") {
    //todo: convert to a tree
    return SATLeanerSolver(transformFormulas(formulas));
  }

  return "unsatisfiable";
};

//* use the described Transform function(T(φ))
function transformFormulas(formulas: Formula[]): Formula[] {
  return formulas.map((formula) => formula.map((val) => -val).sort((a, b) => a - b));
}

//todo: convert to a tree
function SATLeanerSolver(formulas: Formula[]): Formula | "unsatisfiable" | "solver_failed" {

  return "solver_failed";
}
