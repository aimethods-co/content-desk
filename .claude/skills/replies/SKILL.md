---
name: replies
description: Write replies to comments on the brand's Instagram and Facebook posts. Use after `node scripts/comments.mjs fetch`, when the user pastes comments, or says "reply to these", "answer the comments", or "handle this complaint". Routine replies are posted with `comments.mjs reply`; anything flagged goes to the user instead.
---

# Replies

Input: `results/comments-YYYY-MM-DD.md` (from `node scripts/comments.mjs fetch`)
or comments the user pastes. Skip anything marked "(answered)".

## The job of a reply

FILL (the `setup` skill writes who we're trying to reach and where an
interested commenter should go, for example "link in bio").

## Rules

1. **Public replies only.** We don't DM anyone first and don't ask anyone to DM us.
2. **No links in replies.** Say "link in bio".
3. **No personal advice** on anyone's specific situation (medical, legal,
   financial or otherwise).
4. **Never ask for personal data:** phone, email, address, ID numbers, account details.
5. **Complaints, criticism of the product, refunds, or anything about money:**
   don't reply. Flag it for the owner.
6. **Spam, abuse, scams** (fake support accounts, phishing): don't reply. Flag
   it so the owner can hide or report it.
7. Claims only from the `brand` skill. Keep it short and human, in the
   commenter's language.

## Output and posting

For each comment:
```
[platform id] comment
-> Reply: ... | FLAG: reason
```

Post each routine reply with
`node scripts/comments.mjs reply <instagram|facebook> <id> "<reply>"`.
Never post a FLAG item. List the flags in ISSUES.md for the owner, plus one
line on what people keep asking about, which feeds the next post.
