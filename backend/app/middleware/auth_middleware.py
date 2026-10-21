# Auth Middleware - JWT tokens verify cheyyadam
from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.models.user import User

def token_required(fn):
    """Decorator - Protected routes ki JWT token validate chestundi"""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            # Request lo JWT token unda ani check cheyyadam
            verify_jwt_in_request()
            
            # Token nunchi user ID teesukovadam
            user_id = get_jwt_identity()
            
            # Database nunchi user ni fetch cheyyadam
            current_user = User.query.get(int(user_id))
            
            if not current_user:
                return jsonify({'message': 'User not found'}), 404
            
            # User ni function ki pass cheyyadam
            return fn(current_user, *args, **kwargs)
        
        except Exception as e:
            return jsonify({'message': 'Invalid or missing token', 'error': str(e)}), 401
    
    return wrapper

def provider_required(fn):
    """Decorator - Provider role matrame access cheyyali"""
    @wraps(fn)
    def wrapper(current_user, *args, **kwargs):
        if current_user.role != 'provider':
            return jsonify({'message': 'Provider access required'}), 403
        return fn(current_user, *args, **kwargs)
    
    return wrapper