from app.users.authentication import AuthManager

auth_manager = AuthManager()

# Structure grabbed from http://book.pythontips.com/en/latest/decorators.html
# def requires_auth(f):
#     @wraps(f)
#     def decorated(*args, **kwargs):
#         is_authenticated, message = auth_manager.validate_auth_token(request.headers)
#         if not is_authenticated:
#             return message
#         return f(*args, **kwargs)

#     return decorated
