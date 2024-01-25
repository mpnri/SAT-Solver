# SAT-Solver

### Author: @mpnri

## Development Setup

### Setup Project

1- Please install `nodejs` and `yarn` first

2- On the project root folder run:

```bash
yarn install
```

3- Start development mode:

```bash
yarn dev
```

In development mode the input should be in `DIMACS` format.

For example:
```
p cnf 5 5
4 5
-4 1
-4 2 -3
-5 -2
-5 3
```
For more details -> [click me:)!](https://github.com/crillab/gophersat/blob/master/examples/sat-for-noobs.md?plain=1#dimacs-format)
![image](https://github.com/mpnri/SAT-Solver/assets/47795908/a07669e9-f07d-48ec-92f0-659979395077)

### Run Automated Tests

```bash
yarn test
```

It contains:
+ Solid tests([`main.test.ts`](https://github.com/mpnri/SAT-Solver/blob/main/src/solvers/tests/main.test.ts))
+ Dynamic random generated tests([`linear_solver.test.ts`](https://github.com/mpnri/SAT-Solver/blob/main/src/solvers/tests/linear_solver.test.ts) & [`cubic_solver.test.ts`](https://github.com/mpnri/SAT-Solver/blob/main/src/solvers/tests/cubic_solver.test.ts)) in [`src/solvers/tests/`](https://github.com/mpnri/SAT-Solver/tree/main/src/solvers/tests) folder:

![image](https://github.com/mpnri/SAT-Solver/assets/47795908/dca15ca7-7e90-47bf-989f-63fd9159047a)


![image](https://github.com/mpnri/SAT-Solver/assets/47795908/cdaa5e27-61b5-48f9-9ae0-e981a7ce7234)
