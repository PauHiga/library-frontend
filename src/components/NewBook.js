import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK, ALL_GENRES } from '../queries'
import { updateCache } from '../App'


const NewBook = (props) => {
  const [title, setTitle] = useState('New Book')
  const [author, setAuthor] = useState('New Author')
  const [published, setPublished] = useState(1980)
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState(["classic"])

  const [ createBook ] = useMutation(CREATE_BOOK, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message)
    },
    // refetchQueries: [ { query: ALL_AUTHORS }, { query: ALL_BOOKS, variables: { genre: 'all' } }, { query: ALL_BOOKS}, { query: ALL_GENRES }],
    
    update: (cache, response) => {
      updateCache(cache, { query: ALL_BOOKS, variables: { genre: 'all' } }, response.data.addBook)
      updateCache(cache, { query: ALL_BOOKS}, response.data.addBook)
    },
    
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    createBook({  variables: { title, author, published, genres } })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(parseInt(target.value, 10))}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook