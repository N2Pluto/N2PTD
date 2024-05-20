import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Collapse, Grid, IconButton, Paper, Table, TableCell, TableContainer, TableHead } from '@mui/material'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import { auto } from '@popperjs/core'
import { userStore } from 'src/stores/userStore'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import PersonIcon from '@mui/icons-material/Person'
import Tooltip from '@mui/material/Tooltip'
import * as React from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import SchoolIcon from '@mui/icons-material/School'
import MosqueIcon from '@mui/icons-material/Mosque'
import PoolIcon from '@mui/icons-material/Pool'
import DangerousIcon from '@mui/icons-material/Dangerous'
import HotelIcon from '@mui/icons-material/Hotel'
import ConstructionIcon from '@mui/icons-material/Construction'
import SuccessฺฺBarRoom from './component'
import RoomFilterDialog from './RoomFilterDialog'
import SmartReservationDialog from './SmartReservationDialog'

interface Column {
  id: 'details' | 'room' | 'code' | 'reserve' | 'bedstatus'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'details', label: 'DETAILS', minWidth: 30 },
  { id: 'room', label: 'room', minWidth: 30, align: 'center' },
  { id: 'code', label: 'bed capacity', minWidth: 150, align: 'center' },
  {
    id: 'bedstatus',
    label: 'bed status',
    minWidth: 170,
    align: 'center'
  },
  {
    id: 'reserve',
    label: 'reserve',
    minWidth: 170,
    align: 'center',
    format: (value: number) => value.toFixed(2)
  }
]

