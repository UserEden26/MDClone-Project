import { NotFoundException } from '@nestjs/common';

interface ICheckParams<T> {
  value: T;
  message?: string;
}

export const isNotExsistThrows = <T>(params: ICheckParams<T>) => {
  const { value, message } = params;
  if (!value) {
    throw new NotFoundException(message);
  }
  return value;
};
