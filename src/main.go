package main

import (
	"github.com/allan-simon/sentence-aligner/dao"
	"github.com/allan-simon/sentence-aligner/sentenceservice"
	"github.com/allan-simon/sentence-aligner/translationservice"
	"github.com/emicklei/go-restful"
	"log"
	"net/http"
)

func main() {
	sentenceDao := &dao.SentenceDao{}
	translationDao := &dao.TranslationDao{}
	log.Println("Starting service")
	restful.Add(sentenceservice.New(sentenceDao))
	restful.Add(translationservice.New(translationDao))
	log.Fatal(http.ListenAndServe(":8080", nil))
}
