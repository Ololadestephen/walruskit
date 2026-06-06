#!/usr/bin/env node
import { createMcpManifest } from "../dist/index.js";

console.log(JSON.stringify(createMcpManifest(), null, 2));
