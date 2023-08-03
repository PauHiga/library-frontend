import { useEffect } from 'react'
import { useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { useSubscription } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommendations from './components/Recommendations'
import { BOOK_ADDED, ME, ALL_BOOKS } from './queries'
import { useQuery } from '@apollo/client'

// function that takes care of manipulating cache
export const updateCache = (cache, query, addedBook) => {
  // helper that is used to eliminate saving same book twice
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook))
    }
  })
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('login')
  }

  const queryMe = useQuery(ME, {
    skip: !token,
  })

  useEffect(() => {
    const token = localStorage.getItem('library-user-token');
    if(token){
      setToken(token)
    }
  }, [])

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      window.alert(`A new book was added to the collection!\n"${data.data.bookAdded.title}"`);
      const addedBook = data.data.bookAdded
      updateCache(client.cache, { query: ALL_BOOKS, variables: { genre: 'all' } }, addedBook)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    }
  })

  return (
    <div>
      
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? <button onClick={() => setPage('recommendations')}>Recommendations</button> : ''}
        {token ? <button onClick={() => setPage('add')}>add book</button> : ''}
        {token ? <button onClick={logout}>logout</button> : <button onClick={() => setPage('login')}>login</button>}
      </div>

      <Authors show={page === 'authors'} token={token}/>

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <Login show={page === 'login' && !token} setToken={setToken}/>

      <Recommendations show={page === 'recommendations' && token} queryMe={queryMe}/>

    </div>
  )
}

export default App
