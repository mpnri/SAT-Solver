import { AndNode, Formula, Node, SATSolverType, VariableNode } from "./types";

export const SAT_Solver = (
  formulas: Formula[],
  solverType: SATSolverType,
): Formula | "unsatisfiable" | "solver_failed" => {
  const rootNode = parseFormulasToTree(transformFormulas(formulas));
  if (solverType === "linear") {
    return SATLeanerSolver(rootNode);
  }

  return "unsatisfiable";
};

//* use the described Transform function(T(φ))
function transformFormulas(formulas: Formula[]): Formula[] {
  return formulas.map((formula) => formula.map((val) => -val).sort((a, b) => a - b));
}

function parseFormulaToTree(formula: Formula): Node {
  if (!formula.length) throw Error("empty formula");
  if (formula.length === 1) {
    const root: VariableNode = { type: "variable", var: formula[0] };
    return root;
  }
  const root: AndNode = { type: "and" };

  let current: AndNode = root;
  formula.forEach((v, index) => {
    const child: Node =
      formula[index] > 0
        ? { type: "variable", var: formula[index] }
        : { type: "not", child: { type: "variable", var: Math.abs(formula[index]) } };

    if (index < formula.length - 1) {
      current.left = child;
      current.right = { type: "and" };
      current = current.right;
    } else {
      current.right = child;
    }
  });
  return root;
}

function parseFormulasToTree(formulas: Formula[]): Node {
  if (!formulas.length) throw Error("empty formulas");
  if (formulas.length === 1) {
    return parseFormulaToTree(formulas[0]);
  }
  const root: AndNode = { type: "and" };

  let currentNode: AndNode = root;
  formulas.forEach((formula, index) => {
    const rootOfTheFormula = parseFormulaToTree(formula);
    if (index < formulas.length - 1) {
      currentNode.left = rootOfTheFormula;
      currentNode.right = { type: "and" };
      currentNode = currentNode.right;
    } else {
      currentNode.right = rootOfTheFormula;
    }
  });

  return root;
}

function SATLeanerSolver(rootNode: Node): Formula | "unsatisfiable" | "solver_failed" {

  return "solver_failed";
}
