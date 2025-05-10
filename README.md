# Climate Change Monitoring System

A comprehensive platform for monitoring climate change impacts and ecosystem health across different zones.

## Architecture

The system consists of the following components:

- **Frontend**: React + TypeScript application
- **Backend**: Node.js + Express + TypeScript API
- **Data Pipeline**: Python-based ETL system for sensor data
- **Database**: PostgreSQL for data storage
- **Authentication**: Azure AD integration
- **Containerization**: Docker for all components

## Features

- Zone-based monitoring system
- Focus point tracking for specific environmental issues
- River waste monitoring
- Action tracking and management
- Multi-role access (Admin, Public, Factory)
- Real-time sensor data integration
- Image processing for shore monitoring
- Comprehensive testing suite

## Project Structure

```
climate-change-challenge/
├── frontend/           # React frontend application
├── backend/           # Node.js backend API
├── data-pipeline/     # Python ETL system
├── docker/           # Docker configuration files
└── docs/             # Documentation
```

## Setup Instructions

1. Prerequisites:
   - Node.js 18+
   - Python 3.9+
   - Docker and Docker Compose
   - Azure subscription (for authentication)

2. Environment Setup:
   ```bash
   # Clone the repository
   git clone https://github.com/tomasfly/climate-change-monitor
   cd climate-change-challenge

   # Install dependencies
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install

   # Data Pipeline
   cd ../data-pipeline
   pip install -r requirements.txt
   ```

3. Docker Setup:
   ```bash
   docker-compose up -d
   ```

4. Configuration:
   - Set up Azure AD application
   - Configure environment variables
   - Set up database connections

## Development

- Frontend: `npm run dev` in frontend directory
- Backend: `npm run dev` in backend directory
- Data Pipeline: `python main.py` in data-pipeline directory

## Testing

- Frontend: `npm test` in frontend directory
- Backend: `npm test` in backend directory
- Data Pipeline: `pytest` in data-pipeline directory

## License

MIT License 