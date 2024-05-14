// src/components/FacebookPost.tsx
import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '@mui/material'

const FacebookPost: React.FC = () => {
  const [post, setPost] = useState<any[]>([])

  const fbPostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetch('/api/readPost').then(res => res.json())

        setPost(data)
      } catch (error) {
        console.error('Error fetching dormitory building data:', error)
      }
    }

    fetchData()
  }, [])

  console.log(post)



  const data = [
    {
      id: 1,
      href: 'https://www.facebook.com/WUShopWalailak/posts/pfbid02d2sbbx9siQWivFZ54aj588cBbUv2uBXEBLYMjCbNkzn6v3QkCqft4eVQQdgTJkZDl'
    },
    {
      id: 2,
      href: 'https://www.facebook.com/WUShopWalailak/posts/pfbid0QmUmUzi7kRRqGPRyEGurRRBYytxhTNMwwtyJSjmKhVnU9mKn4DHufY62KPm2mjcPl'
    }
  ]


  useEffect(() => {
    if (window.FB) {
      window.FB.XFBML.parse()
    } else {
      const script = document.createElement('script')
      script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v11.0'
      script.async = true
      script.defer = true
      script.onload = () => {
        if (window.FB) {
          window.FB.XFBML.parse()
        }
      }
      document.body.appendChild(script)
    }
  }, [])

  return (
    <>
      {data.map(item => (
        <Card sx={{ maxWidth: 1200, marginBottom: 2 }} key={item.id}>
          <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
            <div ref={fbPostRef} className='fb-post' data-href={item.href} data-width='800' data-show-text='true'>
              <blockquote cite={item.href} className='fb-xfbml-parse-ignore'></blockquote>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

export default FacebookPost
