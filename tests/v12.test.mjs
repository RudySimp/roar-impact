import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const manifest=JSON.parse(fs.readFileSync(new URL("../module.json",import.meta.url),"utf8"));
const main=fs.readFileSync(new URL("../scripts/main.js",import.meta.url),"utf8");

test("manifest is restricted to Foundry v12",()=>assert.deepEqual(manifest.compatibility,{minimum:"12",verified:"12",maximum:"12"}));
test("manifest uses dedicated v12 channel",()=>{assert.match(manifest.manifest,/\/foundry-v12\/module\.json$/);assert.match(manifest.download,/v1\.0\.0-foundry12\/roar-impact-v1\.0\.0-foundry12\.zip$/)});
test("Scene Controls uses v12 arrays",()=>{assert.match(main,/controls\.find\(/);assert.match(main,/tokenControls\.tools\.push\(/);assert.match(main,/onClick:/);assert.doesNotMatch(main,/controls\.tokens\.tools/)});
