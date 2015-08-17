package main

import (
	"github.com/allan-simon/sentence-aligner/dao"
	"github.com/allan-simon/sentence-aligner/sentenceservice"
	"github.com/emicklei/go-restful"
	"log"
	"net/http"
)

func main() {
	sentenceDao := &dao.SentenceDao{}
	log.Println("Starting service")
	restful.Add(sentenceservice.New(sentenceDao))
	log.Fatal(http.ListenAndServe(":8080", nil))
}
