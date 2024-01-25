import { describe, expect, it } from "vitest";
import { SAT_Solver } from "./solver";
import { SAT_Solver_Validator } from "./test.utils";

describe("check brute_force SAT solver", () => {
  it("should find answer", () => {
    const formulas = [[1], [-2], [-3]];
    const result = SAT_Solver(formulas, 3, "brute_force");
    expect(result).not.toBeTypeOf("string");
    if (typeof result === "string") return;
    expect(SAT_Solver_Validator(formulas, result)).toBe(true);
  });

  it("should find answer", () => {
    const formulas = [
      [1, 2, 3],
      [1, -2],
      [2, -3],
      [3, -1],
    ];
    const result = SAT_Solver(formulas, 3, "brute_force");
    expect(result).not.toBeTypeOf("string");
    if (typeof result === "string") return;
    expect(SAT_Solver_Validator(formulas, result)).toBe(true);
  });

  it("should response unsatisfiable", () => {
    const formulas = [
      [1, 2, 3],
      [1, -2],
      [2, -3],
      [3, -1],
      [-1, -2, -3],
    ];
    const result = SAT_Solver(formulas, 3, "brute_force");
    expect(result).toBe<typeof result>("unsatisfiable");
  });
});

describe("linear solver", () => {
  it("should find answer", () => {
    const result = SAT_Solver([[1], [-2], [-3]], 3, "linear");
    expect(result).toBeTypeOf("object");
    if (typeof result === "string") return;

    expect(is_same(result, [1, -2, -3])).toBe(true);
  });

  it("should say unsatisfiable", () => {
    const result = SAT_Solver([[1], [-1]], 1, "linear");
    expect(result).toBe<ReturnType<typeof SAT_Solver>>("unsatisfiable");
  });

  it("could not solve this", () => {
    const result = SAT_Solver([[1], [-1, 2]], 2, "linear");
    expect(result).toBe<ReturnType<typeof SAT_Solver>>("solver_failed");
  });
});

describe("cubic solver", () => {
  it(`p^(~q)^(~r) should be ${[[1, -2, -3]]}`, () => {
    const result = SAT_Solver([[1], [-2], [-3]], 3, "cubic");
    expect(result).toEqual<typeof result>([1, -2, -3]);
  });
});

function is_same(array1: any[], array2: any[]) {
  return (
    array1.length == array2.length &&
    array1.every((element, index) => {
      return element === array2[index];
    })
  );
}
