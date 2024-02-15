import { useState } from 'react'
import { useRouter } from 'next/router'

const LoginPage = () => {
  const [email, setEmail] = useState('santipan2546@hotmail.com')
  const [password, setPassword] = useState('12345678')
  const router = useRouter()

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('accessToken', data.accessToken)
        router.push('/Dormitory') // Redirect to /Dormitory page
      } else {
        const errorData = await response.json()
        console.log('Login failed:', errorData.message)
      }
    } catch (error) {
      console.log('Error during login:', error)
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form
        onSubmit={e => {
          e.preventDefault()
          handleLogin()
        }}
      >
        <div>
          <label>Email:</label>
          <input type='email' value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type='password' value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

export default LoginPage
