import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export const returnResponseWithHeaders = (
  start: number,
  res: Response,
  xcache: string,
  returnValue: object,
) => {
  return res
    .status(HttpStatus.OK)
    .setHeaders(
      new Headers({
        'x-cache': xcache,
        'x-response-time': `${performance.now() - start}`,
      }),
    )
    .json(returnValue);
};
