import { execSync } from "node:child_process";
import { AgentContext, RepoCommand } from "../pulser-types";

export default async function repoAgent(ctx: AgentContext) {
  const cmd = ctx.parsed as RepoCommand;
  switch (cmd.sub) {
    case "status":
      return ctx.reply(await gitStatus());
    case "cherry":
      return await cherryPickSources(ctx, cmd.sources);
    case "lessons":
      return ctx.reply(await collectLessonsLearned());
    default:
      throw new Error(`Unknown repo sub-command: ${cmd.sub}`);
  }
}

/* ---------- post-deploy trigger ---------- */
export async function afterMergeSuccess(ctx: AgentContext, prNumber: number) {
  // Fire GitHub Actions workflow_dispatch if we need an immediate verify run
  await ctx.github.dispatchWorkflow({
    owner: ctx.repo.owner,
    repo: ctx.repo.name,
    workflow_id: "post-deploy-verification.yml",
    ref: "main",
  });
  ctx.reply(`🚀 Verification suite started for PR #${prNumber}`);
}

/* ---------- helpers ---------- */
function gitStatus() {
  return execSync("git status --short --branch", { encoding: "utf8" });
}

async function cherryPickSources(ctx: AgentContext, sources: string[]) {
  for (const src of sources) {
    execSync(`git fetch ${src.split("@")[0]} ${src.split("@")[1]}`);
    execSync(`git cherry-pick FETCH_HEAD`);
  }
  execSync("npm run test && npm run lint");
  const branch = `repo/cherry-${Date.now()}`;
  execSync(`git checkout -b ${branch}`);
  execSync(`git push -u origin ${branch}`);
  const pr = await ctx.github.createPR({
    title: "RepoAgent cherry-pick integration",
    body: await collectLessonsLearned(),
    head: branch,
    base: "main",
  });
  return `🛠️ Cherry-pick complete → PR #${pr.number}`;
}

async function collectLessonsLearned() {
  // placeholder – parse commit messages for "fix:" / "root-cause:"
  return "### Lessons Learned\n\n* Avoid mis-configured env vars\n* Enforce type-safe API calls\n";
}