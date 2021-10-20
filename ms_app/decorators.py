from django.shortcuts import redirect
from django.http import HttpResponse

# Disables access to rest of site if user is unathenticated *consider refactor if low use case
def unauthenticated_check(view_func):
	def wrapper_func(request, *args, **kwargs):
		if request.user.is_authenticated:
			return redirect('login')
		else:
			return view_func(request, *args, **kwargs)

	return wrapper_func

# Whitelists access to page if user has assigned role (group) allowed_roles
def allowed_users(allowed_roles=[]):
	def decorator(view_func):
		def wrapper_func(request, *args, **kwargs):

			group = None
			if request.user.groups.exists():
				group = request.user.groups.all()[0].name

			if group in allowed_roles:
				return view_func(request, *args, **kwargs)
			else:
				return HttpResponse('You are not authorized to view this page')
		return wrapper_func
	return decorator