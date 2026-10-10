package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

func registerRoutes(r chi.Router) {
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("go backend"))
	})

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"health":"ok"}`))
	})

	r.Route("/auth", func(r chi.Router) {
		r.Post("/login", handleLogin)
		r.Post("/logout", handleLogout)
		r.Get("/profile", handleProfile)
	})
}

func handleLogin(w http.ResponseWriter, r *http.Request)   {}
func handleLogout(w http.ResponseWriter, r *http.Request)  {}
func handleProfile(w http.ResponseWriter, r *http.Request) {}
