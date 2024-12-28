
// Project setup for Attendance System

// 1. ExpressJS Server (Backend)
const express = require('express');
const fs = require('fs');
const axios = require('axios');
const cors = require('cors');
const { log } = require('console');

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(cors());



// File to store attendance data
const DATA_FILE = './attendance.json';

// Utility function to read/write JSON file
const readData = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(DATA_FILE));
};

const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
};

// Authentication endpoint
app.post('/login', (req, res) => {
  const data = readData(); // Read attendance data from the file
  
  const { username, password } = req.body;

  if (data[username] && data[username].Password === password) {
    res.status(200).json({ message: 'Login successful', role: username === 'admin' ? 'admin' : 'user', Success: true, UserName: username});
  } else {
    res.status(401).json({ message: 'Invalid credentials', Success: false });
  }
});


// User data endpoint
app.get('/user', (req, res) => {
  
  const username = req.query.username; // Extract username from query parameters
 
  console.log("*************Query Params:", username); // Logs the parsed query parameters
  const data = readData(); // Read attendance data from the file
  
  if (!username) {
      return res.status(400).json({ message: 'Username is required' });
  }

  if (!data[username]) {
      return res.status(404).json({ message: 'User not found' });
  }
  console.log("result        :",data[username]);
  

  res.status(200).json({ user: data[username] ,Success:true,message:'user data found'});
});

// User data endpoint
app.get('/admin', (req, res) => {
  
  
  const data = readData(); // Read attendance data from the file
  
  if (!data) {
      return res.status(400).json({ message: 'no data found' });
  }

  
  console.log("result        :",data);
  

  res.status(200).json({ data: data ,Success:true,message:'user data found'});
});

// Fetch current time from WorldTimeAPI
app.get('/time', async (req, res) => {
  try {
    const response = await axios.get('https://worldtimeapi.org/api/timezone/Europe/Berlin');
    console.log("the time response is:",response.data);
    
    res.status(200).json({ datetime: response.data.datetime,Success:true,message:"time is found" });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching time' });
  }
});

// Record clock-in/out
app.post('/clockin', (req, res) => {
  console.log(req.body);
  
  const { username, date, clockIn } = req.body;
  const data = readData();

  if (!data[username]) {
    data[username] = [];
  }
  console.log(username, date, clockIn)
  
  data[username].Dates.push({ date, clockIn, clockOut:"--" });
  

  writeData(data);
  res.status(200).json({ message: 'Clock data recorded successfully',Success:true });
});

app.post('/clockout', (req, res) => {
  console.log(req.body);

  const { username, date, clockOut } = req.body;
  const data = readData();

  if (data[username]) {
    const entryIndex = data[username].Dates.findIndex((entry) => entry.date === date);

    if (entryIndex !== -1) {
      // Preserve the existing clockIn value
      const existingClockIn = data[username].Dates[entryIndex].clockIn;

      // Update only the clockOut value
      data[username].Dates[entryIndex] = { 
        date, 
        clockIn: existingClockIn, 
        clockOut 
      };

      writeData(data);
      res.status(200).json({ message: 'User data updated successfully', Success: true });
    } else {
      res.status(404).json({ message: 'Entry not found' });
    }
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Endpoint to add a new user
app.post('/newuser', (req, res) => {
  

  const { username, password } = req.body;
  console.log("username, password :",username, password );
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.', Success: false });
  }

  const data = readData();

  // Check if the user already exists
  if (data[username]) {
    return res.status(400).json({ message: 'User already exists.', Success: false });
  }

  // Add the new user
  data[username] = {
    UserName: username,
    Password: password,
    Dates: [] // Initialize with an empty array for dates
  };

  // Write updated data back to the file
  writeData(data);

  res.status(200).json({ message: 'New User Added Successfully', Success: true });
});


// Admin: View and edit user data
app.get('/data', (req, res) => {
  const data = readData();
  res.status(200).json(data);
});

app.put('/edit', (req, res) => {
  const { username, date, clockIn, clockOut } = req.body;

  const data = readData();  

  if (data[username]) {

    const entryIndex = data[username].Dates.findIndex((entry) => entry.date === date);

    if (entryIndex !== -1) {

      data[username].Dates[entryIndex] = { date, clockIn, clockOut };

      writeData(data);
      res.status(200).json({ message: 'User data updated successfully', Success: true });
    } else {
      res.status(404).json({ message: 'Entry not found' });
    }
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.put('/deletedate', (req, res) => {
  const { username, date } = req.body;
  console.log("username and date", username, date);

  if (!username || !date) {
      return res.status(400).json({ error: 'Username and date are required.' });
  }

  try {
      const data = readData();

      // Find the user
      const user = data[username];
      if (!user) {
          return res.status(404).json({ error: 'User not found.' });
      }

      // Find the index of the date to delete
      const entryIndex = user.Dates.findIndex((entry) => entry.date === date);
      if (entryIndex === -1) {
          return res.status(404).json({ error: 'Date not found.' });
      }

      // Remove the date from the user's Dates array
      user.Dates.splice(entryIndex, 1);

      // Save the updated data back to the file
      writeData(data);

      return res.status(200).json({ message: 'Date deleted successfully.' ,Success:true});
  } catch (error) {
      console.error('Error deleting date:', error);
      return res.status(500).json({ error: 'Internal server error.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log("Server running on http://localhost:",PORT);
});