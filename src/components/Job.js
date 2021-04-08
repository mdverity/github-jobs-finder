import React, { useState } from 'react'
import { Badge, Button, Card, Modal } from 'react-bootstrap'
import ReactMarkdown from 'react-markdown'

// job: {
//   id
//   type
//   url
//   created_at
//   company
//   company_url
//   location
//   title
//   description
//   how_to_apply
//   company_logo
// }

export default function Job({ job }) {
  const [open, setOpen] = useState(false)

  return (
    <Card className='mb-3'>
      <Card.Body>
        <div className='d-flex justify-content-between'>
          <div>
            <Card.Title>
              {job.title} -{' '}
              <span className='text-muted font-weight-light'>
                {job.company}
              </span>
            </Card.Title>
            <Card.Subtitle className='text-muted mb-2'>
              {new Date(job.created_at).toLocaleDateString()}
            </Card.Subtitle>
            <Badge variant='secondary' className='mr-2'>
              {job.type}
            </Badge>
            <Badge variant='secondary'>{job.location}</Badge>
            <div style={{ wordBreak: 'break-all' }}>
              <ReactMarkdown source={job.how_to_apply} />
            </div>
          </div>
          <div>
            <img
              className='d-none d-md-block'
              width='100'
              alt={job.company}
              src={job.company_logo}
            />
          </div>
        </div>
        <Card.Text>
          <Button onClick={() => setOpen((prev) => !prev)} variant='dark'>
            {open ? 'Hide Details' : 'View Details'}
          </Button>
        </Card.Text>
        <Modal
          scrollable
          centered
          show={open}
          onHide={() => setOpen((prev) => !prev)}
          size='xl'
        >
          <Modal.Header closeButton>
            <Modal.Title>{job.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ReactMarkdown source={job.description} />
            <hr />
            <ReactMarkdown source={job.how_to_apply} />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant='secondary'
              onClick={() => setOpen((prev) => !prev)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </Card>
  )
}
