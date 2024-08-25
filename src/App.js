import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState(['all']); // Default to show all data

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const handleSelectChange = (selectedOptions) => {
    // If "all" is selected, reset to show all
    const selectedValues = selectedOptions.map(option => option.value);
    if (selectedValues.includes('all')) {
      setSelectedFilters(['all']);
    } else {
      setSelectedFilters(selectedValues);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setResponse(null);
    setError(null);

    try {
      // Convert input string to JSON
      const data = JSON.parse(input);
      if (!Array.isArray(data.data)) {
        throw new Error('Invalid data format');
      }
      
      const result = await axios.post('https://dhruvphilip21bcb0079-bfh-api.onrender.com/bfhl', data);
      setResponse(result.data);
    } catch (err) {
      setError('Error sending data to the server');
      console.error('Error:', err);
    }
  };

  const filteredResponse = () => {
    if (!response) return null;
    const { numbers, alphabets, highestLowercaseAlphabet } = response;

    if (selectedFilters.includes('all')) {
      return response; // Show the entire payload if "all" is selected
    }

    let result = {};
    if (selectedFilters.includes('numbers')) result.numbers = numbers;
    if (selectedFilters.includes('alphabets')) result.alphabets = alphabets;
    if (selectedFilters.includes('highestLowercase')) result.highestLowercaseAlphabet = highestLowercaseAlphabet;

    return result;
  };

  const filterOptions = [
    { value: 'all', label: 'Show All' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'highestLowercase', label: 'Highest Lowercase Alphabet' }
  ];

  return (
    <div className="App">
      <h1>Send JSON Data to Server</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={handleChange}
          placeholder='Enter data in JSON format, e.g., {"data":["m","55","j"]}'
          rows="4"
          cols="50"
        />
        <button type="submit">Submit</button>
      </form>

      {error && <p className="error">{error}</p>}

      {response && (
        <div>
          <h2>Server Response:</h2>
          <Select
            isMulti
            options={filterOptions}
            onChange={handleSelectChange}
            placeholder="Select filters"
            value={filterOptions.filter(option => selectedFilters.includes(option.value))}
          />
          <pre>{JSON.stringify(filteredResponse(), null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;