const ReservationRoomTest = () => {
  const router = useRouter()
  const [dormitoryBuilding, setDormitoryBuilding] = useState(null)
  const [dormitoryRoom, setDormitoryRoom] = useState([])
  const [dormitoryRoomStatus, setDormitoryRoomStatus] = useState([])
  const userStoreInstance = userStore()
  const { setUser } = userStoreInstance
  const [loading, setLoading] = useState(false)
  const [reservationData, setReservationData] = useState<Map<string, any[]>>(new Map())
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [bedAvailableFilter, setBedAvailableFilter] = useState<number | null>(null)
  const [floorFilter, setFloorFilter] = useState<number | null>(null)
  const [profileData, setProfileData] = useState(null)
  const { user } = userStore()
  const [open, setOpen] = React.useState(false)
  const [openDialog, setOpenDialog] = React.useState(false)
  const [finalFilteredRooms, setFinalFilteredRooms] = useState([])

  const handleDialogOpen = () => {
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/profile/fetchUserProfile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: user.user_id }) // ส่ง user_id ไปยัง API
        })
        const data = await response.json()
        setProfileData(data) // เซ็ตข้อมูลผู้ใช้ที่ได้รับจาก API
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }

    if (user?.user_id) {
      fetchUserProfile()
      console.log('usasdsader:', profileData)
    }
  }, [user])

  const handleClick = id => {
    setOpen(prevOpen => ({
      ...prevOpen,
      [id]: !prevOpen[id]
    }))
  }

  useEffect(() => {
    const fetchReservationData = async (roomId: string) => {
      console.log('roomId:', roomId)
      try {
        setLoading(true)
        const response = await fetch(`/api/reservation/checkUserReservationBoom?room_id=${roomId}`)
        const data = await response.json()
        console.log('checkUserReservationBoom?room:', data)
        setReservationData(prevData => {
          const newData = new Map(prevData)
          newData.set(roomId, data)

          return newData
        })
        setLoading(false)
      } catch (error) {
        console.error('Error fetching reservation data:', error)
        setLoading(false)
      }
    }

    dormitoryRoom.forEach(room => {
      fetchReservationData(room.room_id)
    })
  }, [dormitoryRoom])

  useEffect(() => {
    const fetchDataRoomStatus = async () => {
      try {
        const dorm_id = router.query.id // Add the missing declaration for dorm_id
        const response = await fetch(`/api/reservation/checkStatusRoom?dorm_id=${dorm_id}`)
        const data = await response.json()
        setDormitoryRoomStatus(data)
        console.log('data bed capacity:', data)
      } catch (error) {
        console.error('Error fetching room status:', error)
      }
    }
    const fetchDataAndUpdateStatus = async () => {
      await fetchDataRoomStatus() // Fetch the updated data
    }

    fetchDataAndUpdateStatus()

    const intervalId = setInterval(fetchDataAndUpdateStatus, 500000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (router.query.id) {
      Promise.all([fetchData()])
    }
  }, [router.query.id])

  const fetchData = async () => {
    console.log('router.query.id:', router.query.id)
    const { data } = await fetch(`/api/building/${router.query.id}`).then(res => res.json())
    setDormitoryBuilding(data)
  }

  const fetchDataRoomByDormID = async () => {
    console.log('router.query.id:', router.query.id)
    const { data } = await fetch(`/api/room/building/${router.query.id}`).then(res => res.json())
    setDormitoryRoom(data)

    // Call the new API for each room
    if (data) {
      data.forEach(async room => {
        const response = await fetch('/api/reservation/room/checkRoomSize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ dorm_id: router.query.id, room_id: room.room_id })
        })
        const result = await response.json()
        console.log('checkBedStatus result:', result)
      })
    }
  }

  const fetchDataAndUpdateStatusRoom = async () => {
    await fetchDataRoomByDormID() // Fetch the updated data
  }

  useEffect(() => {
    fetchDataAndUpdateStatusRoom()

    const intervalId = setInterval(fetchDataAndUpdateStatusRoom, 30000)

    return () => clearInterval(intervalId)
  }, [])

  const handleRefresh = () => {
    fetchDataAndUpdateStatusRoom()
  }

  const handleReservation = (room_id: string) => {
    console.log('Reservation ROOM :', room_id)
    setUser({ ...userStoreInstance.user, room_id }) // Store room_id in userStore
    console.log('user:', userStoreInstance.user)
    router.push(`/reservation/bed/${room_id}`)
  }

  const handleDialogToggle = () => {
    setDialogOpen(!dialogOpen)
  }

  const mapToFloorCategory = (floorNumber: number): number => {
    if (floorNumber >= 101 && floorNumber <= 105) {
      return 1
    } else if (floorNumber >= 201 && floorNumber <= 205) {
      return 2
    } else if (floorNumber >= 301 && floorNumber <= 305) {
      return 3
    } else if (floorNumber >= 401 && floorNumber <= 405) {
      return 4
    } else {
      return -1
    }
  }

  const handleSmartReservation = () => {
    const userSchoolReq = profileData?.userReqData?.filter_school
    const userMajorReq = profileData?.userReqData?.filter_major
    const userReligionReq = profileData?.userReqData?.filter_religion
    const userActivityReq = profileData?.userReqData?.activity
    const userRedflagReq = profileData?.userReqData?.filter_redflag
    const userSleepReq = profileData?.userReqData?.sleep

    const userSchool = profileData?.userInfoData?.school
    const userMajor = profileData?.userInfoData?.major
    const userReligion = profileData?.userInfoData?.religion

    if (!(reservationData instanceof Map)) {
      console.error('reservationData is not a Map:', reservationData)

      return
    }

    const reservationArray = Array.from(reservationData.values())

    reservationArray.forEach((data, index) => {
      if (Array.isArray(data) && data.length !== 0) {
        console.log(`reservationData at index ${index}:`, data)
      }
    })

    console.log('dormitoryRoom:', dormitoryRoom)

    const parseCommaSeparatedValues = str => str.split(',').map(s => s.trim())
    let roomMatches = []
    const filteredRooms = dormitoryRoom.filter(room => {
      console.log('Checking room:', room)
      if (!room || !room.room_id) {
        console.error('Invalid room:', room)

        return false
      }

      const roomId = room.room_id.toString().trim()

      const roomReservations = reservationArray.filter(
        reservationArrayItem =>
          Array.isArray(reservationArrayItem) &&
          reservationArrayItem.some(reservation => {
            const reservationRoomId = reservation.Reservation_Info?.room_id?.toString().trim()
            const reservationBedId = reservation.Reservation_Info?.bed_id?.toString().trim()

            const isMatch = reservationRoomId === roomId
            if (isMatch) {
              console.log(`Room ID: ${roomId}, Bed ID : ${reservationBedId}`)
            }

            return isMatch
          })
      )

      console.log(`roomReservations:`, roomReservations)
      let matchCount = 0
      const matchesSchool = userSchoolReq
        ? roomReservations.forEach(reservationArrayItem =>
            reservationArrayItem.forEach(reservation => {
              let match = false
              switch (userSchoolReq) {
                case 'find roommates who attend the same school':
                  match = reservation.Users_Info?.school === userSchool
                  break
                case 'find roommates from any school':
                  match = reservation.Users_Info?.school !== userSchool
                  break
                case 'find all school':
                  match = true
                  break
              }
              if (match) {
                matchCount++ // Increment counter if match is true
                const reservationBedId = reservation.Reservation_Info?.bed_id?.toString().trim()
                console.log(
                  `Room ID: ${roomId}, Bed ID : ${reservationBedId}, สำนักผู้ใช้ที่จองแล้ว: ${reservation.Users_Info?.school}, ผู้ใช้: ${userSchool}, Match: ${match}, userSchoolReq: ${userSchoolReq}`
                )
              }

              return match
            })
          )
        : true

      let matchMajorCount = 0
      const matchesMajor = userMajorReq
        ? roomReservations.forEach(reservationArrayItem =>
            reservationArrayItem.forEach(reservation => {
              let match = false
              switch (userMajorReq) {
                case 'find roommates who study the same major':
                  match = reservation.Users_Info?.major === userMajor
                  break
                case 'find roommates from any major':
                  match = reservation.Users_Info?.major !== userMajor
                  break
                case 'find all major':
                  match = true
                  break
              }
              if (match) {
                matchMajorCount++ // Increment counter if match is true
                const reservationBedId = reservation.Reservation_Info?.bed_id?.toString().trim()
                console.log(
                  `Room ID: ${roomId}, Bed ID : ${reservationBedId}, หลักสูตรผู้ใช้ที่จองแล้ว: ${reservation.Users_Info?.major}, ผู้ใช้: ${userMajor}, Match: ${match}, userMajorReq: ${userMajorReq}`
                )
              }

              return match
            })
          )
        : true

      let matchReligionCount = 0 // Initialize counter

      const matchesReligion = userReligionReq
        ? roomReservations.forEach(reservationArrayItem =>
            reservationArrayItem.forEach(reservation => {
              let match = false
              switch (userReligionReq) {
                case 'find roommates who attend the same religion':
                  match = reservation.Users_Info?.religion === userReligion
                  break
                case 'find roommates from any religion':
                  match = reservation.Users_Info?.religion !== userReligion
                  break
                case 'find all religion':
                  match = true
                  break
              }
              if (match) {
                matchReligionCount++ // Increment counter if match is true
                const reservationBedId = reservation.Reservation_Info?.bed_id?.toString().trim()
                console.log(
                  `Room ID: ${roomId}, Bed ID : ${reservationBedId}, ศาสนาผู้ใช้ที่จองแล้ว: ${reservation.Users_Info?.religion}, ผู้ใช้: ${userReligion}, Match: ${match}, userReligionReq: ${userReligionReq}`
                )
              }

              return match
            })
          )
        : true

      let matchActivityCount = 0 // Initialize counter
      let matchingActivities = []

      const matchesActivity = userActivityReq
        ? roomReservations.map(reservationArrayItem =>
            reservationArrayItem.filter(reservation => {
              const userActivities = parseCommaSeparatedValues(userActivityReq)
              const reservationActivities = reservation.Users_Req?.activity
                ? parseCommaSeparatedValues(reservation.Users_Req.activity)
                : []

              const reservationBedId = reservation.Reservation_Info?.bed_id?.toString().trim()

              matchingActivities = userActivities.filter(activity => reservationActivities.includes(activity))
              const match = matchingActivities.length > 0
              console.log(`Bed ID: ${reservationBedId} , Matching Activities: ${matchingActivities.join(', ')} `)

              if (match) {
                matchActivityCount++ // Increment counter if match is true
              }
              console.log(
                `Room ID: ${roomId}, Bed ID : ${reservationBedId}, ผู้ใช้: ${userActivityReq}, Match: ${match}`
              )

              return match
            })
          )
        : true

      let matchRedflagCount = 0 // Initialize counter
      let matchingRedflags = []

      const matchesRedflag = userRedflagReq
        ? roomReservations.map(reservationArrayItem =>
            reservationArrayItem.filter(reservation => {
              const userRedflags = parseCommaSeparatedValues(userRedflagReq)
              const reservationRedflags = reservation.Users_Req?.filter_redflag
                ? parseCommaSeparatedValues(reservation.Users_Req.filter_redflag)
                : []

              const reservationBedId = reservation.Reservation_Info?.bed_id?.toString().trim()

              matchingRedflags = userRedflags.filter(redflag => reservationRedflags.includes(redflag))
              const match = matchingRedflags.length > 0
              console.log(`Bed ID: ${reservationBedId} , Matching Redflags: ${matchingRedflags.join(', ')} `)

              if (match) {
                matchRedflagCount++ // Increment counter if match is true
              }
              console.log(
                `Room ID: ${roomId}, Bed ID : ${reservationBedId}, ผู้ใช้: ${userRedflagReq}, Match: ${match}`
              )

              return match
            })
          )
        : true

      let matchSleepCount = 0 // Initialize counter

      const matchesSleep = userSleepReq
        ? roomReservations.forEach(reservationArrayItem =>
            reservationArrayItem.forEach(reservation => {
              const match = reservation.Users_Req?.sleep === userSleepReq
              if (match) {
                matchSleepCount++ // Increment counter if match is true
              }
              const reservationBedId = reservation.Reservation_Info?.bed_id?.toString().trim()
              console.log(
                `Room ID: ${roomId} , Bed ID : ${reservationBedId}, ผู้ใช้: ${userSleepReq}, Match: ${match} , เวลานอนของผู้ใช้ที่จองแล้ว: ${reservation.Users_Req?.sleep} `
              )

              return match
            })
          )
        : true

      console.log(
        `ห้อง: ${roomId} , matchesSchool count: ${matchCount} , matchesMajor count: ${matchMajorCount} , matchesReligion count: ${matchReligionCount} , matchesActivity count: ${matchActivityCount} , matchesRedflag count: ${matchRedflagCount} , matchesSleep count: ${matchSleepCount}  `
      )

      const matchInfo = matchCount + matchMajorCount + matchReligionCount
      const matchReq = matchActivityCount + matchRedflagCount + matchSleepCount

      const scoreSchool = matchCount
      const scoreMajor = matchMajorCount
      const scoreReligion = matchReligionCount
      const scoreActivity = matchActivityCount
      const scoreRedflag = matchRedflagCount
      const scoreSleep = matchSleepCount

      let matchInfoLog = `Total matches Info for room ${roomId}: ${matchInfo}`
      console.log(matchInfoLog)

      let matchReqLog = `Total matches Reqfor room ${roomId}: ${matchReq}`
      console.log(matchReqLog)

      let matchActivityEachRoom = `${matchingActivities.join(', ')}`
      let matchRedflagEachRoom = `${matchingRedflags.join(', ')}`
      console.log(matchActivityEachRoom)
      console.log(matchRedflagEachRoom)

      roomMatches.push({
        roomId,
        userSchoolReq,
        userMajorReq,
        userReligionReq,
        userActivityReq,
        userRedflagReq,
        userSleepReq,
        userSchool,
        userMajor,
        userReligion,
        scoreSchool,
        scoreMajor,
        scoreReligion,
        scoreActivity,
        scoreRedflag,
        scoreSleep,
        matchInfo,
        matchReq,
        totalMatches: scoreSchool + scoreMajor + scoreReligion + scoreActivity + scoreRedflag + scoreSleep,
        matchActivityEachRoom,
        matchRedflagEachRoom
      })

      return matchesSchool && matchesMajor && matchesReligion && matchesActivity && matchesRedflag && matchesSleep
    })

    roomMatches.sort((a, b) => b.totalMatches - a.totalMatches)
    const top3Rooms = roomMatches.slice(0, 3)

    console.log('top3Rooms:', top3Rooms)

    const top3RoomIds = top3Rooms.map(room => ({
      roomId: room.roomId.toString(),
      matchActivityEachRoom: room.matchActivityEachRoom,
      matchRedflagEachRoom: room.matchRedflagEachRoom,
      userSchoolReq: room.userSchoolReq,
      userMajorReq: room.userMajorReq,
      userReligionReq: room.userReligionReq,
      userActivityReq: room.userActivityReq,
      userRedflagReq: room.userRedflagReq,
      userSleepReq: room.userSleepReq,
      userSchool: room.userSchool,
      userMajor: room.userMajor,
      userReligion: room.userReligion,
      matchInfo: room.matchInfo,
      matchReq: room.matchReq,
      scoreSchool: room.scoreSchool,
      scoreMajor: room.scoreMajor,
      scoreReligion: room.scoreReligion,
      scoreActivity: room.scoreActivity,
      scoreRedflag: room.scoreRedflag,
      scoreSleep: room.scoreSleep,
      totalMatches: room.totalMatches
    }))
    console.log('top3RoomIds:', top3RoomIds)
    let finalFilteredRooms = dormitoryRoom
      .map(room => {
        const roomInTop3 = top3RoomIds.find(topRoom => topRoom.roomId === room.room_id.toString())
        if (roomInTop3) {
          return {
            ...room,
            matchActivityEachRoom: roomInTop3.matchActivityEachRoom,
            matchRedflagEachRoom: roomInTop3.matchRedflagEachRoom,
            userSchoolReq: roomInTop3.userSchoolReq,
            userMajorReq: roomInTop3.userMajorReq,
            userReligionReq: roomInTop3.userReligionReq,
            userActivityReq: roomInTop3.userActivityReq,
            userRedflagReq: roomInTop3.userRedflagReq,
            userSleepReq: roomInTop3.userSleepReq,
            userSchool: roomInTop3.userSchool,
            userMajor: roomInTop3.userMajor,
            userReligion: roomInTop3.userReligion,
            scoreSchool: roomInTop3.scoreSchool,
            scoreMajor: roomInTop3.scoreMajor,
            scoreReligion: roomInTop3.scoreReligion,
            scoreActivity: roomInTop3.scoreActivity,
            scoreRedflag: roomInTop3.scoreRedflag,
            scoreSleep: roomInTop3.scoreSleep,
            totalMatches: roomInTop3.totalMatches
          }
        }

        return null
      })
      .filter(room => room !== null)

    console.log('finalFilteredRooms:', finalFilteredRooms)

    // Create an array of room IDs from top3RoomIds
    const top3RoomIdsArray = top3RoomIds.map(room => room.roomId)

    // Sort finalFilteredRooms based on the order of top3RoomIdsArray
    finalFilteredRooms = finalFilteredRooms.sort(
      (a, b) => top3RoomIdsArray.indexOf(a.room_id.toString()) - top3RoomIdsArray.indexOf(b.room_id.toString())
    )

    console.log('Sorted finalFilteredRooms:', finalFilteredRooms)

    setDormitoryRoom(finalFilteredRooms)

    setFinalFilteredRooms(finalFilteredRooms)
    setOpenDialog(true)
  }
  console.log('finalFilteredRooms', finalFilteredRooms)

  return (
    <>
      <SuccessฺฺBarRoom />
      <Grid pb={4}>
        <Card>
          <CardContent>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            ></Box>
            <div>
              <Button onClick={handleDialogOpen}>Filter</Button>
              <RoomFilterDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                bedAvailableFilter={bedAvailableFilter}
                setBedAvailableFilter={setBedAvailableFilter}
                floorFilter={floorFilter}
                setFloorFilter={setFloorFilter}
              />
            </div>
          </CardContent>
        </Card>
      </Grid>
      <Box sx={{ display: 'flex', pb: 3 }}>
        <React.Fragment>
          <Button variant='contained' onClick={handleSmartReservation}>
            MATCHING ROOM
            <Box sx={{ display: 'flex', pr: 3 }}>
              <SmartReservationDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                roomData={finalFilteredRooms}
              />
            </Box>
          </Button>
        </React.Fragment>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', pl: 3 }}>
          <Button variant='contained' onClick={handleRefresh}>
            Refresh Real-Time
          </Button>
        </Box>
      </Box>

      <h1> {dormitoryBuilding?.name}</h1>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: auto }}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dormitoryRoom
                .filter(room => bedAvailableFilter === null || room.bed_available === bedAvailableFilter)
                .filter(room => floorFilter === null || mapToFloorCategory(room.room_number) === floorFilter)
                .map(room => (
                  <React.Fragment key={room.room_id}>
                    <TableRow hover role='checkbox' tabIndex={-1}>
                      <TableCell>
                        <IconButton aria-label='expand row' size='small' onClick={() => handleClick(room.room_id)}>
                          {open[room.room_id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell align='center'>{room.room_number}</TableCell>
                      <TableCell align='center'>
                        {Array.from({ length: room.bed_available }, (_, index) => (
                          <Tooltip title='This bed already reserve.' key={index}>
                            <PersonIcon color='primary' />
                          </Tooltip>
                        ))}

                        {Array.from({ length: room.bed_capacity - room.bed_available }, (_, index) => (
                          <Tooltip title='This bed is available' key={index}>
                            <PersonIcon />
                          </Tooltip>
                        ))}
                      </TableCell>
                      <TableCell align='center'>
                        {room.room_rehearse ? (
                          room.status ? (
                            <CheckIcon />
                          ) : (
                            <CloseIcon color='primary' />
                          )
                        ) : (
                          <ConstructionIcon color='error' />
                        )}
                      </TableCell>
                      <TableCell align='center'>
                        <Box>
                          {room.room_rehearse ? (
                            room.status ? (
                              <Button onClick={() => handleReservation(room.room_id)} variant='contained'>
                                Select
                              </Button>
                            ) : (
                              <Button variant='contained' color='error' disabled>
                                Full
                              </Button>
                            )
                          ) : (
                            <Button variant='contained' color='error' disabled>
                              Closed for maintenance
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open[room.room_id]} timeout='auto' unmountOnExit>
                          {' '}
                          <CardContent sx={{ margin: -5 }}>
                            {(reservationData.get(room.room_id) || []).map((reservation, index) => (
                              <Card sx={{ margin: 3 }} key={index}>
                                <CardContent sx={{ mt: -5, mb: -5 }}>
                                  <Typography variant='body1' gutterBottom component='div'>
                                    {`BED ${index + 1}:`}
                                  </Typography>
                                  <Grid container spacing={6}>
                                    <Grid item xs={12}>
                                      <Grid item xs={12}>
                                        <Box display='inline-flex' alignItems='center'>
                                          <SchoolIcon />
                                          <Typography variant='body2'>: {reservation.Users_Info?.school}</Typography>
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12}>
                                        {' '}
                                        <Box display='inline-flex' alignItems='center'>
                                          <SchoolIcon />
                                          <Typography variant='body2'>: {reservation.Users_Info?.major}</Typography>
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Box display='inline-flex' alignItems='center'>
                                          <MosqueIcon />
                                          <Typography variant='body2'>: {reservation.Users_Info?.religion}</Typography>
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Box display='inline-flex' alignItems='center'>
                                          <PoolIcon />
                                          <Typography variant='body2'>: {reservation.Users_Req?.activity}</Typography>
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Box display='inline-flex' alignItems='center'>
                                          <DangerousIcon />
                                          <Typography variant='body2'>
                                            : {reservation.Users_Req?.filter_redflag}
                                          </Typography>
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Box display='inline-flex' alignItems='center'>
                                          <HotelIcon />
                                          <Typography variant='body2'>: {reservation.Users_Req?.sleep}</Typography>
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </CardContent>
                              </Card>
                            ))}
                          </CardContent>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  )
}

export default ReservationRoomTest
