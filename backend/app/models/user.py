# User Model - Customers and Providers iddariki
from app import db
from datetime import datetime
import bcrypt

class User(db.Model):
    """User table - both customers and service providers"""
    
    __tablename__ = 'users'
    
    # Columns
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(15))
    role = db.Column(db.String(20), default='customer')  # 'customer' or 'provider'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships (vere tables tho connections)
    services = db.relationship('Service', backref='provider', lazy=True, cascade='all, delete-orphan')
    bookings = db.relationship('Booking', backref='customer', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Password ni hash chesi store cheyyadam (plain text kadu)"""
        self.password_hash = bcrypt.hashpw(
            password.encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')
    
    def check_password(self, password):
        """Login appudu password verify cheyyadam"""
        return bcrypt.checkpw(
            password.encode('utf-8'),
            self.password_hash.encode('utf-8')
        )
    
    def to_dict(self):
        """User data ni JSON format lo return cheyyadam (password tho kadu!)"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'role': self.role,
            'created_at': self.created_at.isoformat()
        }