import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'

const Recommendations = (props) => { 
  const result = useQuery(ALL_BOOKS)
  const loggedInUser = props.queryMe

  if (!props.show) {
    return null
  }

  if (result.loading || loggedInUser.loading) {
    return <div>loading...</div>
  }

  const myFavoriteGenre = loggedInUser.data.me.favoriteGenre

  const recommendedBooks = result.data.allBooks.filter(book => book.genres.includes(myFavoriteGenre))
  
  return (
    <div>
      <h2>Recommendations</h2>
      <h4>Recommendations for your favorite genre: {myFavoriteGenre}</h4>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendedBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
