from django.db import models
    
class Subjects(models.Model):
    name = models.CharField(max_length=20, unique=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    def __unicode__(self):
        return self.name
