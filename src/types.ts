export type Formula = Number[];

//todo: use classes or namespaces?
export type Node = VariableNode | AndNode | NotNode;

export interface VariableNode {
  type: "variable";
  var: number;
}

export interface AndNode {
  type: "and";
  left: Node;
  right: Node;
}

export interface NotNode {
  type: "not";
  child: Node;
}

export type SATSolverType = "brute_force" | "linear" | "cubic";
