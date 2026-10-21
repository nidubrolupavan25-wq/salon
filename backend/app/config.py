# Config - Environment variables ni load cheyyadam
import os
from dotenv import load_dotenv

# .env file nunchi variables load cheyyadam
load_dotenv()

class Config:
    """Application configuration class"""
    
    # Flask secret key (sessions, JWT signing ki)
    SECRET_KEY = os.getenv('SECRET_KEY')
    
    # JWT secret key (tokens sign cheyyadaniki)
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    
    # PostgreSQL database connection URL
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    
    # Object tracking off cheyyadam (performance improve avutundi)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Razorpay credentials (payments ki)
    RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID')
    RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET')