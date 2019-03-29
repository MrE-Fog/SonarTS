/*
 * SonarTS
 * Copyright (C) 2017-2019 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
export enum ConstraintKind {
  Falsy,
  Truthy,
  Executed,
}

export interface Constraint {
  kind: ConstraintKind;
}

export interface TruthyConstraint extends Constraint {
  kind: ConstraintKind.Truthy;
}

export interface FalsyConstraint extends Constraint {
  kind: ConstraintKind.Falsy;
}

export interface ExecutedConstraint extends Constraint {
  kind: ConstraintKind.Executed;
}

export function isTruthyConstraint(constraint: Constraint): constraint is TruthyConstraint {
  return constraint.kind === ConstraintKind.Truthy || constraint.kind === ConstraintKind.Executed;
}

export function isFalsyConstraint(constraint: Constraint): constraint is FalsyConstraint {
  return constraint.kind === ConstraintKind.Falsy;
}

export function isExecutedConstraint(constraint: Constraint): constraint is ExecutedConstraint {
  return constraint.kind === ConstraintKind.Executed;
}

export function truthyConstraint(): TruthyConstraint {
  return { kind: ConstraintKind.Truthy };
}

export function falsyConstraint(): FalsyConstraint {
  return { kind: ConstraintKind.Falsy };
}

export function executedConstraint(): ExecutedConstraint {
  return { kind: ConstraintKind.Executed };
}

export function isEqualConstraints(a: Constraint, b: Constraint): boolean {
  return a.kind === b.kind;
}

export function constrain(list: Constraint[], candidate: Constraint): Constraint[] | undefined {
  const newList = [];
  let existingKind = false;
  for (const item of list) {
    const result = constrainWith(item, candidate);
    if (!result) {
      return undefined;
    }
    newList.push(...result);
    if (item.kind === candidate.kind) {
      existingKind = true;
    }
  }
  if (!existingKind) {
    newList.push(candidate);
  }
  return newList;
}

function constrainWith(what: Constraint, withWhat: Constraint): Constraint[] | undefined {
  if (what.kind === ConstraintKind.Executed && withWhat.kind === ConstraintKind.Truthy) {
    return [what];
  }
  if (what.kind === ConstraintKind.Truthy && withWhat.kind === ConstraintKind.Executed) {
    return [withWhat];
  }
  return what.kind === withWhat.kind ? [what] : undefined;
}

export function isTruthy(constraints: Constraint[]) {
  return constraints.length === 1 && isTruthyConstraint(constraints[0]);
}

export function isFalsy(constraints: Constraint[]) {
  return constraints.length === 1 && isFalsyConstraint(constraints[0]);
}

export function isExecuted(constraints: Constraint[]) {
  return constraints.length === 1 && isExecutedConstraint(constraints[0]);
}
