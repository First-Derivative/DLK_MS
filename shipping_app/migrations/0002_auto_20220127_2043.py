# Generated by Django 3.2.8 on 2022-01-27 20:43

from django.db import migrations, models
import ms_app.validators


class Migration(migrations.Migration):

    dependencies = [
        ('shipping_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='shipping',
            name='charges',
            field=models.CharField(default='null', max_length=100, validators=[ms_app.validators.check_null]),
        ),
        migrations.AlterField(
            model_name='shipping',
            name='customer',
            field=models.CharField(default='null', max_length=500, validators=[ms_app.validators.check_null]),
        ),
        migrations.AlterField(
            model_name='shipping',
            name='germany',
            field=models.CharField(default='null', max_length=500, validators=[ms_app.validators.check_null]),
        ),
        migrations.AlterField(
            model_name='shipping',
            name='project_name',
            field=models.CharField(default='null', max_length=80),
        ),
        migrations.AlterField(
            model_name='shipping',
            name='remarks',
            field=models.CharField(default='null', max_length=100, validators=[ms_app.validators.check_null]),
        ),
    ]
