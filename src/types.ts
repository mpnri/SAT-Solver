export type Formula = number[];

//todo: use classes or namespaces?
export type Node = VariableNode | AndNode | NotNode;

interface BaseNode {
  mark?: boolean;
}

export interface VariableNode extends BaseNode {
  type: "variable";
  var: number;
}

export interface AndNode extends BaseNode {
  type: "and";
  left?: Node;
  right?: Node;
}

export interface NotNode extends BaseNode {
  type: "not";
  child?: Node;
}

export type SATSolverType = "brute_force" | "linear" | "cubic";
