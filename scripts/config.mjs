// desk.config.json: the brand name, timezone and repos. The `setup` skill fills it in.

import { readFileSync } from "node:fs";

export const config = JSON.parse(readFileSync(new URL("../desk.config.json", import.meta.url), "utf8"));
