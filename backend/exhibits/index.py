"""
Business: Museum exhibits CRUD API - get all exhibits, create, update, delete
Args: event with httpMethod, body, queryStringParameters
      context with request_id
Returns: HTTP response with statusCode, headers, body
"""

import json
import os
from typing import Dict, Any, List, Optional
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
            exhibit_id = params.get('id')
            
            if exhibit_id:
                cur.execute(
                    "SELECT * FROM exhibits WHERE id = %s AND is_active = TRUE",
                    (exhibit_id,)
                )
                exhibit = cur.fetchone()
                
                if not exhibit:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Exhibit not found'}),
                        'isBase64Encoded': False
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(exhibit)),
                    'isBase64Encoded': False
                }
            else:
                cur.execute("SELECT * FROM exhibits WHERE is_active = TRUE ORDER BY created_at DESC")
                exhibits = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(ex) for ex in exhibits], default=str),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            title = body_data.get('title')
            period = body_data.get('period', '')
            description = body_data.get('description', '')
            image_url = body_data.get('image_url', '')
            category = body_data.get('category', '')
            location = body_data.get('location', '')
            
            if not title:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Title is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                """
                INSERT INTO exhibits (title, period, description, image_url, category, location)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING *
                """,
                (title, period, description, image_url, category, location)
            )
            conn.commit()
            
            new_exhibit = cur.fetchone()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(new_exhibit), default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            exhibit_id = body_data.get('id')
            
            if not exhibit_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Exhibit ID is required'}),
                    'isBase64Encoded': False
                }
            
            update_fields = []
            values = []
            
            for field in ['title', 'period', 'description', 'image_url', 'category', 'location']:
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
            
            values.append(exhibit_id)
            query = f"UPDATE exhibits SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING *"
            
            cur.execute(query, values)
            conn.commit()
            
            updated_exhibit = cur.fetchone()
            
            if not updated_exhibit:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Exhibit not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(updated_exhibit), default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters') or {}
            exhibit_id = params.get('id')
            
            if not exhibit_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Exhibit ID is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "UPDATE exhibits SET is_active = FALSE WHERE id = %s RETURNING id",
                (exhibit_id,)
            )
            conn.commit()
            
            deleted = cur.fetchone()
            
            if not deleted:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Exhibit not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Exhibit deleted successfully'}),
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
