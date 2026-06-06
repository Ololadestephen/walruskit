#!/usr/bin/env node
import { listTemplates } from "../dist/index.js";

console.log("WalrusKit templates:");
for (const template of listTemplates()) {
  console.log(`- ${template.name}: ${template.description}`);
}
