import Graph from "./graph";
import api from "@/utils/api"

export default async function GraphPage({
    params,
  }: {
    params: { department: string };
  }) {
  // Title at top, selector for data point, from date input, to date input
  const pageData = await api.get(`/graph?dataSelection=${params.department}`)
  return <div className="p-16"><h1>{params.department} Graph</h1>
  <Graph/></div>;
  }
  

  /*

  import { useState, useEffect } from 'react';
import axios from 'axios';

const YourComponent = () => {
  // State for the options in the selector
  const [options, setOptions] = useState([]);

  // State for the "From" and "To" dates
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Effect to fetch options on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('your-api-endpoint'); // Replace with your API endpoint
        setOptions(response.data);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once on component mount

  return (
    <div>
      {/* Selector filled with options *//*}
      <select>
        {options.map((option) => (
          <option key={option.id} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* "From" date selector *//*}
      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
      />

      {/* "To" date selector *//*}
      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
      />

      {/* Rest of your component *//*}
    </div>
  );
};

export default YourComponent;
*/