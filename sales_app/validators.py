import re
from django.core.exceptions import ValidationError

def validate_project_code(code):
  pattern = re.compile('DLK-\d{2}-\d{4}')
  if(not pattern.match(code)):
    raise ValidationError("Project Code does not match format DLK-XX-YYYY, where X and Y are digits") 