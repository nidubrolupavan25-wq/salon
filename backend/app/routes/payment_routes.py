# Payment Routes - Razorpay integration
import razorpay
import hmac
import hashlib
from flask import Blueprint, request, jsonify, current_app
from app import db
from app.models.booking import Booking
from app.middleware.auth_middleware import token_required

payment_bp = Blueprint('payments', __name__)

# @route   POST /api/payments/create-order
# @desc    Razorpay order create
# @access  Private
@payment_bp.route('/create-order', methods=['POST'])
@token_required
def create_order(current_user):
    data = request.get_json()
    booking_id = data.get('booking_id')
    
    if not booking_id:
        return jsonify({'message': 'booking_id required'}), 400
    
    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({'message': 'Booking not found'}), 404
    
    if booking.customer_id != current_user.id:
        return jsonify({'message': 'Unauthorized'}), 403
    
    client = razorpay.Client(auth=(
        current_app.config['RAZORPAY_KEY_ID'],
        current_app.config['RAZORPAY_KEY_SECRET']
    ))
    
    order_data = {
        'amount': int(float(booking.amount) * 100),
        'currency': 'INR',
        'receipt': f'booking_{booking.id}',
        'notes': {'booking_id': booking.id, 'customer': current_user.name}
    }
    
    order = client.order.create(data=order_data)
    
    return jsonify({
        'order_id': order['id'],
        'amount': order['amount'],
        'currency': order['currency'],
        'key_id': current_app.config['RAZORPAY_KEY_ID'],
        'booking_id': booking.id
    }), 200


# @route   POST /api/payments/verify
# @desc    Payment verify cheyyadam
# @access  Private
@payment_bp.route('/verify', methods=['POST'])
@token_required
def verify_payment(current_user):
    data = request.get_json()
    
    razorpay_order_id = data.get('razorpay_order_id')
    razorpay_payment_id = data.get('razorpay_payment_id')
    razorpay_signature = data.get('razorpay_signature')
    booking_id = data.get('booking_id')
    
    if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature, booking_id]):
        return jsonify({'message': 'Missing payment details'}), 400
    
    body = razorpay_order_id + '|' + razorpay_payment_id
    expected_signature = hmac.new(
        current_app.config['RAZORPAY_KEY_SECRET'].encode(),
        body.encode(),
        hashlib.sha256
    ).hexdigest()
    
    if expected_signature != razorpay_signature:
        return jsonify({'message': 'Payment verification failed'}), 400
    
    booking = Booking.query.get(booking_id)
    if booking:
        booking.status = 'confirmed'
        booking.payment_id = razorpay_payment_id
        db.session.commit()
    
    return jsonify({
        'message': 'Payment verified successfully',
        'booking': booking.to_dict()
    }), 200