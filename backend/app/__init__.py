# Flask app factory - Extensions initialize cheyyadam ikkada
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.config import Config

# Extensions instances (global ga untayi)
db = SQLAlchemy()           # Database ORM
migrate = Migrate()         # DB migrations
jwt = JWTManager()          # JWT authentication

def create_app():
    """Application factory function - Flask app ni create chestundi"""
    
    app = Flask(__name__)
    
    # Config load cheyyadam (.env nunchi)
    app.config.from_object(Config)
    
    # Extensions ni app tho initialize cheyyadam
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # CORS enable cheyyadam (React frontend nunchi requests allow cheyyadaniki)
    CORS(app, origins=["http://localhost:5173"], supports_credentials=True)
    
    # Models import cheyyadam (migrations ki avasaram)
    from app.models import user, service, booking
    
    # Blueprints (route groups) register cheyyadam
    from app.routes.auth_routes import auth_bp
    from app.routes.service_routes import service_bp
    from app.routes.booking_routes import booking_bp
    from app.routes.payment_routes import payment_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(service_bp, url_prefix='/api/services')
    app.register_blueprint(booking_bp, url_prefix='/api/bookings')
    app.register_blueprint(payment_bp, url_prefix='/api/payments')
    
    # Health check route (server running aa leda ani test cheyyadaniki)
    @app.route('/')
    def index():
        return {'message': 'SalonPro API Running', 'status': 'ok'}
    
    return app