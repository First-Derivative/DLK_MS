# Generated by Django 3.2.8 on 2022-01-27 20:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('sales_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PaymentStatus',
            fields=[
                ('paymentstatus_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('invoice_number', models.CharField(max_length=30)),
                ('invoice_date', models.DateField()),
                ('status', models.CharField(max_length=100)),
                ('completed', models.BooleanField(default=False)),
                ('cancelled', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('sales_relation', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='sales', to='sales_app.sales')),
            ],
            options={
                'verbose_name': 'Payment Status',
                'verbose_name_plural': 'Payment Status',
            },
        ),
    ]
