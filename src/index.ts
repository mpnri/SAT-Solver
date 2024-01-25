import promptSync from "prompt-sync";
import { SAT_Solver } from "./solver";

const prompt = promptSync();

let input: string = prompt("Enter your CNF formula in DIMACS format: ");

const [_, __, variablesCount, formulasCount] = input.split(" ").map(Number);

// console.log(variablesCount, formulasCount);
const formulas: number[][] = [];
for (let i = 0; i < formulasCount; i++) {
  input = prompt();
  formulas.push(input.split(" ").map(Number));
}
// console.log(formulas);

const answer = SAT_Solver(formulas, "cubic");

console.log(
  typeof answer === "string"
    ? answer
    : answer.map((v, i) => [String.fromCharCode(97 + i), v > 0 ? true : false]),
);
