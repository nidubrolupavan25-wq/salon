# Flask app entry point - Idi run chesinappudu server start avutundi
from app import create_app

# App create cheyyadam
app = create_app()

if __name__ == '__main__':
    # Development server run cheyyadam
    # debug=True - code marchinappudu auto-reload avutundi
    app.run(debug=True, port=5000)