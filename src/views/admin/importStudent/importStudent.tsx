import React, { useState } from 'react'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { useDropzone } from 'react-dropzone'
import MuiAlert from '@mui/material/Alert'

const Alert = props => {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

const ImportStudent = ({ drawerOpen, setDrawerOpen }) => {
  const [file, setFile] = useState(null)
  const [parsedData, setParsedData] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleDrawerClose = () => {
    setDrawerOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFile(null)
    setParsedData([])
    setError('')
  }

  const handleRemoveFile = () => {
    setFile(null)
    setParsedData([])
  }

  const handleImportCSV = async data => {
    try {
      const response = await fetch('/api/admin/student/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        handleDrawerClose()
        setSuccess(true)
      } else {
        throw new Error('Failed to import data.')
      }
    } catch (error) {
      setError('Failed to import data.')
    }
  }

  const onDrop = acceptedFiles => {
    if (acceptedFiles.length) {
      const reader = new FileReader()
      reader.onload = () => {
        const text = reader.result
        const rows = text.split('\n').map(row => row.split(','))
        const headers = rows[0]
        const data = rows.slice(1).map(row => {
          return headers.reduce((acc, header, index) => {
            const value = row[index]
            acc[header.trim()] = value ? value.trim() : ''
            return acc
          }, {})
        })

        const filteredData = data.filter(row => row.student_id && row.name && row.lastname)
        setParsedData(filteredData)
      }
      reader.readAsText(acceptedFiles[0])
      setFile(acceptedFiles[0])
    }
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <Card>
        {/* <CardContent>
          <Box display='flex' justifyContent='flex-end' mb={2}>
            <Button variant='contained' color='primary' onClick={() => setDrawerOpen(true)}>
              Import CSV
            </Button>
          </Box>
        </CardContent> */}

      <Drawer anchor='right' open={drawerOpen} onClose={handleDrawerClose}>
        <Box sx={{ width: '40vw', padding: 4 }}>
          <Typography variant='h5' sx={{ mb: 2 }}>
            Import CSV
          </Typography>

          <Divider sx={{ borderWidth: '1px', mb: 2 }} />

          <Typography variant='body2' sx={{ mb: 2 }}>
            Upload a CSV or TSV file. The first row should be the headers of the table, and your headers should not
            include any special characters other than hyphens ( - ) or underscores ( _ ).
            <br />
            Tip: Datetime columns should be formatted as YYYY-MM-DD HH:mm:ss
          </Typography>

          {!file ? (
            <Grid
              sx={{
                height: '150px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed #ccc',
                borderRadius: 1,
                padding: 4,
                textAlign: 'center',
                cursor: 'pointer',
                mb: 2
              }}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <Typography variant='body1'>
                Drag and drop, or <span style={{ color: '#3f51b5', cursor: 'pointer' }}>browse</span> your files
              </Typography>
            </Grid>
          ) : (
            <Box
              sx={{
                border: '2px dashed #ccc',
                borderRadius: 1,
                padding: 4,
                textAlign: 'center',
                cursor: 'pointer',
                mb: 2,
                height: '150px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography variant='body1'>{file.name}</Typography>
              <Button variant='contained' color='secondary' onClick={handleRemoveFile} sx={{ mt: 2 }}>
                Remove File
              </Button>
            </Box>
          )}

          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {parsedData.length > 0 && (
            <Box sx={{ mt: 4, height: 'auto', overflow: 'auto' }}>
              <Typography variant='h6' sx={{ mb: 2 }}>
                Preview data to be imported
              </Typography>
              <Box
                sx={{
                  height: '400px',
                  overflow: 'auto',
                  border: '1px solid #ccc',
                  padding: 2,
                  borderRadius: 1,
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#fff'
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {Object.keys(parsedData[0]).map(key => (
                        <th
                          key={key}
                          style={{
                            padding: '12px 8px',
                            borderBottom: '1px solid #ccc',
                            borderRight: '1px solid #ccc',
                            backgroundColor: '#f5f5f5',
                            fontWeight: 'bold',
                            textAlign: 'left'
                          }}
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.map((row, index) => (
                      <tr
                        key={index}
                        style={{
                          transition: 'background-color 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}
                      >
                        {Object.values(row).map((value, idx) => (
                          <td
                            key={idx}
                            style={{
                              padding: '8px 8px',
                              borderBottom: '1px solid #eee',
                              borderRight: '1px solid #eee',
                              textAlign: 'left'
                            }}
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </Box>
          )}

          <Divider sx={{ borderWidth: '1px', mt: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant='contained' color='primary' onClick={handleDrawerClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant='contained' color='primary' onClick={() => handleImportCSV(parsedData)} sx={{ mr: 2 }}>
              Import data
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Card>
  )
}

export default ImportStudent
