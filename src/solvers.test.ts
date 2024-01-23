import { describe, expect, it } from "vitest";
import { SAT_Solver } from "./solver";

describe("linear solver", () => {
  it("should find answer", () => {
    const answer = SAT_Solver([[1], [-2], [-3]], "linear");
    expect(answer).toBeTypeOf("object");
    if (typeof answer === "string") return;

    expect(is_same(answer, [1, -2, -3])).toBe(true);
  });

  it("should say unsatisfiable", () => {
    const answer = SAT_Solver([[1], [-1]], "linear");
    expect(answer).toBe<ReturnType<typeof SAT_Solver>>("unsatisfiable");
  });

  it("could not solve this", () => {
    const answer = SAT_Solver([[1], [-1, 2]], "linear");
    expect(answer).toBe<ReturnType<typeof SAT_Solver>>("solver_failed");
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
