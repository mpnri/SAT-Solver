import { AndNode, Formula, Node, NotNode, SATSolverType, VariableNode } from "./types";

export const SAT_Solver = (
  formulas: Formula[],
  variablesCount: number,
  solverType: SATSolverType,
): Formula | "unsatisfiable" | "solver_failed" => {
  const rootNode = parseFormulasToTree(formulas);
  // printTree(rootNode);
  if (solverType === "linear") {
    return SATLeanerSolver(rootNode);
  }

  if (solverType === "cubic") {
    return SATCubicSolver(rootNode);
  }

  if (solverType === "brute_force") {
    return SATBruteForceSolver(formulas,variablesCount)
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
      if (valFunc.has(node.var) && valFunc.get(node.var) !== value) {
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

function SATCubicSolver(rootNode: Node): Formula | "unsatisfiable" | "solver_failed" {
  const queue: { node: Node; value: boolean }[] = [{ node: rootNode, value: true }];
  const valueFunc = new Map<number, boolean>();
  if (BasicCubicSolver(queue, valueFunc)) {
    // console.log("answer", [...valueFunc.entries()]);
    return Array.from(valueFunc.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([variable, value]) => variable * (value ? +1 : -1));
  }
  return "unsatisfiable";
}
function BasicCubicSolver(
  queue: { node: Node; value: boolean }[],
  valueFunc: Map<number, boolean>,
): boolean {
  while (queue.length > 0) {
    const { node, value: tempValue } = queue.shift();
    if (node.type === "variable") {
      if (valueFunc.has(node.var) && valueFunc.get(node.var) !== tempValue) {
        // console.log("variable error");
        // console.log(node.var, tempValue);
        // console.log("valueFunc says", valueFunc.get(node.var))
        return false;
      }
      valueFunc.set(node.var, tempValue);
    } else if (node.type === "not") {
      if (!node.child) throw Error("empty child for 'not' node");
      queue.push({ node: node.child, value: !tempValue });
    } else if (node.type === "and") {
      if (!node.left || !node.right) throw Error("empty child for 'and' node");
      if (tempValue === true) {
        queue.push({ node: node.left, value: true }, { node: node.right, value: true });
      } else {
        // console.log("CHECK");
        // printTree(node);
        // console.log("-----");

        for (let children of [
          { left: true, right: false },
          { left: false, right: true },
          { left: false, right: false },
        ]) {
          // console.log("original", [...valueFunc.entries()]);
          // console.log("check case", children);
          // printTree(node);
          // console.log("++++");
          // const tempValueFunc = new Map(valueFunc);
          const tempValueFunc = new Map<number, boolean>();
          valueFunc.forEach((value, key) => tempValueFunc.set(key, value));

          const tempQueue = [...queue];
          tempQueue.push(
            { node: node.left, value: children.left },
            { node: node.right, value: children.right },
          );
          if (BasicCubicSolver(tempQueue, tempValueFunc)) {
            // console.log("ok origin", [...valueFunc.entries()]);
            tempValueFunc.forEach((value, key) => valueFunc.set(key, value));
            // console.log("ok", [...valueFunc.entries()]);
            // console.log("ok", [...tempValueFunc.entries()]);
            return true;
          }
          // console.log("not ok", [...tempValueFunc.entries()]);
        }
        // console.log("false");
        // console.log("-----");
        return false;
      }
    }
  }
  return true;
}

function SATBruteForceSolver(
  formulas: Formula[],
  variablesCount: number,
): Formula | "unsatisfiable" {
  for (let mask = 0; mask < 1 << variablesCount; mask++) {
    const valueFunc = new Map<number, boolean>();
    for (let i = 0; i < variablesCount; i++) valueFunc.set(i + 1, Boolean(mask ^ (1 << i)));
    if (BruteForceSolver(formulas, valueFunc)) {
      return Array.from(valueFunc.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([variable, value]) => variable * (value ? +1 : -1));
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
      if (index < transformedFormula.length - 2) {
        currentNode.right = { type: "and" };
        currentNode = currentNode.right;
      }
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
