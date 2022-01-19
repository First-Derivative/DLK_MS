from django.shortcuts import redirect
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse

# Disables access to rest of site if user is unathenticated *consider refactor if low use case
def unauthenticated_check(view_func):
	def wrapper_func(request, *args, **kwargs):
		if request.user.is_authenticated:
			return view_func(request, *args, **kwargs)
		else:
			return redirect("user_login")

	return wrapper_func

# Whitelists access to page if user has assigned role (group) allowed_roles
def role_check(allowed_roles=""):
  def decorator(view_func):
    def wrapper_func(request, *args, **kwargs):
      user_groups = request.user.groups.all()
      if request.user.groups.exists():
        for group in user_groups:
          if( group.name == allowed_roles):
            return view_func(request, *args, **kwargs)
        return JsonResponse({"error":{"not_authorized":"You are not authorized to perform this function"}})    
      else:
        return JsonResponse({"error":{"not_authorized":"You are not authorized to perform this function"}})
    return wrapper_func
  return decorator

def method_check(allowed_methods=[]):
  def decorator(view_func):
    def wrapper_func(request, *args, **kwargs):
      if request.method in allowed_methods:
        return view_func(request, *args, **kwargs)
      else:
        return HttpResponseBadRequest("Suspicious Request methods used")
    
    return wrapper_func
  return decorator



"""
def timeit(method):

   def timed(*args, **kw):
       ts = time.time()
       result = method(*args, **kw)
       te = time.time()
       print("%r (%r, %r) %2.2f sec" % (method.__name__, args, kw, te - ts))
       return result

   return timed

"""