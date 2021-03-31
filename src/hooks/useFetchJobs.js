import axios from 'axios'
import { useEffect, useReducer } from 'react'

const BASE_URL =
  'https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json'

const ACTIONS = {
  MAKE_REQUEST: 'make-request',
  GET_DATA: 'get-data',
  ERROR: 'error',
  UPDATE_HAS_NEXT_PAGE: 'update-has-next-page',
}

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.MAKE_REQUEST:
      return { loading: true, jobs: [] }

    case ACTIONS.GET_DATA:
      return { ...state, loading: false, jobs: action.payload.jobs }

    case ACTIONS.ERROR:
      return { ...state, loading: false, error: action.payload.error, jobs: [] }

    case ACTIONS.UPDATE_HAS_NEXT_PAGE:
      return { ...state, hasNextPage: action.payload.hasNextPage }

    default:
      return state
  }
}

export default function useFetchJobs(params, page) {
  const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true })

  useEffect(() => {
    dispatch({ type: ACTIONS.MAKE_REQUEST })

    // Create a token to cancel API calls when new one is generated.
    const cancelToken1 = axios.CancelToken.source()

    // Use Axios to fetch the data from Github's Jobs API
    axios
      .get(BASE_URL, {
        // Add reference of the request to the token
        cancelToken: cancelToken1.token,
        // Passing markdown and page as default parameters.
        // The rest will be specified upon request (full time, location, etc.).
        params: { markdown: true, page: page, ...params },
      })
      .then((res) => {
        // Send a dispatch to our reducer to update the jobs in our state.
        dispatch({ type: ACTIONS.GET_DATA, payload: { jobs: res.data } })
      })
      .catch((e) => {
        // If the error was axios's own canceling of requests, ignore the error.
        if (axios.isCancel(e)) return
        // Send a dispatch to our reducer to update the error of our state.
        dispatch({ type: ACTIONS.ERROR, payload: { error: e } })
      })

    // Send a second (almost identical) request to the server to check for a next page.
    // Dispatch an action to update hasNextPage depending on if the result exists.
    const cancelToken2 = axios.CancelToken.source()
    axios
      .get(BASE_URL, {
        cancelToken: cancelToken2.token,
        params: { markdown: true, page: page + 1, ...params },
      })
      .then((res) => {
        dispatch({
          type: ACTIONS.UPDATE_HAS_NEXT_PAGE,
          payload: { hasNextPage: res.data.length !== 0 },
        })
      })
      .catch((e) => {
        if (axios.isCancel(e)) return
        dispatch({ type: ACTIONS.ERROR, payload: { error: e } })
      })

    return () => {
      cancelToken1.cancel()
      cancelToken2.cancel()
    }
  }, [params, page])

  return state
}
