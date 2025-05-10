import os
import logging
from datetime import datetime
from typing import Dict, Any, List
import json

import pandas as pd
import numpy as np
from dotenv import load_dotenv
from azure.storage.blob import BlobServiceClient
import psycopg2
from psycopg2.extras import Json

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class DataPipeline:
    def __init__(self):
        self.db_conn = self._connect_to_db()
        self.blob_service = self._connect_to_azure_blob()
        self.container_client = self.blob_service.get_container_client(
            os.getenv('AZURE_STORAGE_CONTAINER')
        )

    def _connect_to_db(self) -> psycopg2.extensions.connection:
        """Establish database connection."""
        try:
            conn = psycopg2.connect(
                dbname=os.getenv('DB_NAME'),
                user=os.getenv('DB_USER'),
                password=os.getenv('DB_PASSWORD'),
                host=os.getenv('DB_HOST'),
                port=os.getenv('DB_PORT')
            )
            logger.info("Successfully connected to database")
            return conn
        except Exception as e:
            logger.error(f"Failed to connect to database: {e}")
            raise

    def _connect_to_azure_blob(self) -> BlobServiceClient:
        """Connect to Azure Blob Storage."""
        try:
            return BlobServiceClient.from_connection_string(
                os.getenv('AZURE_STORAGE_CONNECTION_STRING')
            )
        except Exception as e:
            logger.error(f"Failed to connect to Azure Blob Storage: {e}")
            raise

    def process_sensor_data(self, sensor_id: str, data: Dict[str, Any]) -> None:
        """Process incoming sensor data."""
        try:
            # Store raw data in blob storage
            timestamp = datetime.utcnow().isoformat()
            blob_name = f"sensor_data/{sensor_id}/{timestamp}.json"
            self.container_client.upload_blob(
                blob_name,
                json.dumps(data),
                overwrite=True
            )

            # Process and store in database
            with self.db_conn.cursor() as cur:
                cur.execute("""
                    UPDATE sensors
                    SET last_reading = %s
                    WHERE id = %s
                """, (Json(data), sensor_id))
                self.db_conn.commit()

            logger.info(f"Successfully processed data for sensor {sensor_id}")
        except Exception as e:
            logger.error(f"Error processing sensor data: {e}")
            self.db_conn.rollback()
            raise

    def process_image_data(self, sensor_id: str, image_data: bytes) -> None:
        """Process image data from sensors."""
        try:
            # Store image in blob storage
            timestamp = datetime.utcnow().isoformat()
            blob_name = f"images/{sensor_id}/{timestamp}.jpg"
            self.container_client.upload_blob(
                blob_name,
                image_data,
                overwrite=True
            )

            # Update sensor metadata
            with self.db_conn.cursor() as cur:
                cur.execute("""
                    UPDATE sensors
                    SET last_reading = jsonb_set(
                        COALESCE(last_reading, '{}'::jsonb),
                        '{image_url}',
                        %s::jsonb
                    )
                    WHERE id = %s
                """, (Json(blob_name), sensor_id))
                self.db_conn.commit()

            logger.info(f"Successfully processed image for sensor {sensor_id}")
        except Exception as e:
            logger.error(f"Error processing image data: {e}")
            self.db_conn.rollback()
            raise

    def analyze_zone_data(self, zone_id: str) -> Dict[str, Any]:
        """Analyze data for a specific zone."""
        try:
            with self.db_conn.cursor() as cur:
                cur.execute("""
                    SELECT s.type, s.last_reading
                    FROM sensors s
                    WHERE s.zone_id = %s
                    AND s.is_active = true
                """, (zone_id,))
                sensor_data = cur.fetchall()

            analysis = {
                'zone_id': zone_id,
                'timestamp': datetime.utcnow().isoformat(),
                'metrics': {}
            }

            # Process sensor data
            for sensor_type, reading in sensor_data:
                if reading:
                    if sensor_type == 'temperature':
                        analysis['metrics']['temperature'] = {
                            'current': reading['value'],
                            'unit': reading['unit']
                        }
                    elif sensor_type == 'water_quality':
                        analysis['metrics']['water_quality'] = {
                            'ph': reading['value'],
                            'turbidity': reading.get('turbidity')
                        }

            return analysis
        except Exception as e:
            logger.error(f"Error analyzing zone data: {e}")
            raise

    def close(self):
        """Close database connection."""
        if self.db_conn:
            self.db_conn.close()
            logger.info("Database connection closed")

def main():
    pipeline = DataPipeline()
    try:
        # Example usage
        sensor_data = {
            'value': 25.5,
            'unit': 'celsius',
            'timestamp': datetime.utcnow().isoformat()
        }
        pipeline.process_sensor_data('sensor-123', sensor_data)
        
        # Example zone analysis
        analysis = pipeline.analyze_zone_data('zone-456')
        logger.info(f"Zone analysis: {analysis}")
    finally:
        pipeline.close()

if __name__ == "__main__":
    main() 