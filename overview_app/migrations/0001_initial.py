# Generated by Django 3.2.8 on 2022-01-27 19:51

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Report',
            fields=[
                ('report_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=250)),
                ('body', models.CharField(max_length=500)),
                ('location', models.CharField(max_length=100, null=True)),
                ('type', models.CharField(choices=[('BUG', 'Bug'), ('FT', 'Feature')], default='BUG', max_length=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]