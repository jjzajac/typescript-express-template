import EventEmitter from 'events';

export type Event<K extends string, T> = { eventKind:K, type:T };

export type CtorT<K extends string, T, En extends Event<K, T>> = {
    // eslint-disable-next-line no-unused-vars
    readonly [E in En as E['eventKind']]: (_event: E['type']) => E;
}

type LstnT<K extends string, T, En extends Event<K, T>> = {
    // eslint-disable-next-line no-unused-vars
    readonly [E in En as E['eventKind']]: (_event: E['type']) => void;
}

export class TypedEventEmitter<K extends string, TT, T extends Event<K, TT>> extends EventEmitter {
    send<TTT extends T>(msg:TTT) {
        this.emit(msg.eventKind, msg.type);
    }

    listen<KK extends K, L extends LstnT<K, TT, T>[KK]>(kk:KK, f:L) {
        this.on(kk, f);
    }
}
// eslint-disable-next-line max-len
export const MkTypedEventEmitter = <K extends string, TT, T extends Event<K, TT> >() => new TypedEventEmitter<T['eventKind'], T['type'], T>();
