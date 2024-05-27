import Tail, { TailMesh, TailRank } from '@termsurf/tail'
import { format } from 'date-fns'
import makeText from './index.js'

const host = '@termsurf/tail-tree'

type Base = {
  execution_time: {
    take: {
      title: string
      baz?: number | null
      boop?: Array<boolean>
    }
  }
}

type Name = keyof Base

Tail.base(
  host,
  'execution_time',
  (take: Base['execution_time']['take']) => ({
    note: 'Execution time logged.',
    link: take,
  }),
)

Tail.flow('default', '*', (tail: TailMesh) =>
  console.log(makeText(tail)),
)

Tail.time(time => format(time, 'yyyy/MM/dd @ hh:mm:ss.SSSaaa'))

export default function tail<N extends Name>({
  rank = 'log',
  form,
  ...take
}: {
  rank?: TailRank
  form: N
} & Base[N]['take']) {
  Tail.mark(Tail.make({ host, form, rank, take }))
}

console.log('')
console.log('')
console.log('')

setTimeout(() => {
  tail({
    form: 'execution_time',
    title: 'Foo',
    baz: 123,
    boop: [false, true],
  })

  console.log('')
  console.log('')
  console.log('')
}, 10)

tail({
  rank: 'debug',
  form: 'execution_time',
  title: 'Hello world',
  baz: null,
})
