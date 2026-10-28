// Check the Meta token: prints the Facebook Page and Instagram account it can post to.
//
//   node scripts/check-meta.mjs

import { accounts } from "./meta.mjs";

const a = await accounts();
console.log(`Page: ${a.pageName}  Instagram: @${a.igUser}`);
