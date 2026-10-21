# Service Model - Providers offer chese services
from app import db

class Service(db.Model):
    """Service table - e.g., Haircut, Shave, Facial"""
    
    __tablename__ = 'services'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)  # e.g., 500.00
    duration = db.Column(db.Integer, nullable=False)       # minutes lo (e.g., 30)
    provider_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    
    # Relationships
    bookings = db.relationship('Booking', backref='service', lazy=True)
    
    def to_dict(self):
        """Service data ni JSON format lo return cheyyadam"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': float(self.price),
            'duration': self.duration,
            'provider_id': self.provider_id,
            'provider_name': self.provider.name if self.provider else None,
            'is_active': self.is_active
        }