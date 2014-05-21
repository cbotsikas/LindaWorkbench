import views

from django.contrib import admin
from django.conf.urls import patterns, include, url
from django.contrib.auth.decorators import login_required

admin.autodiscover()

urlpatterns = patterns('',
	#Basic pages
    url(r'^$', views.index, name='home'),
	url(r'^sparql/$', views.sparql, name='sparql'),
	url(r'^terms-of-use/$', views.terms, name='terms'),
	url(r'^community/$', login_required(views.UserListView.as_view()), name='community'),
	
	#Authentication
    url(r'^admin/', include(admin.site.urls)),
	url(r'^accounts/', include('allauth.urls')),
	url(r'^profile/(?P<pk>\d+)/$', login_required(views.profile), name='profile'),
	url(r'^profile/(?P<pk>\w+)/edit$', login_required(views.UserUpdateView.as_view()), name='profile-edit'),
	
	#Messaging
	(r'^messages/', include('messages.urls')),
	
	#Vocabularies
	url(r'^vocabulary/(?P<pk>\d+)/$', views.VocabularyDetailsView.as_view(), name='vocabulary-detail'),
	url(r'^vocabulary/(?P<pk>\d+)/(?P<slug>[\w-]+)/$', views.VocabularyDetailsView.as_view(), name='vocabulary-detail'),
	url(r'^vocabulary/(?P<pk>\d+)/(?P<slug>[\w-]+)/edit/', views.VocabularyUpdateView.as_view(), name='vocabulary-edit'),
	url(r'^vocabulary/(?P<pk>\d+)/(?P<slug>[\w-]+)/delete/', views.VocabularyDeleteView.as_view(), name='vocabulary-delete'),
	url(r'^vocabulary/(?P<pk>\d+)/(?P<slug>[\w-]+)/visualize/', views.VocabularyVisualize.as_view(), name='vocabulary-visualize'),
	
	url(r'^vocabulary/(?P<pk>\d+)/rate/(?P<vt>\d+)', views.rateDataset, name='vocabulary-rate'),
	url(r'^vocabulary/(?P<pk>\d+)/comment/', views.postComment, name='vocabulary-comment'),
	
	#API calls
	url(r'^api/users/', login_required(views.users), name='users'),
)
