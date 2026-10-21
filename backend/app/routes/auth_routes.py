# Auth Routes - Register, Login, Profile
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app import db
from app.models.user import User
from app.middleware.auth_middleware import token_required

# Blueprint create (route group)
auth_bp = Blueprint('auth', __name__)

# ============================================================
# @route   POST /api/auth/register
# @desc    New user register cheyyadam (customer or provider)
# @access  Public
# ============================================================
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validation - required fields check
    if not all(k in data for k in ['name', 'email', 'password']):
        return jsonify({'message': 'Name, email, password required'}), 400
    
    # Password minimum length check
    if len(data['password']) < 6:
        return jsonify({'message': 'Password must be at least 6 characters'}), 400
    
    # Email already exists check
    if User.query.filter_by(email=data['email'].lower()).first():
        return jsonify({'message': 'Email already registered'}), 400
    
    # New user create cheyyadam
    user = User(
        name=data['name'],
        email=data['email'].lower(),
        phone=data.get('phone', ''),
        role=data.get('role', 'customer')
    )
    user.set_password(data['password'])
    
    # Database lo save cheyyadam
    db.session.add(user)
    db.session.commit()
    
    # JWT token generate
    token = create_access_token(identity=str(user.id))
    
    return jsonify({
        'message': 'User registered successfully',
        'token': token,
        'user': user.to_dict()
    }), 201


# ============================================================
# @route   POST /api/auth/login
# @desc    Existing user login
# @access  Public
# ============================================================
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password required'}), 400
    
    user = User.query.filter_by(email=data['email'].lower()).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    token = create_access_token(identity=str(user.id))
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': user.to_dict()
    }), 200


# ============================================================
# @route   GET /api/auth/profile
# @desc    Current logged-in user profile
# @access  Private (token required)
# ============================================================
@auth_bp.route('/profile', methods=['GET'])
@token_required
def profile(current_user):
    return jsonify(current_user.to_dict()), 200


# ============================================================
# @route   PUT /api/auth/profile
# @desc    Update user profile (name, phone)
# @access  Private (token required)
# ============================================================
@auth_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json()
    
    # Name update cheyyadam (empty ga unte update cheyyakunda)
    if data.get('name'):
        current_user.name = data['name']
    
    # Phone update cheyyadam
    if data.get('phone') is not None:
        current_user.phone = data['phone']
    
    # Database lo save cheyyadam
    db.session.commit()
    
    return jsonify({
        'message': 'Profile updated successfully',
        'user': current_user.to_dict()
    }), 200