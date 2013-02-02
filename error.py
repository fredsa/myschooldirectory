"""Exceptions raised in directory app."""


class DirectoryError(Exception):

  def __init__(self, message):
    super(DirectoryError, self).__init__(message)
