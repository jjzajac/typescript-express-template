import { MkTypedEventEmitter, CtorT, Event } from './src/utils/TypedEventEmitter';

type Msg1 = Event<'1', undefined>;
type Msg2Content = { msg:string };
type Msg2 = Event<'2', Msg2Content>;
type Msg= Msg1 | Msg2;

const MkMsg1 = ():Msg1 => ({ eventKind: '1', type: undefined });
const MkMsg2 = (msg:Msg2Content):Msg2 => ({ eventKind: '2', type: msg });
const msg: CtorT<Msg['eventKind'], Msg['type'], Msg> = {
    1: MkMsg1,
    2: MkMsg2,
};

const ee = MkTypedEventEmitter<Msg['eventKind'], Msg['type'], Msg>();

ee.listen('1', () => {
    console.log('an event occurred!');
});
ee.listen('2', (mmz) => {
    console.log(mmz);
});

console.log(ee.eventNames());
ee.send(msg[1](undefined));
ee.send(msg[2]({ msg: 'yey' }));
