# Teller Panel

A full-stack banking teller dashboard with backend and frontend containerized using Docker.

## Project Structure

```
├── frontend/          # React + Vite frontend
└── backend/           # Express.js backend
```

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Express.js
- MongoDB
- JWT Authentication
- Express Validator

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/miralhsn/teller-panel.git
cd teller-panel
```

2. Install dependencies
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables
- Create `.env` in backend directory
- Create `.env` in frontend directory

4. Run the application
```bash
# Run frontend (in frontend directory)
npm run dev

# Run backend (in backend directory)
npm run dev
```

## Tech Stack
- Node.js
- Express
- React
- MongoDB
- Docker


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
