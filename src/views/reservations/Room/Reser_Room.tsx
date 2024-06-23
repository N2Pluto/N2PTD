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
import RoomCard from './RoomCard'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles({
  highlightText: {
    backgroundColor: 'lightpink',
    padding: '0 4px', // เพิ่มการเติมพื้นที่รอบข้อความสำหรับขอบเขตของสี
    borderRadius: '4px' // ทำให้มีเส้นขอบโค้ง
  }
})

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
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
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
  const [showCard, setShowCard] = useState(false)
  const [showRoomCard, setShowRoomCard] = useState(false)
  const [key, setKey] = React.useState(0)
  const [schoolFilter, setSchoolFilter] = useState(null)
  const [majorFilter, setMajorFilter] = useState(null)
  const [religionFilter, setReligionFilter] = useState(null)

  const HighlightText = ({ children }) => {
    const classes = useStyles()

    return <span className={classes.highlightText}>{children}</span>
  }

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

  const handleClick = roomId => {
    console.log('roomId ฟหกฟหกฟหฟ:', roomId)
    setOpen(prevOpen => ({
      ...prevOpen,
      [roomId]: !prevOpen[roomId]
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

    const parseCommaSeparatedValues = str => str.split(',').map(s => s.trim())

    let roomMatches = []

    const filteredRooms = dormitoryRoom.filter(room => {
      if (!room || !room.room_id) {
        console.error('Invalid room:', room)
        return false
      }

      const roomId = room.room_id.toString().trim()

      const roomReservations = reservationArray.filter(
        reservationArrayItem =>
          Array.isArray(reservationArrayItem) &&
          reservationArrayItem.some(reservation => reservation.Reservation_Info?.room_id?.toString().trim() === roomId)
      )

      let matchCount = 0
      let matchMajorCount = 0
      let matchReligionCount = 0
      let matchActivityCount = 0
      let matchRedflagCount = 0
      let matchSleepCount = 0
      let matchingActivities = new Set()
      let matchingRedflags = new Set()

      roomReservations.forEach(reservationArrayItem =>
        reservationArrayItem.forEach(reservation => {
          const reservationBedId = reservation.Reservation_Info?.bed_id?.toString().trim()

          console.log(`Room ID: ${roomId}, Bed ID : ${reservationBedId}`)

          if (userSchoolReq) {
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
            if (match) matchCount++
            console.log(
              `สำนักผู้ใช้ที่จองแล้ว: ${reservation.Users_Info?.school}, ผู้ใช้: ${userSchool}, Match: ${match}, userSchoolReq: ${userSchoolReq}`
            )
          }

          if (userMajorReq) {
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
            if (match) matchMajorCount++
            console.log(
              `หลักสูตรผู้ใช้ที่จองแล้ว: ${reservation.Users_Info?.major}, ผู้ใช้: ${userMajor}, Match: ${match}, userMajorReq: ${userMajorReq}`
            )
          }

          if (userReligionReq) {
            let match = false
            switch (userReligionReq) {
              case 'find roommates who have the same religion':
                match = reservation.Users_Info?.religion === userReligion
                break
              case 'find roommates from any religion':
                match = reservation.Users_Info?.religion !== userReligion
                break
              case 'find all religion':
                match = true
                break
            }
            if (match) matchReligionCount++
            console.log(
              `ศาสนาผู้ใช้ที่จองแล้ว: ${reservation.Users_Info?.religion}, ผู้ใช้: ${userReligion}, Match: ${match}, userReligionReq: ${userReligionReq}`
            )
          }

          if (userActivityReq) {
            const userActivities = parseCommaSeparatedValues(userActivityReq)
            const reservationActivities = reservation.Users_Req?.activity
              ? parseCommaSeparatedValues(reservation.Users_Req.activity)
              : []
            const currentMatchingActivities = userActivities.filter(activity =>
              reservationActivities.includes(activity)
            )
            if (currentMatchingActivities.length > 0) {
              matchActivityCount += currentMatchingActivities.length
              currentMatchingActivities.forEach(activity => matchingActivities.add(activity))
              console.log(
                `กิจกรรมผู้ใช้: ${userActivities}, กิจของผู้ใช้ที่จองแล้ว: ${reservationActivities}, Matching Activities: ${currentMatchingActivities}`
              )
            }
          }

          if (userRedflagReq) {
            const userRedflags = parseCommaSeparatedValues(userRedflagReq)
            const reservationRedflags = reservation.Users_Req?.filter_redflag
              ? parseCommaSeparatedValues(reservation.Users_Req.filter_redflag)
              : []
            const currentMatchingRedflags = userRedflags.filter(redflag => reservationRedflags.includes(redflag))
            if (currentMatchingRedflags.length > 0) {
              matchRedflagCount += currentMatchingRedflags.length
              currentMatchingRedflags.forEach(redflag => matchingRedflags.add(redflag))
              console.log(
                `สิ่งที่ไม่ชอบผู้ใช้: ${userRedflags}, สิ่งที่ไม่ชอบผู้ใช้ที่จองแล้ว: ${reservationRedflags}, Matching Redflags: ${currentMatchingRedflags}`
              )
            }
          }

          if (userSleepReq) {
            const match = reservation.Users_Req?.sleep === userSleepReq
            if (match) matchSleepCount++
            console.log(
              `การนอนผู้ใช้: ${userSleepReq}, การนอนผู้ใช้ที่จองแล้ว: ${reservation.Users_Req?.sleep}, Match: ${match}`
            )
          }
        })
      )
      console.log('matchCount:', matchCount)
      console.log('matchMajorCount:', matchMajorCount)
      console.log('matchReligionCount:', matchReligionCount)
      console.log('matchActivityCount:', matchActivityCount)
      console.log('matchRedflagCount:', matchRedflagCount)
      console.log('matchSleepCount:', matchSleepCount)

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
        scoreSchool: matchCount,
        scoreMajor: matchMajorCount,
        scoreReligion: matchReligionCount,
        scoreActivity: matchActivityCount,
        scoreRedflag: matchRedflagCount,
        scoreSleep: matchSleepCount,
        totalMatches: 0,
        matchActivityEachRoom: Array.from(matchingActivities).join(' ,  '),
        matchRedflagEachRoom: Array.from(matchingRedflags).join(' ,  ')
      })

      return true
    })

    roomMatches = roomMatches.map(room => {
      let totalMatches = 0
      if (selectedOptions.includes('School')) totalMatches += room.scoreSchool
      if (selectedOptions.includes('Major')) totalMatches += room.scoreMajor
      if (selectedOptions.includes('Religion')) totalMatches += room.scoreReligion
      if (selectedOptions.includes('Activity')) totalMatches += room.scoreActivity
      if (selectedOptions.includes('Redflag')) totalMatches += room.scoreRedflag
      if (selectedOptions.includes('Sleep')) totalMatches += room.scoreSleep

      return { ...room, totalMatches }
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
            totalMatches: roomInTop3.totalMatches,
            roomMatchesInfo: (reservationData.get(room.room_id) || []).map(reservation => {
              const matches = {
                school: false,
                major: false,
                matchActivityEachRoom: roomInTop3.matchActivityEachRoom,
                matchRedflagEachRoom: roomInTop3.matchRedflagEachRoom,
                redflag: false,
                sleep: false
              }

              if (userSchoolReq) {
                matches.school =
                  userSchoolReq === 'find all school' ||
                  (userSchoolReq === 'find roommates who attend the same school' &&
                    reservation.Users_Info?.school === userSchool) ||
                  (userSchoolReq === 'find roommates from any school' && reservation.Users_Info?.school !== userSchool)
              }

              if (userMajorReq) {
                matches.major =
                  userMajorReq === 'find all major' ||
                  (userMajorReq === 'find roommates who study the same major' &&
                    reservation.Users_Info?.major === userMajor) ||
                  (userMajorReq === 'find roommates from any major' && reservation.Users_Info?.major !== userMajor)
              }

              if (userReligionReq) {
                matches.religion =
                  userReligionReq === 'find all religion' ||
                  (userReligionReq === 'find roommates who have the same religion' &&
                    reservation.Users_Info?.religion === userReligion) ||
                  (userReligionReq === 'find roommates from any religion' &&
                    reservation.Users_Info?.religion !== userReligion)
              }

              if (userActivityReq) {
                const userActivities = parseCommaSeparatedValues(userActivityReq)
                const reservationActivities = reservation.Users_Req?.activity
                  ? parseCommaSeparatedValues(reservation.Users_Req.activity)
                  : []
                matches.activity = userActivities.some(activity => reservationActivities.includes(activity))
              }

              if (userRedflagReq) {
                const userRedflags = parseCommaSeparatedValues(userRedflagReq)
                const reservationRedflags = reservation.Users_Req?.filter_redflag
                  ? parseCommaSeparatedValues(reservation.Users_Req.filter_redflag)
                  : []
                matches.redflag = userRedflags.some(redflag => reservationRedflags.includes(redflag))
              }

              if (userSleepReq) {
                matches.sleep = reservation.Users_Req?.sleep === userSleepReq
              }

              return { reservation, matches }
            })
          }
        }
        return null
      })
      .filter(room => room !== null)
      .sort((a, b) => {
        const aIndex = top3RoomIds.findIndex(topRoom => topRoom.roomId === a.room_id.toString())
        const bIndex = top3RoomIds.findIndex(topRoom => topRoom.roomId === b.room_id.toString())

        return aIndex - bIndex
      })

    console.log('finalFilteredRooms:', finalFilteredRooms)

    setDormitoryRoom(finalFilteredRooms)
    setFinalFilteredRooms(finalFilteredRooms)
    console.log('finalFilteredRooms:', finalFilteredRooms)
    setShowCard(true)
    setShowRoomCard(true)
    setKey(prevKey => prevKey + 1)
  }

  // This useState and other related code should remain unchanged
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedOptions, setSelectedOptions] = useState([
    'School',
    'Major',
    'Religion',
    'Activity',
    'Redflag',
    'Sleep'
  ])

  const handleClickMatchBy = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleToggle = option => {
    setSelectedOptions(prevSelectedOptions => {
      const currentIndex = prevSelectedOptions.indexOf(option)
      const newSelectedOptions = [...prevSelectedOptions]

      if (currentIndex === -1) {
        newSelectedOptions.push(option)
      } else {
        newSelectedOptions.splice(currentIndex, 1)
      }

      return newSelectedOptions
    })
  }

  useEffect(() => {
    handleDialogOpen() // เรียกใช้งานเมื่อคอมโพเนนต์โหลดเสร็จ
  }, []) // ใส่เป็นอาร์เรย์ว่างเพื่อให้เรียกใช้เพียงครั้งเดียวหลังจากคอมโพเนนต์โหลดเสร็จ

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
              <Button variant='contained' onClick={handleDialogOpen}>
                Filter Room
              </Button>
              <RoomFilterDialog
                disableScrollLock={true}
                open={dialogOpen}
                onClose={handleDialogClose}
                bedAvailableFilter={bedAvailableFilter}
                setBedAvailableFilter={setBedAvailableFilter}
                floorFilter={floorFilter}
                setFloorFilter={setFloorFilter}
                schoolFilter={schoolFilter}
                setSchoolFilter={setSchoolFilter}
                majorFilter={majorFilter}
                setMajorFilter={setMajorFilter}
                religionFilter={religionFilter}
                setReligionFilter={setReligionFilter}
              />
            </div>
          </CardContent>
        </Card>
      </Grid>
      <Box sx={{ display: 'flex', pb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', pl: 3 }}>
          <Button variant='contained' onClick={handleSmartReservation}>
            MATCHING ROOM
          </Button>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', pl: 3 }}>
          <Button variant='contained' onClick={handleRefresh}>
            Refresh Real-Time
          </Button>
        </Box>
      </Box>
      {showRoomCard && (
        <Box sx={{ height: '325px', width: '100%', overflow: 'hidden', marginBottom: '30px', marginTop: '30px' }}>
          <Box style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-5px' }}>
            <Button onClick={handleClickMatchBy}>Match By</Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              {['School', 'Major', 'Religion', 'Activity', 'Redflag', 'Sleep'].map(option => (
                <MenuItem key={option} onClick={() => handleToggle(option)}>
                  <Checkbox checked={selectedOptions.indexOf(option) !== -1} />
                  <ListItemText primary={option} />
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <RoomCard key={key} showCard={showCard} finalFilteredRooms={finalFilteredRooms} />
        </Box>
      )}
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
                .filter(room => {
                  if (schoolFilter === null) return true
                  if (schoolFilter === 0) {
                    const reservations = reservationData.get(room.room_id) || []
                    return reservations.some(
                      reservation => profileData?.userInfoData?.school === reservation.Users_Info?.school
                    )
                  }
                  if (schoolFilter === 1) {
                    const reservations = reservationData.get(room.room_id) || []
                    return reservations.some(
                      reservation => profileData?.userInfoData?.school !== reservation.Users_Info?.school
                    )
                  }
                  return true
                })
                .filter(room => {
                  if (majorFilter === null) return true
                  if (majorFilter === 0) {
                    const reservations = reservationData.get(room.room_id) || []
                    return reservations.some(
                      reservation => profileData?.userInfoData?.major === reservation.Users_Info?.major
                    )
                  }
                  if (majorFilter === 1) {
                    const reservations = reservationData.get(room.room_id) || []
                    return reservations.some(
                      reservation => profileData?.userInfoData?.major !== reservation.Users_Info?.major
                    )
                  }
                  return true
                })
                .filter(room => {
                  if (religionFilter === null) return true
                  if (religionFilter === 0) {
                    const reservations = reservationData.get(room.room_id) || []
                    return reservations.some(
                      reservation => profileData?.userInfoData?.religion === reservation.Users_Info?.religion
                    )
                  }
                  if (religionFilter === 1) {
                    const reservations = reservationData.get(room.room_id) || []
                    return reservations.some(
                      reservation => profileData?.userInfoData?.religion !== reservation.Users_Info?.religion
                    )
                  }
                  return true
                })
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
                              <Button
                                onClick={() => handleReservation(room.room_id)}
                                variant='contained'
                                style={{ color: 'white' }}
                              >
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
                        <Collapse in={open[room.room_id]} unmountOnExit>
                          <CardContent sx={{ margin: -5 }}>
                            {(reservationData.get(room.room_id) || []).map((reservation, index) => {
                              const matchingRoom = finalFilteredRooms.find(r => r.room_id === room.room_id)
                              const matchInfo = matchingRoom ? matchingRoom.roomMatchesInfo[index]?.matches : null

                              const isMatch = field => matchInfo && matchInfo[field]

                              return (
                                <Card sx={{ margin: 3 }} key={index}>
                                  <CardContent sx={{ mt: -5, mb: -5 }}>
                                    <Typography variant='body1' gutterBottom component='div'>
                                      <Typography variant='h6'>{`BED ${index + 1}`}</Typography>
                                    </Typography>
                                    <Grid container spacing={2}>
                                      <Grid item xs={12}>
                                        <Box display='inline-flex' alignItems='center'>
                                          <img
                                            src='https://img5.pic.in.th/file/secure-sv1/school_2602414.png'
                                            alt='School Icon'
                                            style={{ width: '24px', height: '24px' }}
                                          />
                                          <Typography variant='body2'>
                                            :{' '}
                                            {isMatch('school') ? (
                                              <HighlightText>{reservation.Users_Info?.school || 'N/A'}</HighlightText>
                                            ) : (
                                              reservation.Users_Info?.school || 'N/A'
                                            )}
                                          </Typography>
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Box display='inline-flex' alignItems='center'>
                                          <img
                                            src='https://img5.pic.in.th/file/secure-sv1/graduate_401672.png'
                                            alt='Major Icon'
                                            style={{ width: '24px', height: '24px' }}
                                          />
                                          <Typography variant='body2'>
                                            :{' '}
                                            {isMatch('major') ? (
                                              <HighlightText>{reservation.Users_Info?.major || 'N/A'}</HighlightText>
                                            ) : (
                                              reservation.Users_Info?.major || 'N/A'
                                            )}
                                          </Typography>
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Box display='inline-flex' alignItems='center'>
                                          <img
                                            src='https://img5.pic.in.th/file/secure-sv1/religion_9311967.png'
                                            alt='Religion Icon'
                                            style={{ width: '24px', height: '24px' }}
                                          />
                                          <Typography variant='body2'>
                                            :{' '}
                                            {isMatch('religion') ? (
                                              <HighlightText>{reservation.Users_Info?.religion || 'N/A'}</HighlightText>
                                            ) : (
                                              reservation.Users_Info?.religion || 'N/A'
                                            )}
                                          </Typography>
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Box display='inline-flex' alignItems='center'>
                                          <img
                                            src='https://img5.pic.in.th/file/secure-sv1/time-management_2027497.png'
                                            alt='Activity Icon'
                                            style={{ width: '24px', height: '24px' }}
                                          />
                                          <Typography variant='body2'>
                                            :{' '}
                                            {isMatch('activity')
                                              ? reservation.Users_Req?.activity
                                                  .split(',')
                                                  .map((activity, index) =>
                                                    matchInfo.matchActivityEachRoom.includes(activity.trim()) ? (
                                                      <HighlightText key={index}>{activity}</HighlightText>
                                                    ) : (
                                                      activity
                                                    )
                                                  )
                                                  .reduce(
                                                    (prev, curr, index) => [prev, index > 0 ? ',' : '', ' ', curr],
                                                    []
                                                  )
                                              : reservation.Users_Req?.activity || 'N/A'}
                                          </Typography>
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Box display='inline-flex' alignItems='center'>
                                          <img
                                            src='https://img5.pic.in.th/file/secure-sv1/flag_1452046.png'
                                            alt='Redflag Icon'
                                            style={{ width: '24px', height: '24px' }}
                                          />
                                          <Typography variant='body2'>
                                            :{' '}
                                            {isMatch('redflag')
                                              ? reservation.Users_Req?.filter_redflag
                                                  .split(',')
                                                  .map((redflag, index) =>
                                                    matchInfo.matchRedflagEachRoom.includes(redflag.trim()) ? (
                                                      <HighlightText key={index}>{redflag}</HighlightText>
                                                    ) : (
                                                      redflag
                                                    )
                                                  )
                                                  .reduce(
                                                    (prev, curr, index) => [prev, index > 0 ? ',' : '', ' ', curr],
                                                    []
                                                  )
                                              : reservation.Users_Req?.filter_redflag || 'N/A'}
                                          </Typography>
                                        </Box>
                                      </Grid>
                                      <Grid item xs={12}>
                                        <Box display='inline-flex' alignItems='center'>
                                          <img
                                            src='https://img5.pic.in.th/file/secure-sv1/bed-time_12178656.png'
                                            alt='Sleep Icon'
                                            style={{ width: '24px', height: '24px' }}
                                          />
                                          <Typography variant='body2'>
                                            :{' '}
                                            {isMatch('sleep') ? (
                                              <HighlightText>{reservation.Users_Req?.sleep || 'N/A'}</HighlightText>
                                            ) : (
                                              reservation.Users_Req?.sleep || 'N/A'
                                            )}
                                          </Typography>
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </CardContent>
                                </Card>
                              )
                            })}
                          </CardContent>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
                .concat(
                  dormitoryRoom
                    .filter(room => bedAvailableFilter === null || room.bed_available === bedAvailableFilter)
                    .filter(room => floorFilter === null || mapToFloorCategory(room.room_number) === floorFilter)
                    .filter(room => {
                      if (schoolFilter === null) return true
                      if (schoolFilter === 0) {
                        const reservations = reservationData.get(room.room_id) || []
                        return reservations.some(
                          reservation => profileData?.userInfoData?.school === reservation.Users_Info?.school
                        )
                      }
                      if (schoolFilter === 1) {
                        const reservations = reservationData.get(room.room_id) || []
                        return reservations.some(
                          reservation => profileData?.userInfoData?.school !== reservation.Users_Info?.school
                        )
                      }
                      return true
                    })
                    .filter(room => {
                      if (majorFilter === null) return true
                      if (majorFilter === 0) {
                        const reservations = reservationData.get(room.room_id) || []
                        return reservations.some(
                          reservation => profileData?.userInfoData?.major === reservation.Users_Info?.major
                        )
                      }
                      if (majorFilter === 1) {
                        const reservations = reservationData.get(room.room_id) || []
                        return reservations.some(
                          reservation => profileData?.userInfoData?.major !== reservation.Users_Info?.major
                        )
                      }
                      return true
                    })
                    .filter(room => {
                      if (religionFilter === null) return true
                      if (religionFilter === 0) {
                        const reservations = reservationData.get(room.room_id) || []
                        return reservations.some(
                          reservation => profileData?.userInfoData?.religion === reservation.Users_Info?.religion
                        )
                      }
                      if (religionFilter === 1) {
                        const reservations = reservationData.get(room.room_id) || []

                        return reservations.some(
                          reservation => profileData?.userInfoData?.religion !== reservation.Users_Info?.religion
                        )
                      }

                      return true
                    }).length === 0
                    ? [
                        <TableRow>
                          <TableCell colSpan={6} align='center'>
                            <img
                              src='https://qjtblnjatlesdldxagow.supabase.co/storage/v1/object/public/icon/folder_12478062.png'
                              alt='No Rooms Found'
                              style={{ maxWidth: '150px' }} // Adjust the image size here
                            />
                            <Typography variant='h6' component='div'>
                              {' '}
                              The filter you have selected did not match any rooms. Please select a different filter to
                              find the room you desire.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ]
                    : []
                )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  )
}

export default ReservationRoomTest
