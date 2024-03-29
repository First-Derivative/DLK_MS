# Generated by Django 3.2.8 on 2022-01-27 20:43

from django.db import migrations, models
import ms_app.validators


class Migration(migrations.Migration):

    dependencies = [
        ('operations_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='operations',
            name='client_name',
            field=models.CharField(max_length=100, validators=[ms_app.validators.check_null]),
        ),
        migrations.AlterField(
            model_name='operations',
            name='finish_detail',
            field=models.CharField(default='null', max_length=100, validators=[ms_app.validators.check_null]),
        ),
        migrations.AlterField(
            model_name='operations',
            name='project_code',
            field=models.CharField(max_length=20, validators=[ms_app.validators.validate_project_code]),
        ),
        migrations.AlterField(
            model_name='operations',
            name='project_name',
            field=models.CharField(max_length=80, validators=[ms_app.validators.check_null]),
        ),
        migrations.AlterField(
            model_name='operations',
            name='status',
            field=models.CharField(default='null', max_length=600, validators=[ms_app.validators.check_null], verbose_name='Production Status'),
        ),
    ]
