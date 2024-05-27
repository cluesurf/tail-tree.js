import Tail, { TailMesh, TailRank } from '@termsurf/tail'
import { format } from 'date-fns'
import makeText, { TIME_FORM } from './index.js'

const host = '@termsurf/tail-tree'

type TailBase = {
  execution_time: {
    take: {
      title: string
      baz?: number | null
      boop?: Array<boolean>
    }
  }
}

type TailName = keyof TailBase

Tail.base(
  host,
  'execution_time',
  (take: TailBase['execution_time']['take']) => ({
    note: 'Execution time logged.',
    link: take,
  }),
)

Tail.flow('default', '*', (tail: TailMesh) =>
  console.log(makeText({ ...tail, showHost: true })),
)

Tail.time(time => format(time, TIME_FORM))

export default function tail<N extends TailName>({
  rank = 'log',
  form,
  ...take
}: {
  rank?: TailRank
  form: N
} & TailBase[N]['take']) {
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
