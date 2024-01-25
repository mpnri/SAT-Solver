import { Formula, Node } from "../types";
import { convertValueFunctionToFormula } from "./utils";

export function LeanerSATSolver(rootNode: Node): Formula | "unsatisfiable" | "solver_failed" {
  const valueFunc = new Map<number, boolean>();
  //* bfs queue { node and it's expected value }
  const queue: { node: Node; value: boolean }[] = [{ node: rootNode, value: true }];
  while (queue.length > 0) {
    const { node, value } = queue.shift();
    if (node.type === "variable") {
      if (valueFunc.has(node.var) && valueFunc.get(node.var) !== value) {
        return "unsatisfiable";
      }
      valueFunc.set(node.var, value);
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
  return convertValueFunctionToFormula(valueFunc);
}
