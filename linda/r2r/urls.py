"""
URLS for the Transformation Front end
"""
from django.conf.urls import patterns, include, url
from django.contrib.auth.decorators import login_required
from r2r import views


urlpatterns = patterns('',
                       #Basic pages
                       url(r'^$', views.transform, name='transform'),

                       #js proxies
                       url(r'^api/v1/db/tables', views.get_tables, name='tables'),
                       url(r'^api/v1/db/table', views.get_table, name='tables'),
                       url(r'^api/v1/db/columns', views.get_columns, name='tables'),
                       url(r'^api/v1/lov/properties', views.get_properties, name='tables'),
)
