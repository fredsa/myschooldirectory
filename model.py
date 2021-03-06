from google.appengine.ext import ndb

from endpoints_proto_datastore.ndb import EndpointsModel


class Person(EndpointsModel):
   email = ndb.StringProperty()
   first_name = ndb.StringProperty(indexed=False)
   last_name = ndb.StringProperty(indexed=False)
   created = ndb.DateTimeProperty(indexed=False, auto_now_add=True)

class ParentGuardian(Person):
   # adding 'id' gives us key.id()
   _message_fields_schema = ('email', 'first_name', 'last_name', 'created', 'id')

class Child(Person):
   # adding 'id' gives us key.id()
   _message_fields_schema = ('email', 'first_name', 'last_name', 'created', 'id')


# TODO: remove temporary development hack
@ndb.transactional(xg=True)
def init():
  key = ndb.Key(ParentGuardian, 42)
  pg = key.get()
  if not pg:
    ParentGuardian(key=key, email='jane@example.com', first_name='Jane', last_name='Smith').put()

  key = ndb.Key(Child, 67)
  child = key.get()
  if not child:
    Child(key=key, email='sophia@example.com', first_name='Sophia', last_name='Smith').put()

init()
