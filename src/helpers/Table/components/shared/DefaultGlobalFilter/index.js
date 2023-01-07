import namor from 'namor'
import { cloneDeep } from 'lodash'
import { range } from '../../../utils/index.js'

export function defaultGlobalFilter(rows, columnIds, filterValue, options) {
  const clonedRows = cloneDeep(rows)
  if (filterValue === '' || filterValue === null || filterValue === undefined) {
    return clonedRows
  }
  if (typeof filterValue !== 'string') {
    return []
  }
  const textSearchValues = filterValue.trim().toLocaleLowerCase()
  const arraySearchValues = textSearchValues.split(' ')
  const filteredRows = clonedRows.filter((row) => {
    if (
      options &&
      Array.isArray(options.filteredIds) &&
      options.filteredIds.some((fid) => row.id.startsWith(fid))
    ) {
      options.filteredIds.push(row.id)
      return true
    }
    const { values } = row

    const textValues = columnIds
      .map((col) => values && values[col])
      .filter((v) => ['string', 'number'].includes(typeof v))
      .join(' ')
      .split(' ')
      .filter((v) => v !== '')
      .join(' ')
      .toLocaleLowerCase()

    const exist = arraySearchValues.every((str) => textValues.includes(str))

    const nestedExist =
      exist ||
      (Array.isArray(row.subRows) &&
        !!defaultGlobalFilter(row.subRows, columnIds, filterValue).length)

    if (exist && options && Array.isArray(options.filteredIds)) {
      options.filteredIds.push(row.id)
    }
    return nestedExist
  })

  return filteredRows
}

const generateRccpFields = () => {
  return {
    resourceName: namor.generate({ words: 1, numbers: 0 }),
    ...Object.assign(
      {},
      ...[...Array(30).keys()].map((_, i) => ({
        [`value${i}`]: Math.floor(Math.random() * 30)
      }))
    )
  }
}

export function makeRccpData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth]
    return range(len).map((_, i) => {
      return {
        ...generateRccpFields(i),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined
      }
    })
  }

  return makeDataLevel()
}

export function formatAssortmentDate(date) {
  return date.slice(0, date.indexOf('T'))
}
