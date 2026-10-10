package main

import (
	"errors"
	"sync"
	"time"

	"github.com/google/uuid"
)

var ErrUserNotFound = errors.New("user not found")
var ErrUserNameTaken = errors.New("username is already taken")

type User struct {
	ID           uuid.UUID
	Username     string
	FirstName    string
	LastName     string
	PasswordHash string
}

type Session struct {
	ID        uuid.UUID
	UserID    uuid.UUID
	ExpiresAt time.Time
}

type Store struct {
	mu            sync.Mutex
	users         map[uuid.UUID]User
	userNameIndex map[string]uuid.UUID
	sessions      map[uuid.UUID]Session
}

func (s *Store) CreateUser(
	usersName, firstName, lastName, passwordHash string,
) (User, error) {

	// lock the store
	s.mu.Lock()
	defer s.mu.Unlock()

	// check if username is taken
	if _, exists := s.userNameIndex[usersName]; exists {
		return User{}, ErrUserNameTaken
	}

	user := User{
		ID:           uuid.New(),
		Username:     usersName,
		FirstName:    firstName,
		LastName:     lastName,
		PasswordHash: passwordHash,
	}

	// add new user to store
	s.users[user.ID] = user
	s.userNameIndex[user.Username] = user.ID

	return user, nil
}

func (s *Store) FindUserByUserName(
	userName string,
) (User, error) {
	for _, user := range s.users {
		if user.Username == userName {
			return user, nil
		}
	}

	return User{}, ErrUserNotFound
}
