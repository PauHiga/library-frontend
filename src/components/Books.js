import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [genre, setGenre] = useState('all')

  const result = useQuery(ALL_BOOKS, {
    variables: { genre },
  });

  const resultForGenre = useQuery(ALL_BOOKS);
  
    if (result.loading || resultForGenre.loading) {
      return <div>loading...</div>
    }

    const genresExtraction = resultForGenre.data.allBooks.map((item) => item.genres);
    const genresOptions = new Set(genresExtraction.flatMap((array)=>array).filter((item)=> item !== ''));

  if (!props.show) {
    return null
  }


  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {result.data.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {Array.from(genresOptions).map((genre) => <button key={genre} onClick={()=> setGenre(genre)}>{genre}</button>).concat(<button key="all" onClick={()=> setGenre("all")}>all genres</button>)}
    </div>
  )
}

export default Books
