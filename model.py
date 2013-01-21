from google.appengine.ext import ndb

from endpoints_proto_datastore.ndb import EndpointsModel


class ParentGuardian(EndpointsModel):

   # adding 'id' gives us key.id()
   _message_fields_schema = ('email', 'first_name', 'last_name', 'created', 'id')

   email = ndb.StringProperty()
   first_name = ndb.StringProperty(indexed=False)
   last_name = ndb.StringProperty(indexed=False)
   created = ndb.DateTimeProperty(indexed=False, auto_now_add=True)


# TODO: remove temporary development hack
ParentGuardian.get_or_insert('42', email='test@example.com', first_name='Jane', last_name='Smith')
