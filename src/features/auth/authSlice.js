import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import blueprintsService from '../../services/blueprintsService.js'
import { session } from '../../services/session.js'

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const token = await blueprintsService.login(username, password)
      session.save(token, username)
      return { token, username }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState: () => ({
    token: session.getToken(),
    username: session.getUsername(),
    status: 'idle',
    error: null,
  }),
  reducers: {
    loggedOut(state) {
      state.token = null
      state.username = null
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.token = action.payload.token
        state.username = action.payload.username
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? action.error.message
      })
  },
})

export const logout = () => (dispatch) => {
  session.clear()
  dispatch(authSlice.actions.loggedOut())
}

export const selectIsAuthenticated = (state) => Boolean(state.auth.token)
export const selectUsername = (state) => state.auth.username
export const selectAuthRequest = (state) => state.auth

export default authSlice.reducer
