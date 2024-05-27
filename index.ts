import { TailRank } from '@termsurf/tail'
import tint from '@termsurf/tint-text'

const RANK_TONE: Record<TailRank, { tone: string; bold?: boolean }> = {
  debug: { tone: 'green', bold: true },
  log: { tone: 'blue' },
  warn: { tone: 'yellow' },
  error: { tone: 'red', bold: true },
}

export const makeTextHead = ({
  time,
  rank,
  host,
  note,
  showHost = false,
  showForm = false,
}: {
  time: string
  rank: TailRank
  note: string
  host: string
  showHost?: boolean
  showForm?: boolean
}) => {
  const list: Array<string> = []

  const W = { tone: 'white' }
  const WB = { tone: 'white', bold: true }
  const H = { tone: 'blackBright' }

  const rankTone = RANK_TONE[rank]

  list.push(
    tint(`mark`, rankTone) +
      ' ' +
      tint(`<`, H) +
      tint(`${time}`, W) +
      tint('>,', H) +
      ' ' +
      tint('rank', H) +
      ' ' +
      tint(rank, rankTone),
  )
  list.push(
    '  ' + tint(`note <`, H) + tint(`${note}`, WB) + tint(`>`, H),
  )
  if (showHost) {
    list.push('  ' + tint(`host ${host}`, H))
  }
  if (showForm) {
    list.push('  ' + tint(`form ${host.replace(/_/g, '-')}`, H))
  }
  return list
}

export type MakeText = {
  host: string
  form: string
  rank: TailRank
  time: string
  note: string
  link?: Record<string, unknown>
  showHost?: boolean
  showForm?: boolean
}

/**
 * This you pass it a stack trace and it will render the error text.
 */

