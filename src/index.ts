import promptSync from "prompt-sync";
import { SAT_Solver } from "./solvers";
import { Formula, SATSolverType } from "./types";

const prompt = promptSync();

console.log("Enter SAT Solver mode(defaults cubic):\n1)linear\n2)cubic\n3)brute force: ");
const mode: string = prompt();
const solverMode: SATSolverType = mode === "1" ? "linear" : mode === "3" ? "brute_force" : "cubic";
console.log(`${solverMode} selected`);

console.log("Enter your CNF formula in DIMACS format: ");
let input: string = prompt();

const [_, __, variablesCount, formulasCount] = input.split(" ").map(Number);

// console.log(variablesCount, formulasCount);
const formulas: Formula[] = [];
for (let i = 0; i < formulasCount; i++) {
  input = prompt();
  formulas.push(input.split(" ").map(Number));
}
// console.log(formulas);

const answer = SAT_Solver(formulas, variablesCount, solverMode);

console.log(
  typeof answer === "string"
    ? answer
    : answer.map((v, i) => [String.fromCharCode(97 + i), v > 0 ? true : false]),
);
