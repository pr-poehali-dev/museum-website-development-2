"""
Business: Virtual tours CRUD API - get all tours, create, update, delete
Args: event with httpMethod, body, queryStringParameters
      context with request_id
Returns: HTTP response with statusCode, headers, body
"""

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            tour_id = params.get('id')
            
            if tour_id:
                cur.execute(
                    "SELECT * FROM virtual_tours WHERE id = %s AND is_active = TRUE",
                    (tour_id,)
                )
                tour = cur.fetchone()
                
                if not tour:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Tour not found'}),
                        'isBase64Encoded': False
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(tour), default=str),
                    'isBase64Encoded': False
                }
            else:
                cur.execute("SELECT * FROM virtual_tours WHERE is_active = TRUE ORDER BY created_at DESC")
                tours = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(t) for t in tours], default=str),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            title = body_data.get('title')
            description = body_data.get('description', '')
            duration_minutes = body_data.get('duration_minutes', 0)
            video_url = body_data.get('video_url', '')
            thumbnail_url = body_data.get('thumbnail_url', '')
            category = body_data.get('category', '')
            
            if not title:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Title is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                """
                INSERT INTO virtual_tours (title, description, duration_minutes, video_url, thumbnail_url, category)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING *
                """,
                (title, description, duration_minutes, video_url, thumbnail_url, category)
            )
            conn.commit()
            
            new_tour = cur.fetchone()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(new_tour), default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            tour_id = body_data.get('id')
            
            if not tour_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Tour ID is required'}),
                    'isBase64Encoded': False
                }
            
            update_fields = []
            values = []
            
            for field in ['title', 'description', 'duration_minutes', 'video_url', 'thumbnail_url', 'category', 'viewers_count']:
                if field in body_data:
                    update_fields.append(f"{field} = %s")
                    values.append(body_data[field])
            
            if not update_fields:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'No fields to update'}),
                    'isBase64Encoded': False
                }
            
            values.append(tour_id)
            query = f"UPDATE virtual_tours SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING *"
            
            cur.execute(query, values)
            conn.commit()
            
            updated_tour = cur.fetchone()
            
            if not updated_tour:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Tour not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(updated_tour), default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters') or {}
            tour_id = params.get('id')
            
            if not tour_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Tour ID is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "UPDATE virtual_tours SET is_active = FALSE WHERE id = %s RETURNING id",
                (tour_id,)
            )
            conn.commit()
            
            deleted = cur.fetchone()
            
            if not deleted:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Tour not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Tour deleted successfully'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()
