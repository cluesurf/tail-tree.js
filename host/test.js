import Tail from '@termsurf/tail';
import { format } from 'date-fns';
import makeText from './index.js';
const host = '@termsurf/tail-tree';
Tail.base(host, 'execution_time', (take) => ({
    note: 'Execution time logged.',
    link: take,
}));
Tail.flow('default', '*', (tail) => console.log(makeText(tail)));
Tail.time(time => format(time, 'yyyy/MM/dd @ hh:mm:ss.SSSaaa'));
export default function tail({ rank = 'log', form, ...take }) {
    Tail.mark(Tail.make({ host, form, rank, take }));
}
console.log('');
console.log('');
console.log('');
setTimeout(() => {
    tail({
        form: 'execution_time',
        title: 'Foo',
        baz: 123,
        boop: [false, true],
    });
    console.log('');
    console.log('');
    console.log('');
}, 10);
tail({
    rank: 'debug',
    form: 'execution_time',
    title: 'Hello world',
    baz: null,
});
//# sourceMappingURL=test.js.map