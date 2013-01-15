from google.appengine.ext import ndb

from endpoints_proto_datastore.ndb import EndpointsModel


class ParentGuardian(EndpointsModel):

   # adding 'id' gives us key.id()
   _message_fields_schema = ('first_name', 'created', 'id')

   first_name = ndb.StringProperty(indexed=False)
   created = ndb.DateTimeProperty(indexed=False, auto_now_add=True)
