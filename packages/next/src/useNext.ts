import * as _ from "radash";
import type { NextApiRequest, NextApiResponse } from "next";
import type {
  ApiFunction,
  Props,
  Request as ExoRequest,
  Response as ExoResponse,
} from "@exobase/core";
import {
  initProps,
  responseFromError,
  responseFromResult,
} from "@exobase/core";

export type NextFunctionOptions = {};

async function createExpressHandler(
  func: ApiFunction,
  options: NextFunctionOptions,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const props: Props = initProps(makeReq(req));
  const [error, result] = await _.try<any>(func)(props);
  if (error) {
    console.error(error);
  }
  const response = error
    ? responseFromError(error)
    : responseFromResult(result);
  setResponse(res, response);
}

export const useNext =
  (options: NextFunctionOptions = {}) =>
    (func: ApiFunction) =>
      _.partial(createExpressHandler, func, options);

export function setResponse(res: NextApiResponse, response: ExoResponse) {
  const { body, status = 200, headers = {} } = response as ExoResponse;
  res.status(status);
  for (const [key, val] of Object.entries(headers)) {
    res.setHeader(key, val);
  }
  res.json(body);
}

const makeReq = (req: NextApiRequest): ExoRequest => ({
  headers: req.headers as Record<string, string | string[]>,
  url: req.url ?? "/",
  body: req.body,
  method: req.method ?? "ANY",
  query: req.query as Record<string, string>,
  ip: req.socket.remoteAddress ?? "",
});
