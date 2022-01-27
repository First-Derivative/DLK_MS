# Generated by Django 3.2.8 on 2022-01-27 20:43

import datetime
from django.db import migrations, models
import purchases_app.validators


class Migration(migrations.Migration):

    dependencies = [
        ('purchases_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='purchases',
            name='currency',
            field=models.CharField(choices=[('MYR', 'RM'), ('EUR', '€'), ('USD', '$'), ('SGD', 'SGD')], default='MYR', max_length=10),
        ),
        migrations.AlterField(
            model_name='purchases',
            name='expected_date',
            field=models.CharField(default='null', max_length=200, validators=[purchases_app.validators.check_null], verbose_name='Expected Paymenet Date'),
        ),
        migrations.AlterField(
            model_name='purchases',
            name='po_date',
            field=models.DateField(default=datetime.datetime(1950, 1, 1, 0, 0), verbose_name='Purchase Order Date'),
        ),
        migrations.AlterField(
            model_name='purchases',
            name='project_code',
            field=models.CharField(max_length=100, validators=[purchases_app.validators.validate_project_code], verbose_name='Purchased For'),
        ),
        migrations.AlterField(
            model_name='purchases',
            name='purchase_order',
            field=models.CharField(max_length=20, null=True, validators=[purchases_app.validators.validate_purchase_order], verbose_name='Purchase Order Number'),
        ),
        migrations.AlterField(
            model_name='purchases',
            name='purchased_items',
            field=models.CharField(max_length=80, validators=[purchases_app.validators.check_null], verbose_name='Purchased Item'),
        ),
        migrations.AlterField(
            model_name='purchases',
            name='supplier_date',
            field=models.CharField(default='null', max_length=200, validators=[purchases_app.validators.check_null], verbose_name='Supplier Delivary Date'),
        ),
        migrations.AlterField(
            model_name='purchases',
            name='supplier_name',
            field=models.CharField(default='null', max_length=100, validators=[purchases_app.validators.check_null], verbose_name='Supplier Name'),
        ),
        migrations.AlterField(
            model_name='purchases',
            name='value',
            field=models.DecimalField(decimal_places=2, default='-1', max_digits=8),
        ),
    ]
