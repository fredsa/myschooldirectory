import json
import os
import webapp2

_JSON_MIME_TYPE = 'application/json'

_JSON_ENCODER = json.JSONEncoder()
_JSON_ENCODER.indent = 4
_JSON_ENCODER.sort_keys = True

_DEV_APPSERVER = os.environ['SERVER_SOFTWARE'].startswith('Development/')


def tojson(r):
  return _JSON_ENCODER.encode(r)


# See http://webapp-improved.appspot.com/guide/extras.html
class JsonHandler(webapp2.RequestHandler):
  """Convenience request handler for dealing with sessions."""

  def dispatch(self):
    """WSGI request dispatch with automatic JSON parsing."""
    content_type = self.request.headers.get('Content-Type')
    if content_type and content_type.split(';')[0] == _JSON_MIME_TYPE:
      self.request.data = json.loads(self.request.body)
    super(JsonHandler, self).dispatch()


class GetConfigHandler(JsonHandler):

    def get(self):
        result = {
          'school': 'Montclaire Elementary',
        }
        self.response.write(tojson(result))

app = webapp2.WSGIApplication([
    ('/api/get_config', GetConfigHandler)
], debug=True)
