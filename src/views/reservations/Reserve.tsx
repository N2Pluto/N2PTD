import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Reservation = () => {
  const router = useRouter()
  const [dormitoryBuilding, setDormitoryBuilding] = useState(null)
  const [dormitoryRoom, setDormitoryRoom] = useState([])
  useEffect(() => {
    if (router.query.id) {
      Promise.all([fetchData(), fetchDataRoomByDormID()])
    }
  }, [router.query.id])
  const fetchData = async () => {
    console.log('router.query.id:', router.query.id)
    const { data } = await fetch(`/api/building/${router.query.id}`).then(res => res.json())
    setDormitoryBuilding(data)import { CardContent, Grid } from '@mui/material'
import { Card } from 'mdi-material-ui'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

const Reservation = () => {
  const router = useRouter()
  const [dormitoryBuilding, setDormitoryBuilding] = useState(null)
  const [dormitoryRoom, setDormitoryRoom] = useState([])
  useEffect(() => {
    if (router.query.id) {
    Promise.all([fetchData(), fetchDataRoomByDormID()])
     
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
  }
  console.log('dormitoryBuilding:', dormitoryBuilding)
  console.log('dormitoryRoom:', dormitoryRoom)
  
  return (
    <Card>
      <ApexChartWrapper>
        <Grid>
          <CardContent>
            <h1>Reservation</h1>
            <h2>{dormitoryBuilding?.name}</h2>
            <div>
              {dormitoryRoom.map((room, index) => (
                <div key={index}>
                  <h3>{room.room_number}</h3>
                  <p>Bed Capacity: {room.bed_capacity}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Grid>
      </ApexChartWrapper>
    </Card>
  )
  
}

export default Reservation

  }
  const fetchDataRoomByDormID = async () => {
    console.log('router.query.id:', router.query.id)
    const { data } = await fetch(`/api/room/building/${router.query.id}`).then(res => res.json())
    setDormitoryRoom(data)
  }
  console.log('dormitoryBuilding:', dormitoryBuilding)
  console.log('dormitoryRoom:', dormitoryRoom)

  return (
    
    <div>
      <h1>Reservation</h1>
      <h2>{dormitoryBuilding?.name}</h2>
      <div>
        {dormitoryRoom.map((room, index) => (
          <div key={index}>
            <h3>{room.room_number}</h3>
            <p>Bed Capacity: {room.bed_capacity}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Reservation
