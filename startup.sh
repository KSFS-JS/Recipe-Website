virtualenv -p python3.10 venv
source ./venv/bin/activate 
pip install -r requirements.txt
python3 ./easy_chef/manage.py makemigrations
python3 ./easy_chef/manage.py migrate
npm install --prefix ./easy_chef_web
deactivate