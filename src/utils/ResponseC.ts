export type ResponseC<T, Err> = {
    readonly type: 'Ok';
    readonly value0: T;
} | {
    readonly type: 'Error';
    readonly value0: Err;
} | {
    readonly type: 'NotFound';
};

export function ok<T, Err>(value0: T): ResponseC<T, Err> { return { type: 'Ok', value0 }; }

export function error<T, Err>(value0: Err): ResponseC<T, Err> { return { type: 'Error', value0 }; }

export const notFound = (): ResponseC<never, never> => ({ type: 'NotFound' });

export const fold = <T, Err, R>(fa: ResponseC<T, Err>) => (handlers: {
    // eslint-disable-next-line no-unused-vars
    onOk: (value0: T) => R;
    // eslint-disable-next-line no-unused-vars
    onError: (value0: Err) => R;
    onNotFound: () => R;
}): R => {
    switch (fa.type) {
    case 'Ok': return handlers.onOk(fa.value0);
    case 'Error': return handlers.onError(fa.value0);
    case 'NotFound': return handlers.onNotFound();
    default: throw 'a';
    }
};
