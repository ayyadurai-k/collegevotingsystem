import React, { useEffect, useState } from "react";
import { getResult } from "../api/voteAPI";
import {useNavigate} from 'react-router-dom'

const Result = () => {
  const navigate = useNavigate()
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [winners, setWinners] = useState(null);
  
  useEffect(() => {
    async function api() {
      try {
        setLoading(true);
        const res = await getResult();
        setWinners(res.data.data.winners);
        setResults(res.data.data.nominees);
      } catch (err) {
        setError(err.response.data.message);
      } finally {
        setLoading(false);
      }
    }
    api();
  }, []);
  return (
    <section className="bg-purple-200 rounded-2xl p-2 mb-5">
      <button
        onClick={() => navigate("/")}
        className="bg-white rounded px-2 py-1 font-bold shadow"
      >
        Home
      </button>
      <div className="container mx-auto">
        <div className="py-10">
          <h2 className="text-center text-5xl font-bold">Results</h2>
        </div>
      </div>
      <div className="flex flex-col  justify-center text-center mx-auto p-5 mb-5">
        <table className="shadow-2xl  border-2 border-white w-full">
          <thead className="text-gray-600 font-bold text-lg">
            <tr>
              <th className="py-5 bg-red-300">Regisitratoin No</th>
              <th className="py-5 bg-red-300">Name</th>
              <th className="py-5 bg-red-300">Votes</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-center text-lg">
            {results.map((result,index) => (
              <tr key={index} className="bg-red-200 hover:bg-red-100">
                <td className="p-5 px-10">{result.regno}</td>
                <td className="p-5 px-10">{result.name}</td>
                <td className="p-5 px-10">{result.votes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {winners && (
          <div className="mt-10 p-3 bg-white">
            <h3 className="font-bold text-4xl ">
              {winners.length===1 ? (
                <span className="text-2xl">Highest Vote : {winners[0].name}</span> 
              ):(
                <span className="text-2xl">Highest Vote : {
                  winners.map((winner,index)=>(
                    <span key={index}>{winner.name} | </span>
                  ))
                }</span> 
              )}
            </h3>
          </div>
        )}
        {
          !winners && (
            <div className="mt-10 p-3 bg-white">
            <h3 className="font-bold text-4xl ">
              No Result Found
            </h3>
          </div>
          )
        }
      </div>
    </section>
  );
};

export default Result;
