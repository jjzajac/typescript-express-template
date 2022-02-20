import { Response } from 'express';

export const ok = <T>(res: Response<T>) => (v: T) => { res.status(200).json(v); };
export const created = <T>(res: Response<T>) => (v: T) => { res.status(201).json(v); };
export const noContent = (res: Response<unknown>) => () => { res.status(204).send(); };

export const unprocessableEntity = (res: Response) => (e: unknown) => { res.status(422).json(e); };
export const notFound = (res: Response) => (e: unknown) => { res.status(404).json(e); };
export const internal = (res: Response) => (e: unknown) => { res.status(500).json(e); };
