// import { useState } from 'react'

import useSWR from 'swr';
import './App.css';

function App() {
  // const [count, setCount] = useState(0)

  const url = 'http://localhost:3000/barchart/data/07';

  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, error, isLoading } = useSWR(url, fetcher);

  console.log(data, isLoading)

  // console.log();

  // data.data.forEach(e => {
  //   console.log(e)
  // });

  // fetch(url)
  // .then(response => {
  //   if (!response.ok) {
  //     throw new Error('Network response was not ok');
  //   }
  //   return response.json(); // assuming response is JSON
  // })
  // .then(data => {
  //   // Process the data here
  //   console.log(data); // For example, log the data to the console
  // })
  // .catch(error => {
  //   console.error('There was a problem with the fetch operation:', error);
  // });

  useSWR();

  return (
    <>
      <h1>hello world</h1>
    </>
  );
}

export default App;
