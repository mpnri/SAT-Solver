import { AndNode, Formula, Node, NotNode, SATSolverType, VariableNode } from "./types";

export const SAT_Solver = (
  formulas: Formula[],
  solverType: SATSolverType,
): Formula | "unsatisfiable" | "solver_failed" => {
  const rootNode = parseFormulasToTree(formulas);
  // printTree(rootNode);
  if (solverType === "linear") {
    return SATLeanerSolver(rootNode);
  }

  return "unsatisfiable";
};



/**
 ** use the described Transform function(T(φ))
 * @example
 * ```(p v q v r) to ~(~p ^ ~q ^ ~r)```
 */
function transformFormula(formula: Formula): Formula {
  if (formula.length < 2) return formula;
  return formula.map((val) => -val).sort((a, b) => a - b);
}

function parseFormulaToTree(formula: Formula): Node {
  if (!formula.length) throw Error("empty formula");
  if (formula.length === 1) {
    const root: VariableNode = { type: "variable", var: formula[0] };
    return root;
  }

  const transformedFormula = transformFormula(formula);
  const rootChild: AndNode = { type: "and" };
  const root: NotNode = { type: "not", child: rootChild };

  let currentNode: AndNode = rootChild;
  transformedFormula.forEach((v, index) => {
    const child: Node =
      transformedFormula[index] > 0
        ? { type: "variable", var: transformedFormula[index] }
        : { type: "not", child: { type: "variable", var: Math.abs(transformedFormula[index]) } };

    if (index < transformedFormula.length - 1) {
      currentNode.left = child;
      currentNode.right = { type: "and" };
      currentNode = currentNode.right;
    } else {
      currentNode.right = child;
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

/**
 * @internal
 */
function printTree(node?: Node, depth = 0) {
  if (node) {
    const space = Array(depth * 2)
      .fill(" ")
      .join("");
    if (node.type === "variable") console.log(space, node);
    else if (node.type === "not") {
      console.log(space, { type: "not" });
      printTree(node.child, depth + 1);
    } else {
      console.log(space, { type: "and" });
      console.log(space, "left child:");
      printTree(node.left, depth + 1);
      console.log(space, "right child:");
      printTree(node.right, depth + 1);
    }
  }
}
