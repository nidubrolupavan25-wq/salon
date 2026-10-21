# Booking Routes - Bookings create and list
from flask import Blueprint, request, jsonify
from datetime import datetime
from app import db
from app.models.booking import Booking
from app.models.service import Service
from app.middleware.auth_middleware import token_required

booking_bp = Blueprint('bookings', __name__)

# @route   POST /api/bookings
# @desc    New booking create cheyyadam
# @access  Private
@booking_bp.route('', methods=['POST'])
@token_required
def create_booking(current_user):
    data = request.get_json()
    
    if not all(k in data for k in ['service_id', 'booking_date', 'booking_time']):
        return jsonify({'message': 'service_id, booking_date, booking_time required'}), 400
    
    service = Service.query.get(data['service_id'])
    if not service:
        return jsonify({'message': 'Service not found'}), 404
    
    try:
        booking_date = datetime.strptime(data['booking_date'], '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD'}), 400
    
    booking = Booking(
        customer_id=current_user.id,
        service_id=service.id,
        booking_date=booking_date,
        booking_time=data['booking_time'],
        status='pending',
        amount=service.price,
        notes=data.get('notes', '')
    )
    
    db.session.add(booking)
    db.session.commit()
    
    return jsonify(booking.to_dict()), 201


# @route   GET /api/bookings/my
# @desc    Customer's own bookings
# @access  Private
@booking_bp.route('/my', methods=['GET'])
@token_required
def get_my_bookings(current_user):
    bookings = Booking.query.filter_by(customer_id=current_user.id)\
        .order_by(Booking.created_at.desc()).all()
    return jsonify([b.to_dict() for b in bookings]), 200


# @route   GET /api/bookings/provider
# @desc    Provider's service bookings
# @access  Private
@booking_bp.route('/provider', methods=['GET'])
@token_required
def get_provider_bookings(current_user):
    bookings = db.session.query(Booking).join(Service)\
        .filter(Service.provider_id == current_user.id)\
        .order_by(Booking.created_at.desc()).all()
    return jsonify([b.to_dict() for b in bookings]), 200


# @route   PUT /api/bookings/<id>/status
# @desc    Booking status update
# @access  Private
@booking_bp.route('/<int:booking_id>/status', methods=['PUT'])
@token_required
def update_booking_status(current_user, booking_id):
    booking = Booking.query.get(booking_id)
    
    if not booking:
        return jsonify({'message': 'Booking not found'}), 404
    
    data = request.get_json()
    new_status = data.get('status')
    
    # 'accepted' status kuda add chesam
    valid_statuses = ['pending', 'accepted', 'confirmed', 'completed', 'cancelled']
    if new_status not in valid_statuses:
        return jsonify({'message': 'Invalid status'}), 400
    
    booking.status = new_status
    db.session.commit()
    
    return jsonify(booking.to_dict()), 200