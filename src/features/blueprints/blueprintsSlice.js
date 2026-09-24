import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit'
import blueprintsService from '../../services/blueprintsService.js'

export const keyOf = (author, name) => `${author}/${name}`

/** Turns any service failure into a plain message so the UI can show it. */
const withMessage =
  (fn) =>
  async (arg, { rejectWithValue }) => {
    try {
      return await fn(arg)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }

export const fetchAllBlueprints = createAsyncThunk(
  'blueprints/fetchAll',
  withMessage(() => blueprintsService.getAll()),
)

export const fetchByAuthor = createAsyncThunk(
  'blueprints/fetchByAuthor',
  withMessage(async (author) => ({ author, items: await blueprintsService.getByAuthor(author) })),
)

export const fetchBlueprint = createAsyncThunk(
  'blueprints/fetchBlueprint',
  withMessage(({ author, name }) => blueprintsService.getByAuthorAndName(author, name)),
)

export const createBlueprint = createAsyncThunk(
  'blueprints/create',
  withMessage((blueprint) => blueprintsService.create(blueprint)),
)

export const updateBlueprint = createAsyncThunk(
  'blueprints/update',
  withMessage(({ author, name, points }) => blueprintsService.update(author, name, points)),
)

export const deleteBlueprint = createAsyncThunk(
  'blueprints/remove',
  withMessage(async ({ author, name }) => {
    await blueprintsService.remove(author, name)
    return { author, name }
  }),
)

const trackedThunks = [
  fetchAllBlueprints,
  fetchByAuthor,
  fetchBlueprint,
  createBlueprint,
  updateBlueprint,
  deleteBlueprint,
]

// 'blueprints/fetchByAuthor/pending' -> 'fetchByAuthor'
const requestKey = (action) => action.type.split('/')[1]

const idle = { status: 'idle', error: null }

export const initialState = {
  items: {},
  selectedAuthor: '',
  currentKey: null,
  requests: {
    fetchAll: idle,
    fetchByAuthor: idle,
    fetchBlueprint: idle,
    create: idle,
    update: idle,
    remove: idle,
  },
  rollback: {},
}

function takeSnapshot(state, action, key) {
  state.rollback[action.meta.requestId] = {
    key,
    blueprint: state.items[key] ?? null,
    wasCurrent: state.currentKey === key,
  }
}

const slice = createSlice({
  name: 'blueprints',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBlueprints.fulfilled, (state, action) => {
        state.items = Object.fromEntries(
          action.payload.map((bp) => [keyOf(bp.author, bp.name), bp]),
        )
      })
      .addCase(fetchByAuthor.pending, (state, action) => {
        state.selectedAuthor = action.meta.arg
      })
      .addCase(fetchByAuthor.fulfilled, (state, action) => {
        const { author, items } = action.payload
        for (const [key, bp] of Object.entries(state.items)) {
          if (bp.author === author) delete state.items[key]
        }
        for (const bp of items) state.items[keyOf(bp.author, bp.name)] = bp
      })
      .addCase(fetchBlueprint.fulfilled, (state, action) => {
        const key = keyOf(action.payload.author, action.payload.name)
        state.items[key] = action.payload
        state.currentKey = key
      })
      .addCase(createBlueprint.fulfilled, (state, action) => {
        const key = keyOf(action.payload.author, action.payload.name)
        state.items[key] = action.payload
        state.currentKey = key
        state.selectedAuthor = action.payload.author
      })
      // Optimistic update: apply the new points now, keep a snapshot to revert on failure.
      .addCase(updateBlueprint.pending, (state, action) => {
        const { author, name, points } = action.meta.arg
        const key = keyOf(author, name)
        takeSnapshot(state, action, key)
        state.items[key] = { author, name, points }
      })
      .addCase(updateBlueprint.fulfilled, (state, action) => {
        state.items[keyOf(action.payload.author, action.payload.name)] = action.payload
        delete state.rollback[action.meta.requestId]
      })
      // Optimistic delete: remove it now, keep a snapshot to restore on failure.
      .addCase(deleteBlueprint.pending, (state, action) => {
        const key = keyOf(action.meta.arg.author, action.meta.arg.name)
        takeSnapshot(state, action, key)
        delete state.items[key]
        if (state.currentKey === key) state.currentKey = null
      })
      .addCase(deleteBlueprint.fulfilled, (state, action) => {
        delete state.rollback[action.meta.requestId]
      })
      .addMatcher(isAnyOf(updateBlueprint.rejected, deleteBlueprint.rejected), (state, action) => {
        const snapshot = state.rollback[action.meta.requestId]
        if (!snapshot) return
        if (snapshot.blueprint) state.items[snapshot.key] = snapshot.blueprint
        else delete state.items[snapshot.key]
        if (snapshot.wasCurrent) state.currentKey = snapshot.key
        delete state.rollback[action.meta.requestId]
      })
      // loading/error per thunk
      .addMatcher(isPending(...trackedThunks), (state, action) => {
        state.requests[requestKey(action)] = { status: 'loading', error: null }
      })
      .addMatcher(isFulfilled(...trackedThunks), (state, action) => {
        state.requests[requestKey(action)] = { status: 'succeeded', error: null }
      })
      .addMatcher(isRejected(...trackedThunks), (state, action) => {
        state.requests[requestKey(action)] = {
          status: 'failed',
          error: action.payload ?? action.error.message,
        }
      })
  },
})

export default slice.reducer
