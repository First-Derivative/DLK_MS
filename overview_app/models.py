from django.db import models

class ReportType(models.TextChoices):
  bug = ("BUG", "Bug")
  feature = ("FT", "Feature")

def resolveReport(input):
  for choice in ReportType:
    if(choice.label == input or choice == input):
      return choice

class Report(models.Model):
  report_id = models.BigAutoField(primary_key=True)
  title = models.CharField(null=False, max_length=250)
  body = models.CharField(null=False, max_length=500)
  location = models.CharField(max_length=100, null=True)
  type = models.CharField(max_length=10, choices=ReportType.choices, default=ReportType.bug)

  created_at = models.DateTimeField(auto_now_add=True)