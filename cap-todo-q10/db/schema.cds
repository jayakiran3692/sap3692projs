namespace todo;

entity Tasks {
  key ID       : UUID;
      title    : String(255);
      completed: Boolean default false;
      createdAt: DateTime;
}