import promptSync from "prompt-sync";
import { SAT_Solver } from "./solver";

const prompt = promptSync();

let input: string = prompt("Enter your CNF formula in DIMACS format: ");

const [_, __, variablesCount, formulasCount] = input.split(" ").map(Number);

// console.log(variablesCount, formulasCount);
const formulas: Number[][] = [];
for (let i = 0; i < formulasCount; i++) {
  input = prompt();
  formulas.push(input.split(" ").map(Number));
}
console.log(formulas);


// SAT_Solver(formulas);