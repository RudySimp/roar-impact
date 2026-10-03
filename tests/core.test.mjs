import test from "node:test";import assert from "node:assert/strict";
import {clamp,smoothFalloff,hashSeed,seededChoice} from "../scripts/utils/math.js";
test("clamp enforces limits",()=>{assert.equal(clamp(3,0,2),2);assert.equal(clamp(-1,0,2),0);assert.equal(clamp(1,0,2),1)});
test("falloff is smooth and bounded",()=>{assert.equal(smoothFalloff(10,10),0);assert.equal(smoothFalloff(0,10),1);assert.ok(smoothFalloff(2,10)>smoothFalloff(8,10))});
test("seeded variants are deterministic",()=>{const seed=hashSeed("event");assert.equal(seededChoice(["a","b"],seed),seededChoice(["a","b"],seed))});
