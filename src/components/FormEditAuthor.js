import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHORS } from '../queries'
import Select from 'react-select'

const EditAuthor = ({authors}) => {

  const options = authors.map((item) => {return {value:item.name, label:item.name}})

  const [selectedOption, setSelectedOption] = useState(null);
  const [born, setBorn] = useState('')

  const [ changeNumber ] = useMutation(EDIT_AUTHORS, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  const submit = (event) => {
    event.preventDefault()

    const name = selectedOption.value

    changeNumber({ variables: { name, born } })

    setBorn('')
  }

  return (
    <div>
      <h2>Change birth year</h2>

      <form onSubmit={submit}>
        <div>
          name <Select
          defaultValue={selectedOption}
          onChange={setSelectedOption}
          options={options}
        />
        </div>
        <div>
          born <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
        </div>
        <button type='submit'>change year</button>
      </form>
    </div>
  )
}

export default EditAuthor