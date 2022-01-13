import re
from django.core.exceptions import ValidationError

def validate_project_code(input):
  pattern = re.compile('DLK-\d{2}-\d{4}')
  if(not pattern.match(input)):
    raise ValidationError("{input} does not match format DLK-XX-YYYY, where X and Y are digits".format(input=input), code="Invalid") 
