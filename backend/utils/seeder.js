import students from '../data/students.json'  assert {type: "json"}
import User from '../models/userMdl.js'

const seedData = async()=>{
    await User.deleteMany({})
    console.log("All Students Deleted...!");
    await User.insertMany(students)
    console.log("All Students Inserted...!");
}

export default seedData;