# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## 5. One Step at a Time

**Never implement more than one step per turn.**

For any multi-step task:
- State the plan upfront (brief, numbered)
- Implement ONLY step 1
- After step 1 — stop. Output: what was done, what changed, how to verify
- Wait for explicit approval ("ok", "next", "continue") before proceeding
- If a step feels too large — decompose it further and ask

**Do not:**
- Pre-implement "obvious" next steps
- Bundle steps "to save time"
- Proceed autonomously through the full plan

The loop is: Plan → Step N → Stop → Human reviews → "ok" → Step N+1

## 6. Self-Review Before Reporting

After completing a step — re-check yourself before reporting back.

Before writing "done":

1. Reread the step requirements from the plan/task point by point, not from memory.
2. Check each point explicitly — whether it is implemented, whether it is correct, and whether anything was missed.
3. Run through the project's global principles (if any): responsiveness, touch targets, hover guard, reduced-motion, a11y, code conventions.
4. Read the written code again — not "I remember what I wrote", but actually reread it. Errors like invalid `className`, broken imports, or typos are only visible during rereading.
5. If you found a mismatch — fix it before reporting, do not mention it as a "future note".

The report should only be written after the verification passes.

## 7. Plan Sync — Follow the MD Files

**The source of truth is always the three planning files. Sync against them before every step.**

This project has three planning documents:
- `master-plan.md` — the execution order. The only file that defines what to do next.
- `nextjs.md` — detailed spec for every Next.js module and component.
- `supabase.md` — detailed spec for schema, RLS, auth, triggers.
- `deploy.md` — deployment steps and final checklist.

**Before starting any step:**
1. Open `master-plan.md`. Find the current step by its number.
2. Read the referenced section in the relevant spec file (`nextjs.md` or `supabase.md`).
3. State out loud: "I am on Step N — [step name]. According to [file § section], I need to: ..."
4. Only then write code.

**After completing a step:**
1. Re-read the spec section you just implemented. Check every bullet point.
2. Mark the step complete in your report: "✅ Step N done."
3. State what the human should verify before approving.
4. Stop. Wait for explicit "ok" / "next" / "continue".

**Never:**
- Jump ahead to the next step without approval.
- Assume what the next step is without checking `master-plan.md`.
- Deviate from the spec without explicitly saying so and getting approval.

**If the spec is wrong or outdated:**
- Stop. Name the conflict: "The spec says X but the current state is Y."
- Propose an update to the MD file.
- Wait for approval before proceeding.

The loop is:
```
Read master-plan.md (current step)
→ Read referenced spec section
→ State what will be done
→ Implement
→ Self-review (Rule 6)
→ Report: ✅ Step N done + what to verify
→ Wait for human "ok"
→ Move to Step N+1
```
