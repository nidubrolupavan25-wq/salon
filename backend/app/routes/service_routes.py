# Service Routes - Services CRUD
from flask import Blueprint, request, jsonify
from app import db
from app.models.service import Service
from app.middleware.auth_middleware import token_required, provider_required

service_bp = Blueprint('services', __name__)

# @route   GET /api/services
# @desc    Anni active services list
# @access  Public
@service_bp.route('', methods=['GET'])
def get_all_services():
    services = Service.query.filter_by(is_active=True).all()
    return jsonify([s.to_dict() for s in services]), 200


# @route   GET /api/services/<id>
# @desc    Single service details
# @access  Public
@service_bp.route('/<int:service_id>', methods=['GET'])
def get_service(service_id):
    service = Service.query.get(service_id)
    if not service:
        return jsonify({'message': 'Service not found'}), 404
    return jsonify(service.to_dict()), 200


# @route   POST /api/services
# @desc    New service create (provider only)
# @access  Private + Provider
@service_bp.route('', methods=['POST'])
@token_required
@provider_required
def create_service(current_user):
    data = request.get_json()
    
    if not all(k in data for k in ['name', 'price', 'duration']):
        return jsonify({'message': 'Name, price, duration required'}), 400
    
    service = Service(
        name=data['name'],
        description=data.get('description', ''),
        price=data['price'],
        duration=data['duration'],
        provider_id=current_user.id
    )
    
    db.session.add(service)
    db.session.commit()
    
    return jsonify(service.to_dict()), 201


# @route   GET /api/services/my
# @desc    Provider's own services
# @access  Private + Provider
@service_bp.route('/my', methods=['GET'])
@token_required
@provider_required
def get_my_services(current_user):
    services = Service.query.filter_by(provider_id=current_user.id).all()
    return jsonify([s.to_dict() for s in services]), 200


# @route   DELETE /api/services/<id>
# @desc    Service delete (provider only)
# @access  Private + Provider
@service_bp.route('/<int:service_id>', methods=['DELETE'])
@token_required
@provider_required
def delete_service(current_user, service_id):
    service = Service.query.get(service_id)
    
    if not service:
        return jsonify({'message': 'Service not found'}), 404
    
    if service.provider_id != current_user.id:
        return jsonify({'message': 'Unauthorized'}), 403
    
    db.session.delete(service)
    db.session.commit()
    
    return jsonify({'message': 'Service deleted successfully'}), 200