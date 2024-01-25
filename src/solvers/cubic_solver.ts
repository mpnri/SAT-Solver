import { Formula, Node } from "../types";
import { convertValueFunctionToFormula } from "./utils";

export function CubicSATSolver(rootNode: Node): Formula | "unsatisfiable" | "solver_failed" {
  const queue: { node: Node; value: boolean }[] = [{ node: rootNode, value: true }];
  const valueFunc = new Map<number, boolean>();
  if (BasicCubicSolver(queue, valueFunc)) {
    // console.log("answer", [...valueFunc.entries()]);
    return convertValueFunctionToFormula(valueFunc);
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
