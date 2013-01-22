from google.appengine.ext import ndb
from endpoints_proto_datastore.ndb import EndpointsModel

import json
import logging
import os
import pprint as pp
import webapp2

from protorpc import remote

import endpoints

from model import ParentGuardian


_JSON_MIME_TYPE = 'application/json'

_JSON_ENCODER = json.JSONEncoder()
_JSON_ENCODER.indent = 4
_JSON_ENCODER.sort_keys = True

_DEV_APPSERVER = os.environ['SERVER_SOFTWARE'].startswith('Development/')


def e(msg, *args, **kwargs):
  if isinstance(msg, basestring):
    msg = msg.format(*args, **kwargs)
  raise Exception(repr(msg))


def w(msg, *args, **kwargs):
  if isinstance(msg, basestring):
    msg = msg.format(*args, **kwargs)
  logging.warning('##### {0}'.format(repr(msg)))



#def tojson(r):
#  return _JSON_ENCODER.encode(r)


## See http://webapp-improved.appspot.com/guide/extras.html
#class JsonHandler(webapp2.RequestHandler):
#  """Convenience request handler for dealing with sessions."""
#
#  def dispatch(self):
#    """WSGI request dispatch with automatic JSON parsing."""
#    content_type = self.request.headers.get('Content-Type')
#    if content_type and content_type.split(';')[0] == _JSON_MIME_TYPE:
#      self.request.data = json.loads(self.request.body)
#    super(JsonHandler, self).dispatch()

CLIENT_ID = '707601816431.apps.googleusercontent.com'
CLIENT_SECRET = '_dkXUOzknvFh2M3FGc7Fhqjd'
SCOPE_EMAIL = 'https://www.googleapis.com/auth/userinfo.email'
#SCOPE_USERINFO = 'https://www.googleapis.com/auth/userinfo.profile'

@endpoints.api(name='directory', version='v1',
               description='My School Directory API',
               #hostname='localhost:8080',
               #audiences=[],
               allowed_client_ids=[
                   endpoints.API_EXPLORER_CLIENT_ID,
                   CLIENT_ID,
               ],
               #scopes=[SCOPE_EMAIL, SCOPE_USERINFO],
               scopes=[SCOPE_EMAIL],
              )
class DirectoryApi(remote.Service):

  #@endpoints.method(RequestMessageClass, ResponseMessageClass,
  #                  #name=___,
  #                  #path=___,
  #                  #http_method=___,
  #                  #audiences=___,
  #                  #allowed_client_ids=___,
  #                  #scopes=___,
  #                  #cache_control=___,
  #                 )
  #def get_config(self, request):
  #  pass

  @ParentGuardian.method(path='parentguardian',
                         name='parentguardian.put',
                         #http_method='POST',
                        )
  def ParentGuardianPut(self, parent_guardian):
    w('parent_guardian %s' % parent_guardian)
    parent_guardian.put()
    return parent_guardian

  @ParentGuardian.query_method(path='parentguardian',
                               name='parentguardian.list',
                               user_required=True,
                              )
  def ParentGuardianList(self, query):
    return query


#class GetConfigHandler(JsonHandler):
#
#  def get(self):
#    result = {
#        'school': 'Montclaire Elementary',
#    }
#    self.response.write(tojson(result))

#app = webapp2.WSGIApplication([
#    ('/api/get_config', GetConfigHandler)
#], debug=True)

app = endpoints.api_server([DirectoryApi], restricted=True)