const makeText = ({
  host,
  form,
  time,
  rank,
  note,
  link = {},
  showHost = false,
  showForm = false,
}: MakeText): string => {
  const textList: Array<string> = []

  const W = { tone: 'white' }
  const B = { tone: 'blue' }
  const M = { tone: 'magenta' }
  const MB = { tone: 'cyan', bold: true }
  const G = { tone: 'green' }
  const H = { tone: 'blackBright' }

  textList.push(
    ...makeTextHead({ note, rank, time, host, showHost, showForm }),
  )

  textList.push(...makeLinkHash(link, 1))

  return textList.join('\n')

  function makeLinkHash(link: Record<string, unknown>, move: number) {
    const textList: Array<string> = []
    const moveText = makeTextMove(move)

    for (const name in link) {
      const bond = link[name]
      if (bond === undefined) {
        textList.push(...makeLinkVoid(name, move))
      } else if (bond === null) {
        textList.push(...makeLinkNull(name, move))
      } else if (typeof bond === 'boolean') {
        textList.push(...makeLinkWave(name, bond, move))
      } else if (typeof bond === 'string') {
        textList.push(...makeLinkText(name, bond, move))
      } else if (typeof bond === 'number') {
        textList.push(...makeLinkSize(name, bond, move))
      } else if (Array.isArray(bond)) {
        bond.forEach(bond => {
          textList.push(...makeLinkBond(name, bond, move))
        })
      } else if (typeof bond === 'object') {
        let base = true
        for (const bondName in bond) {
          const bind = (bond as Record<string, unknown>)[bondName]
          if (base) {
            base = false
            if (bind === undefined) {
              textList.push(...makeLinkVoid(name, move))
            } else if (bind === null) {
              textList.push(...makeLinkNull(name, move))
            } else if (typeof bind === 'boolean') {
              textList.push(...makeLinkWave(name, bind, move))
            } else if (typeof bind === 'string') {
              textList.push(...makeLinkText(name, bind, move))
            } else if (typeof bind === 'number') {
              textList.push(...makeLinkSize(name, bind, move))
            } else if (Array.isArray(bind)) {
              textList.push(`${moveText}${tint(`bind ${name}`, H)}`)
              bind.forEach(bind => {
                textList.push(...makeLinkBond(bondName, bind, move + 1))
              })
            } else if (typeof bind === 'object') {
              textList.push(`${moveText}${tint(`bind ${name}`, H)}`)
              textList.push(...makeLinkBond(bondName, bind, move + 1))
            }
          } else {
            if (bind === undefined) {
              textList.push(...makeLinkVoid(bondName, move + 1))
            } else if (bind === null) {
              textList.push(...makeLinkNull(bondName, move + 1))
            } else if (typeof bind === 'boolean') {
              textList.push(...makeLinkWave(bondName, bind, move + 1))
            } else if (typeof bind === 'string') {
              textList.push(...makeLinkText(bondName, bind, move + 1))
            } else if (typeof bind === 'number') {
              textList.push(...makeLinkSize(bondName, bind, move + 1))
            } else if (Array.isArray(bind)) {
              bind.forEach(bind => {
                textList.push(...makeLinkBond(bondName, bind, move + 1))
              })
            } else if (typeof bind === 'object') {
              textList.push(...makeLinkBond(bondName, bind, move + 1))
            }
          }
        }
      }
    }

    return textList
  }

  function makeLinkBond(name: string, bond: unknown, move: number) {
    const textList: Array<string> = []
    if (bond === undefined) {
      textList.push(...makeLinkVoid(name, move))
    } else if (bond === null) {
      textList.push(...makeLinkNull(name, move))
    } else if (typeof bond === 'boolean') {
      textList.push(...makeLinkWave(name, bond, move))
    } else if (typeof bond === 'string') {
      textList.push(...makeLinkText(name, bond, move))
    } else if (typeof bond === 'number') {
      textList.push(...makeLinkSize(name, bond, move))
    } else if (typeof bond === 'object') {
      const moveText = makeTextMove(move)
      textList.push(`${moveText}${tint(`${name}`, H)}`)
      textList.push(
        ...makeLinkHash(bond as Record<string, unknown>, move + 1),
      )
    }
    return textList
  }

  function makeLinkVoid(name: string, move: number) {
    const textList: Array<string> = []
    // const moveText = makeTextMove(move)
    // textList.push(
    //   `${moveText}${tint(`${name} <`, H)}${tint('void', B)}${tint(
    //     `>`,
    //     H,
    //   )}`,
    // )
    return textList
  }

  function makeLinkNull(name: string, move: number) {
    const textList: Array<string> = []
    const moveText = makeTextMove(move)
    textList.push(
      `${moveText}${tint(`bind`, H)} ${tint(name, W)}${tint(
        `,`,
        H,
      )} ${tint('null', MB)}`,
    )
    return textList
  }

  function makeLinkSize(name: string, bond: number, move: number) {
    const textList: Array<string> = []
    const moveText = makeTextMove(move)
    textList.push(
      `${moveText}${tint(`bind`, H)} ${tint(name, W)}${tint(
        `,`,
        H,
      )} ${tint(String(bond), G)}`,
    )
    return textList
  }

  function makeLinkWave(name: string, bond: boolean, move: number) {
    const textList: Array<string> = []
    const moveText = makeTextMove(move)
    textList.push(
      `${moveText}${tint(`bind`, H)} ${tint(name, W)}${tint(
        `,`,
        H,
      )} ${tint(String(bond), B)}`,
    )
    return textList
  }

  function makeLinkText(name: string, bond: string, move: number) {
    const textList: Array<string> = []
    const moveText = makeTextMove(move)
    if (bond.match(/\n/)) {
      textList.push(
        `${moveText}${tint(`bind`, H)} ${tint(name, W)}${tint(
          `, <`,
          H,
        )}`,
      )
      bond.split(/\n/).forEach(line => {
        const moveNest = move + 1
        const moveNestText = makeTextMove(moveNest)
        textList.push(`${moveNestText}${tint(line, M)}`)
      })
      textList.push(`${moveText}${tint(`>`, H)}`)
    } else {
      textList.push(
        `${moveText}${tint(`bind`, H)} ${tint(name, W)}${tint(
          `, <`,
          H,
        )}${tint(bond, M)}${tint(`>`, H)}`,
      )
    }
    return textList
  }
}

export default makeText

function makeTextMove(move: number) {
  return new Array(move + 1).join('  ')
}
