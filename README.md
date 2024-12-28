# Time Attendance System

This is a simple time attendance tracking application that allows users to log their clock-in and clock-out times for each workday. Admins can manage user data and view attendance records.

## Project Setup

### Initial Setup
The initial user data is stored in the `attendance.json` file, which includes admin credentials and sample user data. Below is the default content of `attendance.json`:

```json
{
  "admin": {
    "Password": "admin",
    "UserName": "admin"
  },
  "user1": {
    "UserName": "user1",
    "Password": "1111",
    "Dates": [
      {"date": "23-12-2024", "clockIn": "09:00", "clockOut": "17:00"},
      {"date": "24-12-2024", "clockIn": "09:00", "clockOut": "17:00"},
      {"date": "25-12-2024", "clockIn": "09:00", "clockOut": "17:00"},
      {"date": "26-12-2024", "clockIn": "09:00", "clockOut": "17:00"},
      {"date": "27-12-2024", "clockIn": "09:00", "clockOut": "17:00"}
    ]
  },
  "user2": {
    "UserName": "user2",
    "Password": "2222",
    "Dates": [
      {"date": "21-12-2024", "clockIn": "09:00", "clockOut": "17:00"},
      {"date": "22-12-2024", "clockIn": "09:00", "clockOut": "17:00"},
      {"date": "23-12-2024", "clockIn": "09:00", "clockOut": "17:00"},
      {"date": "24-12-2024", "clockIn": "09:00", "clockOut": "17:00"}
    ]
  }
}
```

### Prerequisites
1. Node.js (latest stable version)
2. Git (for version control)

### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/michaelEluz/TimeAttendanceSystem.git
   cd TimeAttendanceSystem
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Server
To start the server, run:
```bash
node server.js
```
To start the frontend, run:
```bash
npm start
```
## Features
1. **User Authentication**: Login as an admin or regular user using predefined credentials.
2. **Attendance Tracking**: Users can record their clock-in and clock-out times.
3. **Admin Management**: Admins can view and manage attendance records for all users.

## Usage
### User Login
- **Admin**:
  - Username: `admin`
  - Password: `admin`
- **User 1**:
  - Username: `user1`
  - Password: `1111`
- **User 2**:
  - Username: `user2`
  - Password: `2222`

### Attendance Records
Once logged in, users can:
- View their daily attendance records.
- Add or update clock-in and clock-out times.

Admins can:
- View attendance records for all users.


---

Enjoy using the Time Attendance System! If you encounter any issues, please contact [michaelEluz](https://github.com/michaelEluz).

