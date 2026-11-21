import assert from "node:assert/strict";
import { wellFormed } from "../lib/index.js";

const half = "😀".slice(0, 1); // lone high surrogate
assert.equal(wellFormed(`a${half}`), "a�");
assert.equal(wellFormed("ok 😀"), "ok 😀");
assert.deepEqual(wellFormed({ sources: [{ title: `t${half}`, n: 1 }], content: [{ type: "text", text: half }] }), {
  sources: [{ title: "t�", n: 1 }],
  content: [{ type: "text", text: "�" }],
});
console.log("wellFormed ok");
