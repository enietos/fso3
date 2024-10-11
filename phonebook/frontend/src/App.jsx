import { useState, useEffect } from 'react'
import axios from 'axios'
import { DisplayComponent, Notification} from './components/phonecomp'
import dbapps from './services/dbapps'


const App = () => {
  const [persons, setPersons] = useState([{ 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  }])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [filteredPersons, setNewFilteredPerson] = useState([])
  const [errorMessage, setErrorMessage] = useState('App starting!')

  useEffect(() => {
    dbapps      
    .getAll()      
    .then(initialPersons=> {
      console.log(initialPersons, "persons")        
      setPersons(initialPersons)      
    })  
  }, 
  [])

console.log("this is persons ",persons)

  const handleNewName = () => {
    setNewName(event.target.value)
  }

  const handleNewNumber = () => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    const SearchValue = event.target.value
    console.log(SearchValue)

    setNewSearch(SearchValue)
    const newFilteredPersons = persons.filter((personSearched) => {
      return personSearched.name.toLowerCase().includes(SearchValue.toLowerCase())
    })
    setNewFilteredPerson(newFilteredPersons)
  }

  const addNumber = (event) => {
    event.preventDefault();
    console.log('Click', event.target);
  
    const PhoneBookObject = {
      name: newName,
      number: newNumber,
    };
  
    // Find an existing person with the same name
    const testExisting = persons.find((x) => x.name === newName);
    console.log(testExisting);
  
    // Check if the person already exists
    if (testExisting) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to the phonebook. Do you want to update the phone number?`
      );
      
      if (confirmUpdate) {

      const changedPerson = { name: newName, number: newNumber, id: testExisting.id };
  
      dbapps
        .update(testExisting.id, changedPerson)
        .then((persontochange) => {
          // Update the person list in state
          setPersons(
            persons.map((person) =>
              person.id !== persontochange.id ? person : changedPerson
            )
          );
          console.log("Person updated!");
          setErrorMessage("Person edited succesfully!")
          return <div><Notification message={errorMessage} setErrorMessage={setErrorMessage}></Notification></div>
        })
        .catch((error) => {
          console.error('Error updating person: ', error);
        });
    } else {
      console.log("User chose not to update the phone number");
      return; // Exit the function if the user cancels the update
    } 
  } else {
      // If the person doesn't exist, create a new entry
      dbapps.create(PhoneBookObject).then((response) => {
        setPersons(persons.concat(response)); // Use the response from the server
        setNewName(""); // Reset the input field
        setNewNumber(""); // Clear the number field if you have one
        setErrorMessage("Person added succesfully!")
      })
      .catch(error => {
        setErrorMessage(error.response.data.error)
        console.log(error.response.data.error)})
      console.log("Number added!")
      return <div><Notification message={errorMessage} setErrorMessage={setErrorMessage}></Notification></div>
      }
    }

  const handleDelete = (name) => {
      const personToDelete = persons.find((person) => person.name === name);
  
      if (!personToDelete) {
        alert(`${name} is not in the phonebook!`);
        return;
      }
  
      if (!window.confirm(`Do you really want to delete ${name}?`)) {
        console.log("User chose not to delete");
        return;
      }
  
      dbapps
        .remove(personToDelete.id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== personToDelete.id));
          console.log(`${name} has been deleted!`);
        })
        .catch((error) => {
          console.error('Error deleting person: ', error);
        });
    };
    console.log(persons);

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
      <div>
          Filter names: <input value={newSearch}
          onChange={handleSearch} />
          <ul>
          <DisplayComponent persons={filteredPersons} onDelete={handleDelete}/>
          <Notification message={errorMessage} setErrorMessage={setErrorMessage}></Notification>
        </ul>
        </div>
      </form>
      <h2>Add new</h2>
      <form onSubmit={addNumber}>
        <div>
          Name: <input value={newName}
          onChange={handleNewName} />
        </div>
        <div>
          Number: <input value={newNumber}
          onChange={handleNewNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
      <DisplayComponent persons={persons} onDelete={handleDelete}/>
      </ul>
    </div>
  )
}

export default App