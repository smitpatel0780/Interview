# Create a virtual environment
python -m venv env

# Activate the virtual environment
# On Windows:
env\Scripts\activate
# On macOS/Linux:
source env/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the development server
uvicorn main:app --reload
