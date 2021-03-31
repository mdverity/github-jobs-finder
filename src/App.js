import React, { useState } from 'react'
import useFetchJobs from './hooks/useFetchJobs'
import { Container } from 'react-bootstrap'
import Job from './components/Job'
import JobsPagination from './components/JobsPagination'
import SearchForm from './components/SearchForm'

function App() {
  const [params, setParams] = useState({})
  const [page, setPage] = useState(1)
  const { jobs, loading, error } = useFetchJobs(params, page)

  function handleParamChange(e) {
    const param = e.target.name
    const value = e.target.value
    setPage(1)
    setParams((prevParams) => {
      return { ...prevParams, [param]: value }
    })
  }

  return (
    <Container className='my-4'>
      <h1 className='mb-4'>Github Jobs</h1>
      <SearchForm params={params} onParamChange={handleParamChange} />
      <JobsPagination page={page} setPage={setPage} hasNextPage={true} />
      {loading && <h1>Loading...</h1>}
      {error && <h1>Error. Try refreshing.</h1>}
      {jobs.map((job) => {
        return <Job key={job.id} job={job} />
      })}
      <JobsPagination page={page} setPage={setPage} hasNextPage={true} />
    </Container>
  )
}

export default App
