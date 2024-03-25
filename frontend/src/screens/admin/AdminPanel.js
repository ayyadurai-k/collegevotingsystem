import React, { useEffect, useState } from 'react'
import { createPoll, deletePoll, listPolls } from '../../api/voteAPI';

const AdminPanel = () => {
  const [component, setComponent] = useState(0)
  //COMPONENT 0
  const [poll, setPoll] = useState(null);
  const [error, setError] = useState(null)

  const handleDelete = async()=>{
      try{
        const result = await deletePoll();
        setPoll(null)
      }
      catch(err){
        setError(err.response.data.message)
      }
  }

  //COMPONENT 1
  const [nominees, setNominees] = useState([])
  const [nominee, setNominee] = useState('')
  const [name, setName] = useState('')
  const [error1,setError1] = useState(null)

  const handleAdd = () => {
    setNominees((prev) => {
      return [
        ...prev,
        nominee
      ]
    })
    setNominee('')
  }

  useEffect(() => {
    async function api() {
      try {
        const result = await listPolls()
        setPoll(result.data.data)
      }
      catch (err) {
        setError(err.response.data.message)
      }
    } 
    if(component===0) api()
  }, [component])


  const handleSubmit = async(e) => {
    e.preventDefault()
    try{
      const result = await createPoll({name,nominees})
      setComponent(0);
    }
    catch(err){
      console.log(err);
      setError1(err.response.data.message)
    }
  }
  return (
    <>

      {/* DIAPLAY POLLS */}
      {component === 0 && (<section className="bg-purple-100 rounded-2xl p-5 mb-10">
        <div className="py-28">
          <h2 className="text-center text-5xl font-bold">
            Admin Panel
          </h2>
          <h4 className="text-left text-5xl font-italic ml-8 mt-8">
            Polls:-
          </h4>
        </div>
        {poll && <div className=" w-1/2 text-center mx-auto mb-5 bg-white py-3 rounded-2xl shadow-lg">
          <label className="text-center text-2xl font-bold" htmlFor="polls">{poll.name}</label>
          <button onClick={handleDelete} className="bg-purple-600 text-lg text-white p-3 rounded-2xl hover:bg-purple-900 mt-2 ml-5"
            type="submit">Delete</button>
        </div>}
        {!poll && <div className=" w-1/2 text-center mx-auto mb-5 bg-white py-3 rounded-2xl shadow-lg">
          <label className="text-center text-2xl font-bold" htmlFor="polls">No Poll Found...!</label>
        </div>}
        <button onClick={() => setComponent(1)} className="bg-purple-600 text-lg text-white p-3 rounded-2xl hover:bg-purple-900 mt-5 justify-center">
          Create
        </button>
      </section >)}

      {/* CREATE POLL */}
      {component === 1 && (<section className="bg-purple-100 rounded-2xl p-5 mb-10">
        <div className="container mx-auto">
          <div className="py-28">
            <h2 className="text-center text-5xl font-bold">
              Create Poll
            </h2>
          </div>
          <div className="container mx-auto">
            <form className="flex flex-wrap mt-2 mb-2">
              <div className="w-1/2 p-5">
                <div className="bg-white p-10 rounded-2xl shadow-lg">
                  <label className="text-center text-2xl font-italic text-gray-700" htmlFor="name">
                    Poll Name :
                  </label>

                  <input onChange={(e) => setName(e.target.value)} value={name} className="border border-black p-3 rounded-2xl font-bold text-lg shadow ml-5" type="text"
                    id="name" placeholder="Enter poll name" />

                  <div className="mt-10">
                    <label className="text-center text-2xl font-italic text-gray-700" htmlFor="nominee">
                      Nominee :
                    </label>
                    <input onChange={(e) => setNominee(e.target.value)} value={nominee} className="border border-black p-3 rounded-2xl font-bold text-lg shadow ml-7"
                      type="text" id="nominee" placeholder="Enter nominee Regno" />
                    <label
                      onClick={handleAdd}
                      className="bg-purple-600 text-lg text-white p-3 rounded-2xl hover:bg-purple-900 mt-5"
                      >
                      ADD
                    </label>
                  </div>
                </div>
              </div>
              <div className="w-1/2 p-5">
                <div className="bg-white p-5 rounded-2xl shadow-lg">
                  <div>
                    <label className="text-center text-2xl font-italic text-gray-700" htmlFor="nominee">
                      Nominees:-
                    </label>
                    <div className='bg-purple-400 p-3 mt-3'>
                      <div>
                        {
                          nominees.map((nominee, index) => (
                            <p key={index} className='bg-white p-2 text-black font-bold m-1'>{nominee}</p>
                          ))
                        }

                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {error1 && <h3 class="mb-5 font-bold text-red-600 text-lg text-left">{error1}</h3>}
              <div className=' w-full flex justify-center'>
                <button onClick={handleSubmit} type='submit' className='bg-purple-600 text-white px-2 py-0.5 rounded'>Submit</button>
              </div>
            </form>
          </div>
        </div>
      </section>)}
    </>
  )
}

export default AdminPanel