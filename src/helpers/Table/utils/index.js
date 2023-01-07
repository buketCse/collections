// Needs optimization. I worked on an optimized version but it's not finished.
export function globalChildrenFilter(rows, columnIds, filterValue, options) {
  if (filterValue === '' || filterValue === null || filterValue === undefined) {
    return rows
  }

  if (typeof filterValue !== 'string') {
    return []
  }
  const textSearchValues = filterValue.trim().toLocaleLowerCase()
  const arraySearchValues = textSearchValues.split(' ')

  return rows.filter((row) => {
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
        !!globalChildrenFilter(row.subRows, columnIds, filterValue).length)

    if (exist && options && Array.isArray(options.filteredIds)) {
      options.filteredIds.push(row.id)
    }
    return nestedExist
  })
}

function getStatus(chance) {
  if (chance > 0.66) return 'relationship'
  if (chance > 0.33) return 'complicated'

  return 'single'
}

function newPerson() {
  const statusChance = Math.random()

  return {
    firstName: 'first name',
    lastName: 'last name',
    age: Math.floor(Math.random() * 30),
    visits: Math.floor(Math.random() * 100),
    progress: Math.floor(Math.random() * 100),
    status: getStatus(statusChance)
  }
}

export function range(len) {
  const arr = []
  for (let i = 0; i < len; i += 1) {
    arr.push(i)
  }
  return arr
}

export function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth]
    return range(len).map((d) => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined
      }
    })
  }

  return makeDataLevel()
}

export function getIsSorted(sortable, defaultColSortable, isSorted) {
  if (!sortable && !defaultColSortable) return false

  return isSorted
}
