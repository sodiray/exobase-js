import express from "express";
import type { Request, Response } from "express";
import type { Server } from "http";
import bodyParser from "body-parser";
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
      url: string;
      path: string;
      handler: (...args: any[]) => any
    }[];
  },
  cb?: (port: number) => void
): Promise<Server> {
  const api = express();
  if (useJson) api.use(bodyParser.json());

  // Add each endpoint to the local
  // running express app
  for (const f of functions) {
    api.all(f.url, async (req: Request, res: Response) => {
      const args = await framework.toArgs(req, res);
      const result = await f.handler(...args);
      framework.toRes(req, res, result);
    });
  }

  // Log about it
  for (const f of functions) {
    console.log(`${chalk.gray("|—")} ${chalk.green(f.url)}`);
  }

  // Get it poppin bebe
  const p = parseInt(`${port}`);
  return api.listen(p, () => {
    cb?.(p);
  });
}
