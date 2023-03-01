@REM redis-server
@REM virtualenv env
@REM env\scripts\activate
@REM python manage.py makemigrations 
@REM python manage.py makemigrations forum
@REM python manage.py makemigrations users
@REM python manage.py migrate
@REM python manage.py createsuperuser
@REM python manage.py collectstatic
@REM python manage.py test
@REM python manage.py makemessages --all
@REM python manage.py compilemessages
python manage.py runserver
@REM python manage.py check --deploy

@REM pip freeze > requirements.txt
@REM pip install -r requirements.txt

@REM Code Quality Testing
@REM flake8

@REM Celery Commands
@REM celery -A technota_api worker -l info
@REM [For Windows OS]
@REM celery -A technota_api worker -l info --pool=solo

@REM docker-compose -f docker-compose.dev.yml build
@REM docker-compose up --build
@REM docker-compose -f docker-compose.dev.yml run web python3 manage.py makemigrations
@REM docker-compose -f docker-compose.dev.yml run web python3 manage.py migrate
@REM docker-compose -f docker-compose.dev.yml run web python3 manage.py createsuperuser
@REM docker-compose -f docker-compose.dev.yml run web python3 manage.py collectstatic
