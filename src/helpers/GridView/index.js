import React, { useState, useEffect } from 'react'
import {
  useAsyncDebounce,
  useTable,
  useExpanded,
  useFlexLayout,
  useFilters,
  usePagination,
  useRowSelect,
  useGlobalFilter,
  useSortBy
} from 'react-table'

import cx from 'classnames'
import { isEmpty } from 'lodash'

import { getIsSorted } from '../Table/utils'

import { Table } from '../Table/components'
import { Pagination, EditableCell, DefaultColumnFilter } from '../Table/components/shared'

import { defaultGlobalFilter } from '../Table/components/shared/DefaultGlobalFilter'
import styles from './index.module.scss'

function GlobalFilter({ globalFilter, setGlobalFilter, globalFilterStyle = {} }) {
  const [value, setValue] = useState(globalFilter)

  const onChange = useAsyncDebounce((val) => {
    setGlobalFilter(val ?? undefined)
  }, 200)

  return (
    <input
      className={cx('fs-5', 'text-muted', 'light', 'dark')}
      value={value || ''}
      onChange={(e) => {
        setValue(e.target.value)
        onChange(e.target.value)
      }}
      placeholder="Search..."
      style={globalFilterStyle || ''}
    />
  )
}

export default function GridView({
  className = '',
  columns,
  enableGlobalFilter,
  data,
  pagination,
  theme,
  footer,
  getRowStyle = () => {},
  getRowClass = () => {},
  getCellStyle = () => {},
  getCellClass = () => {},
  getBodyStyle = () => {},
  getBodyClass = () => {},
  getHeadStyle = () => {},
  getHeadClass = () => {},
  getHeaderStyle = () => {},
  getHeaderClass = () => {},
  getFootStyle = () => {},
  getFootClass = () => {},
  globalFilterStyle = {},
  onEditCell = () => {},
  rowClicked = () => {},
  getSubRows = (row) => {
    return row.children
  },
  initialState,
  defaultColumn = {},
  rowSelection,
  getTrProps,
  isLoading
}) {
  const [firstRow, setFirstRow] = useState({})
  // const [value, setValue] = useState(globalFilter)

  const showFilterRow = columns.some((column) => column.filterable)
  defaultColumn = React.useMemo(
    () => ({
      ...defaultColumn
    }),
    []
  )
  const filterOptions = { filteredIds: [] }

  const {
    headerGroups,
    footerGroups,
    rows,
    getTableBodyProps,
    getTableProps,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // preGlobalFilteredRows,
    setGlobalFilter,
    state,
    state: { pageIndex, pageSize, globalFilter }
  } = useTable(
    {
      columns,
      data,
      globalFilter: enableGlobalFilter
        ? (fRows, columnIds, globalFilterValue) =>
            defaultGlobalFilter(fRows, columnIds, globalFilterValue, filterOptions)
        : null,

      defaultColumn,
      initialState: {
        ...initialState,
        pageIndex: 0
      },
      autoResetExpanded: false,
      autoResetFilters: false,
      autoResetPage: false,
      manualFilters: true,
      defaultCanFilter: true,
      autoResetSortBy: false,
      getSubRows
    },
    useFilters,
    ...(enableGlobalFilter ? [useGlobalFilter] : []),
    useSortBy,
    useExpanded,
    ...(rowSelection ? [useRowSelect] : []),
    ...(pagination ? [usePagination] : []),
    useFlexLayout
  )

  const bodyItems = pagination && page.length ? page : rows

  useEffect(() => {
    if (isEmpty(firstRow) && bodyItems.length > 0) {
      setFirstRow(bodyItems[0])
    }
  })

  const noDataPlaceholder = (
    <div className="h-100 w-100 d-flex justify-content-center align-items-center text-muted">
      <p>No Data To Show</p>
    </div>
  )

  return (
    <>
      {isLoading && (
        <div
          className="text-muted fs-6 h-100 w-100 position-absolute bg-white d-flex justify-content-center align-items-center"
          style={{ zIndex: 10 }}
        >
          <p>Loading...</p>
        </div>
      )}
      {bodyItems.length > 0 || !isEmpty(firstRow) ? (
        <>
          <Table {...getTableProps()} className={className} theme={theme}>
            <Table.Head className={getHeadClass()} style={getHeadStyle()}>
              {enableGlobalFilter && (
                <GlobalFilter
                  globalFilter={globalFilter}
                  globalFilterStyle={globalFilterStyle}
                  setGlobalFilter={setGlobalFilter}
                />
              )}
              {headerGroups.map((headerGroup) => (
                <Table.Row {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((header, index) => {
                    const {
                      className,
                      style,
                      sortable,
                      isSorted,
                      isSortedDesc,
                      getHeaderProps,
                      getSortByToggleProps
                    } = header

                    const isSortActive = getIsSorted(sortable, defaultColumn.sortable, isSorted)
                    const {
                      title,
                      style: sortStyles,
                      onClick: toggleSort = () => {}
                    } = getSortByToggleProps()

                    return (
                      <Table.Header
                        title={title}
                        {...getHeaderProps({
                          className: cx(
                            defaultColumn.className,
                            className,
                            getHeaderClass({ ...header, headers: headerGroup.headers }, index)
                          ),
                          style: {
                            ...style,
                            ...sortStyles,
                            ...getHeaderStyle({ ...header, headers: headerGroup.headers }, index)
                          }
                        })}
                        isSorted={isSortActive}
                        isSortedDesc={isSortedDesc}
                        onClick={toggleSort}
                      >
                        {header.render('Header')}
                      </Table.Header>
                    )
                  })}
                </Table.Row>
              ))}
            </Table.Head>
            <Table.Body
              {...getTableBodyProps({
                className: getBodyClass(),
                style: getBodyStyle()
              })}
            >
              {showFilterRow && !isEmpty(firstRow) ? (
                <Table.Row
                  {...firstRow.getRowProps({
                    className: `${styles.filterRow} ${getRowClass(firstRow)}`,
                    style: getRowStyle(firstRow)
                  })}
                >
                  {firstRow.cells.map((cell, index) => (
                    <Table.Data
                      {...cell.getCellProps({
                        className: cx(defaultColumn.className, getCellClass(cell, index)),
                        style: {
                          ...cell.style,
                          ...getCellStyle(cell, index)
                        }
                      })}
                    >
                      {cell.column.filterable ? <DefaultColumnFilter cell={cell} /> : null}
                    </Table.Data>
                  ))}
                </Table.Row>
              ) : null}
              {bodyItems.length > 0
                ? bodyItems.map((row, idx) => {
                    prepareRow(row)
                    return (
                      <Table.Row
                        {...row.getRowProps({
                          className: getRowClass(row),
                          style: getRowStyle(row)
                        })}
                        {...(getTrProps && getTrProps(row))}
                        id={idx}
                        onClick={(event) => {
                          rowClicked(row, event)
                        }}
                      >
                        {row.cells.map((cell, index) => (
                          <Table.Data
                            {...cell.getCellProps({
                              className: cx(defaultColumn.className, getCellClass(cell, index)),
                              style: {
                                ...cell.style,
                                ...getCellStyle(cell, index)
                              }
                            })}
                          >
                            {cell.column.editable ? (
                              <EditableCell cell={cell} onEditCell={onEditCell} />
                            ) : (
                              cell.render('Cell')
                            )}
                          </Table.Data>
                        ))}
                      </Table.Row>
                    )
                  })
                : noDataPlaceholder}
            </Table.Body>
            {footer && (
              <Table.Foot className={getFootClass()} style={getFootStyle()}>
                {footerGroups.map((group) => (
                  <Table.Row {...group.getFooterGroupProps()}>
                    {group.headers.map((footer, index) => (
                      <Table.Data
                        {...footer.getFooterProps({
                          className: getHeaderClass(
                            { ...footer, headers: footerGroups.headers },
                            index
                          ),
                          style: getHeaderStyle({ ...footer, headers: footerGroups.headers }, index)
                        })}
                      >
                        {footer.render('Footer')}
                      </Table.Data>
                    ))}
                  </Table.Row>
                ))}
              </Table.Foot>
            )}
          </Table>
          {pagination && page.length > 0 && (
            <Pagination
              canNextPage={canNextPage}
              canPreviousPage={canPreviousPage}
              gotoPage={gotoPage}
              nextPage={nextPage}
              pageCount={pageCount}
              pageIndex={pageIndex}
              pageOptions={pageOptions}
              pageSize={pageSize}
              previousPage={previousPage}
              setPageSize={setPageSize}
            />
          )}
        </>
      ) : (
        noDataPlaceholder
      )}
    </>
  )
}
