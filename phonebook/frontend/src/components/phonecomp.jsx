import React from 'react';

const Notification = ({ message, setErrorMessage }) => {
  if (message === null) {
    return null
  }

  setTimeout(() => {          
    setErrorMessage(null)        
  }, 5000)

  return (
    <div className='error'>
      {message}
    </div>
  )
};


const DisplayComponent = ({ persons, onDelete }) => {
  return (
    <ul>
      {persons.map((person, index) => (
        <li key={index}>
          {person.name} {person.number}
          <button onClick={() => onDelete(person.name)}>Delete number</button>
        </li>
      ))}
    </ul>
  );
};


export { DisplayComponent, Notification};