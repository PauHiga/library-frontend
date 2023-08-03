import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const Login = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if ( result.data ) {
      const token = result.data.login.value
      localStorage.setItem('library-user-token', token)
      props.setToken(token)
    }
  }, [result.data]) // eslint-disable-line

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    login({  variables: { username, password } })

    setUsername('')
    setPassword('')
    setError('')
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={submit}>
        <div>
          username 
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password 
          <input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
      {error}
    </div>
  )
}

export default Login