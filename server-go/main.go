package main

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
)

const PORT = 8000

func main() {
	r := chi.NewRouter()

	registerRoutes(r)

	fmt.Println("serving at port", PORT)

	if err := http.ListenAndServe(fmt.Sprintf(":%d", PORT), r); err != nil {
		fmt.Println(err)
	}
}
