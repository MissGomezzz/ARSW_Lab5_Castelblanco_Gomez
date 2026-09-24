import { createSelector } from '@reduxjs/toolkit'

export const pointCount = (bp) => bp.points?.length ?? 0

const byName = (a, b) => a.name.localeCompare(b.name)

const selectItems = (state) => state.blueprints.items
const selectCurrentKey = (state) => state.blueprints.currentKey

export const selectSelectedAuthor = (state) => state.blueprints.selectedAuthor
export const selectRequest = (key) => (state) => state.blueprints.requests[key]
export const selectBlueprint = (author, name) => (state) =>
  state.blueprints.items[`${author}/${name}`] ?? null

export const selectAllBlueprints = createSelector([selectItems], (items) => Object.values(items))

export const selectAuthors = createSelector([selectAllBlueprints], (list) =>
  [...new Set(list.map((bp) => bp.author))].sort(),
)

export const selectAuthorBlueprints = createSelector(
  [selectAllBlueprints, selectSelectedAuthor],
  (list, author) => list.filter((bp) => bp.author === author).sort(byName),
)

export const selectAuthorTotalPoints = createSelector([selectAuthorBlueprints], (list) =>
  list.reduce((total, bp) => total + pointCount(bp), 0),
)

export const selectTop5ByPoints = createSelector([selectAllBlueprints], (list) =>
  [...list].sort((a, b) => pointCount(b) - pointCount(a) || byName(a, b)).slice(0, 5),
)

export const selectCurrentBlueprint = createSelector(
  [selectItems, selectCurrentKey],
  (items, key) => (key ? (items[key] ?? null) : null),
)
