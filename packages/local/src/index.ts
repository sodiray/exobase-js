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
    import: importFunc,
    functions = [],
  }: {
    port?: string | number;
    framework?: LocalFrameworkMapper;
    json?: boolean;
    import: (path: string) => Promise<(...args: any[]) => any>;
    functions: {
      url: string;
      path: string;
    }[];
  },
  cb?: (port: number) => void
): Promise<Server> {
  const api = express();
  if (useJson) api.use(bodyParser.json());

  // Add each endpoint to the local
  // running express app
  for (const f of functions) {
    const handler = await importFunc(f.path);
    api.all(f.url, async (req: Request, res: Response) => {
      const args = await framework.toArgs(req, res);
      const result = await handler(...args);
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
