import React, { useEffect, useState } from "react";
import { createPoll, deletePoll, listPolls } from "../../api/voteAPI";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../api/adminAPI";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [component, setComponent] = useState(0);
  //COMPONENT 0
  const [poll, setPoll] = useState(null);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    try {
      await deletePoll();
      setPoll(null);
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const handleLogout = async () => {
    try {

      async function api() {
        await logoutAdmin()
        navigate("/")
      } api()
    }
    catch (err) {

    }
  }

  //COMPONENT 1
  const [nominees, setNominees] = useState([]);
  const [nominee, setNominee] = useState("");
  const [name, setName] = useState("");
  const [error1, setError1] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    if (nominee.length !== 10) {
      setNominee("");
      return setError1("Invalid Registration Number...!");
    }

    if (nominees.includes(nominee.toUpperCase())) {
      setNominee("");
      return setError1("Duplicate  Nominees Are Not Allowed...!");
    }

    setNominees((prev) => {
      return [...prev, nominee.toUpperCase()];
    });
    setNominee("");
    setError1(null);
  };
  const handleNomineeDelete = (e,deleteNominee) => {
    e.preventDefault();
    const tempNominees = nominees.filter(nominee=>nominee!==deleteNominee)
    setNominees((prev)=>{
      return [
        ...tempNominees
      ]
    })
  }
  useEffect(() => {
    async function api() {
      try {
        const result = await listPolls();
        setPoll(result.data.data);
      } catch (err) {
        setError(err.response.data.message);
      }
    }
    if (component === 0) {
      api();
      setName("");
      setNominees([]);
      setError(null);
      setError1(null);
    }
  }, [component]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await createPoll({ name, nominees });
      setComponent(0);
    } catch (err) {
      setError1(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* DISPLAY POLLS */}
      {component === 0 && (
        <section className="bg-purple-200 rounded-2xl p-5 mb-10">
          <div className="py-10">
            <div className="flex justify-between item-center">
              <button
                onClick={() => navigate("/")}
                className="bg-white rounded px-2 py-1 font-bold shadow"
              >
                Home
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white rounded px-2 py-1 font-bold shadow"
              >
                Logout
              </button>
            </div>
            <h2 className="text-center text-5xl font-bold">Admin Panel</h2>
            <h4 className="text-left text-5xl font-italic ml-8 mt-8">
              Polls:-
            </h4>
          </div>
          {poll && (
            <div className=" w-1/2 text-center mx-auto mb-5 bg-white py-3 rounded-2xl shadow-lg">
              <label className="text-center text-2xl font-bold" htmlFor="polls">
                {poll.name}
              </label>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-lg text-white px-2 py-1 rounded-xl hover:bg-red-700 mt-2 ml-5"
                type="submit"
              >
                Delete
              </button>
              <div>
                <h3 className="text-left m-5 font-bold text-xl">Nominees : </h3>
                <ol className="font-bold">
                  {poll.nominees.map((nominee, index) => (
                    <li
                      key={index}
                      className="bg-purple-300 text-gray-700 my-0.5 mx-4 rounded p-1"
                    >
                      {nominee.name}({nominee.regno})
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
          {!poll && (
            <div className=" w-1/2 text-center mx-auto mb-5 bg-white py-3 rounded-2xl shadow-lg">
              <label className="text-center text-2xl font-bold" htmlFor="polls">
                No Poll Found...!
              </label>
            </div>
          )}
          <button
            onClick={() => setComponent(1)}
            className="bg-purple-600 text-lg text-white p-3 rounded-2xl hover:bg-purple-900 mt-5 justify-center"
          >
            Create
          </button>
        </section>
      )}

      {/* CREATE POLL */}
      {component === 1 && (
        <section className="bg-purple-200 rounded-2xl p-5 mb-10">
          <div className="container mx-auto">
            <div>
              <button
                onClick={() => setComponent(0)}
                className="bg-white px-3 py-1 rounded font-bold"
              >
                Back
              </button>
            </div>
            <div className="py-10">
              <h2 className="text-center text-5xl font-bold">Create Poll</h2>
            </div>
            <div className="container mx-auto">
              <form className="flex flex-wrap mt-2 mb-2">
                <div className="w-1/2 p-5">
                  <div className="bg-white p-10 rounded-2xl shadow-lg">
                    <label
                      className="text-center mb-5 text-2xl font-italic text-gray-700"
                      htmlFor="name"
                    >
                      Poll Name :
                    </label>

                    <input
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      className="mt-2 border border-black p-3 rounded-2xl font-bold text-lg shadow ml-5"
                      type="text"
                      id="name"
                      placeholder="Enter poll name"
                    />

                    <div className="mt-5">
                      <label
                        className="text-center mb-5 text-2xl font-italic text-gray-700"
                        htmlFor="nominee"
                      >
                        Nominee :
                      </label>
                      <input
                        onChange={(e) => setNominee(e.target.value)}
                        value={nominee}
                        className="mt-2 border border-black p-3 rounded-2xl font-bold text-lg shadow ml-7"
                        type="text"
                        id="nominee"
                        placeholder="Enter nominee Regno"
                      />
                      <label
                        onClick={handleAdd}
                        className="bg-purple-600 text-lg text-white p-3 rounded-2xl hover:bg-purple-900 ml-2 mt-5"
                      >
                        Add
                      </label>
                    </div>
                  </div>
                </div>
                <div className="w-1/2 p-5">
                  <div className="bg-white p-5 rounded-2xl shadow-lg">
                    <div>
                      <label
                        className="text-center text-2xl font-italic text-gray-700"
                        htmlFor="nominee"
                      >
                        Nominees:-
                      </label>
                      <div className="bg-purple-400 rounded-xl p-3 mt-3">
                        <div className="">
                          {nominees.map((nominee, index) => (
                            <div
                              key={index}
                              className="bg-white flex justify-between rounded-xl p-2 text-black font-bold m-1"
                            >
                              <p className="">{nominee}</p>
                              <button onClick={(e)=>handleNomineeDelete(e,nominee)} className="text-white bg-red-500 rounded font-bold p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {error1 && (
                  <h3 className="mb-5 font-bold text-red-600 text-lg text-left">
                    {error1}
                  </h3>
                )}
                <div className=" w-full flex justify-center">
                  <button
                    onClick={handleSubmit}
                    type="submit"
                    disabled={loading}
                    className="bg-purple-600 text-white px-2 py-0.5 rounded"
                  >
                    {loading ? 'Loading...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default AdminPanel;
