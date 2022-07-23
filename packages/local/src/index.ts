import express from "express";
import type { Request, Response } from "express";
import type { Server } from "http";
import bodyParser from "body-parser";
import { group } from "radash";
import type { LocalFrameworkMapper } from "./types";
import chalk from "chalk";

export type { LocalFrameworkMapper } from "./types";

export async function start(
  {
    port = "8000",
    framework = {
      toArgs: async (req, res) => [req, res],
      toRes: async () => void 0,
    },
    json: useJson = true,
    functions = [],
  }: {
    port?: string | number;
    framework?: LocalFrameworkMapper;
    json?: boolean;
    functions: {
      module: string;
      name: string;
      function: (...args: any[]) => any;
    }[];
  },
  cb?: (port: number) => void
): Promise<Server> {
  const api = express();
  if (useJson) api.use(bodyParser.json());

  // Add each endpoint to the local
  // running express app
  for (const f of functions) {
    api.all(`/${f.module}/${f.name}`, async (req: Request, res: Response) => {
      const args = await framework.toArgs(req, res);
      const result = await f.function(...args);
      framework.toRes(req, res, result);
    });
  }

  // Log about it
  const functionsByModule = Object.values(group(functions, (f) => f.module));
  for (const [moduleIdx, funcsInModule] of functionsByModule.entries()) {
    const color = colorAtIdx(moduleIdx);
    for (const f of funcsInModule) {
      console.log(
        `${chalk.gray("|—")} ${color("/" + f.module)}${chalk.gray(
          "/" + f.name
        )}`
      );
    }
  }

  // Get it poppin bebe
  const p = parseInt(`${port}`);
  return api.listen(p, () => {
    cb?.(p);
  });
}

const COLORS = [
  chalk.red.bind(chalk.red),
  chalk.blue.bind(chalk.blue),
  chalk.yellowBright.bind(chalk.yellowBright),
  chalk.magenta.bind(chalk.magenta),
  chalk.cyan.bind(chalk.cyan),
  chalk.green.bind(chalk.green),
];

const colorAtIdx = (idx: number) => COLORS[idx % COLORS.length];
