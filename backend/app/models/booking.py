# Booking Model - Customer bookings
from app import db
from datetime import datetime

class Booking(db.Model):
    """Booking table - customer appointments"""
    
    __tablename__ = 'bookings'
    
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    booking_date = db.Column(db.Date, nullable=False)
    booking_time = db.Column(db.String(10), nullable=False)  # e.g., "10:00 AM"
    status = db.Column(db.String(20), default='pending')     # pending, confirmed, completed, cancelled
    amount = db.Column(db.Numeric(10, 2))
    payment_id = db.Column(db.String(100))                    # Razorpay payment ID
    notes = db.Column(db.Text)                                # Customer notes
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Booking data ni JSON format lo return cheyyadam"""
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'service_id': self.service_id,
            'booking_date': self.booking_date.isoformat(),
            'booking_time': self.booking_time,
            'status': self.status,
            'amount': float(self.amount) if self.amount else None,
            'payment_id': self.payment_id,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'service': self.service.to_dict() if self.service else None,
            'customer': self.customer.to_dict() if self.customer else None
        }