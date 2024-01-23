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

function SATLeanerSolver(rootNode: Node): Formula | "unsatisfiable" | "solver_failed" {
  const valFunc = new Map<number, boolean>();
  //* bfs queue { node and it's expected value }
  const queue: { node: Node; value: boolean }[] = [{ node: rootNode, value: true }];
  while (queue.length > 0) {
    const { node, value } = queue.shift();
    if (node.type === "variable") {
      if (valFunc.get(node.var) && valFunc.get(node.var) !== value) {
        return "unsatisfiable";
      }
      valFunc.set(node.var, value);
    } else if (node.type === "not") {
      if (!node.child) throw Error("empty child for 'not' node");
      queue.push({ node: node.child, value: !value });
    } else if (node.type === "and") {
      if (value === false) {
        //* leaner solver can not handle this case
        return "solver_failed";
      }
      if (!node.left || !node.right) throw Error("empty child for 'and' node");
      queue.push({ node: node.left, value: true }, { node: node.right, value: true });
    }
  }
  return Array.from(valFunc.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([variable, value]) => variable * (value ? +1 : -1));
}

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
    const root: Node =
      formula[0] > 0
        ? { type: "variable", var: formula[0] }
        : { type: "not", child: { type: "variable", var: Math.abs(formula[0]) } };
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
      if (index < formulas.length - 2) {
        currentNode.right = { type: "and" };
        currentNode = currentNode.right;
      }
    } else {
      currentNode.right = rootOfTheFormula;
    }
  });

  return root;
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
