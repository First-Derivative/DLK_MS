# Generated by Django 3.2.8 on 2022-01-27 20:38

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Purchases',
            fields=[
                ('purchases_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('purchase_order', models.CharField(max_length=20, null=True, verbose_name='Purchase Order Number')),
                ('project_code', models.CharField(max_length=100, verbose_name='Purchased For')),
                ('po_date', models.DateField(null=True, verbose_name='Purchase Order Date')),
                ('supplier_name', models.CharField(max_length=100, null=True, verbose_name='Supplier Name')),
                ('purchased_items', models.CharField(max_length=80, verbose_name='Purchased Item')),
                ('value', models.DecimalField(decimal_places=2, max_digits=8, null=True)),
                ('currency', models.CharField(choices=[('MYR', 'RM'), ('EUR', '€'), ('USD', '$'), ('SGD', 'SGD')], default='MYR', max_length=10, null=True)),
                ('expected_date', models.CharField(max_length=200, null=True, verbose_name='Expected Paymenet Date')),
                ('supplier_date', models.CharField(max_length=200, null=True, verbose_name='Supplier Delivary Date')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Purchases',
                'verbose_name_plural': 'Purchases',
            },
        ),
    ]