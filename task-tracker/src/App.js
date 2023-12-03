import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import About from './components/About'


function App() { // /* */ in braces for comments
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => { // async has to go inside
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, []) // <-- dependency array

  // Fetch Tasks
  const fetchTasks = async () => {
    // response
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()

    return data
  }
  // Fetch Task
  const fetchTask = async (id) => {
    // response
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()

    return data
  }
  // Add Task
  const addTask = async (task) => {
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      }, 
      body: JSON.stringify(task)
    })

    const data = await res.json() // allow front-end to update
    setTasks([...tasks, data])

    // local version, before json server
    // const id = Math.floor(Math.random() * 10000) + 1
    // const newTask = {id, ...task }
    // setTasks([...tasks, newTask])
  }
  // Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, 
    {method: 'DELETE'})

    setTasks(tasks.filter((task) => 
    task.id !== id))
  }

  // Toggle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updTask = { ...taskToToggle, 
    reminder: !taskToToggle.reminder }
    
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT', 
      headers: {
        'Content-type': 'application/json'
      }, 
      body: JSON.stringify(updTask)
    })

    const data = await res.json()

    setTasks(
      tasks.map((task) => 
      task.id === id ? { ...task, reminder: 
        data.reminder } : task // reminder status from updated json
      )
    )
  }

  return (
    <Router>
    <div className='container'> {/* for fragment, empty angle brackets here*/}
      <Header 
      onAdd={() => setShowAddTask(!showAddTask)} 
      showAdd={showAddTask}/>
      <Routes>
      <Route path='/' 
      element={
        <>
          {showAddTask && <AddTask onAdd={addTask} />} 
          {tasks.length > 0 ? (
          <Tasks tasks={tasks} 
          onDelete={deleteTask} 
          onToggle={toggleReminder} /> 
          ) : ('No Tasks To Show')}
        </>
      }
      />
      <Route path='/about' element={<About />}/>
      </Routes>
      <Footer />
    </div>
    </Router>
  )
}

/* class based component
import React from 'react'
class App extends React.Component {
  render() {
    return <h1>Hello from a class</h1>
  }
}
*/

export default App;
