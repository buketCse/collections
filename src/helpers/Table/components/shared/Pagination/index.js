import React from 'react'

import styles from './index.module.scss'

export default function Pagination({
  canNextPage,
  canPreviousPage,
  nextPage,
  previousPage,
  pageCount,
  pageIndex,
  pageOptions,
  pageSize,
  gotoPage,
  setPageSize
}) {
  return (
    <div className={styles.pagination}>
      <div className={styles.previous}>
        <button
          className={styles.paginationBtn}
          disabled={!canPreviousPage}
          onClick={() => previousPage()}
        >
          Prev
        </button>
      </div>
      <div className={styles.paginationCenter}>
        <span className={styles.paginationPageInfo}>
          Page
          <div className={styles.paginationPageJump}>
            <input
              aria-label="jump to page"
              autoComplete="off"
              type="number"
              value={pageIndex + 1}
              onChange={(event) => {
                const page = event.target.value ? Number(event.target.value) - 1 : 0
                gotoPage(page)
              }}
            />
          </div>
          off {pageCount}
          <span className={styles.totalPages} />
        </span>
        <span className={styles.paginationPageSizeOptions}>
          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value))
            }}
          >
            {[10, 20, 25, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize} rows
              </option>
            ))}
          </select>
        </span>
      </div>
      <div className={styles.next}>
        <button className={styles.paginationBtn} disabled={!canNextPage} onClick={() => nextPage()}>
          Next
        </button>
      </div>
    </div>
  )
}
