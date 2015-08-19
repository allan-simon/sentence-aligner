package sentenceservice

import (
	"errors"
	"github.com/allan-simon/sentence-aligner/dao"
	"github.com/allan-simon/sentence-aligner/model"
	"github.com/emicklei/go-restful"
	"log"
	"net/http"
)

var sentenceDao *dao.SentenceDao

//New  initialization
func New(dao *dao.SentenceDao) *restful.WebService {
	sentenceDao = dao
	service := new(restful.WebService)
	service.
		Path("/sentences").
		Consumes(restful.MIME_JSON).
		Produces(restful.MIME_JSON)
	log.Println("Adding GET /sentences/{sentence-id}")
	log.Println("Adding PATCH /sentences/{sentence-id}")
	log.Println("Adding GET /sentences")
	log.Println("Adding POST /sentences")
	service.Route(service.GET("/{sentence-id}").To(FindSentence))
	service.Route(service.PATCH("/{sentence-id}").To(UpdateSentence))
	service.Route(service.GET("/").To(FindSentences))
	service.Route(service.POST("/").To(CreateSentence))

	return service
}

//FindSentence load sentence and return json representation
func FindSentence(request *restful.Request, response *restful.Response) {
	log.Println("Received GET for sentence by id")
	id := request.PathParameter("sentence-id")
	sentence := sentenceDao.GetSentence(id)
	if sentence != nil {
		response.WriteEntity(sentence)
	} else {
		response.WriteError(http.StatusNotFound, errors.New("Sentence not found"))
	}

}

//FindSentence load sentences and return json representation
func FindSentences(request *restful.Request, response *restful.Response) {
	log.Println("Received GET for sentences")
	sentences := sentenceDao.GetSentences()
	if sentences != nil {
		response.WriteEntity(sentences)
	} else {
		response.WriteError(http.StatusNotFound, errors.New("Sentences not found (error ?)"))
	}

}

// create sentence

func CreateSentence(request *restful.Request, response *restful.Response) {
	var sentence1 model.Sentence
	var sentence *model.Sentence

	err := request.ReadEntity(&sentence1)
	if err != nil {
		response.WriteError(http.StatusBadRequest, err)
		return
	}

	sentence = sentenceDao.CreateSentence(&sentence1)

	if sentence == nil {
		response.WriteError(http.StatusInternalServerError, errors.New("Error while saving sentence"))
	}
	response.WriteEntity(sentence)
}

// Update sentence
func UpdateSentence(request *restful.Request, response *restful.Response) {
	var sentence model.Sentence
	err := request.ReadEntity(&sentence)
	id := request.PathParameter("sentence-id")

	if err != nil {
		response.WriteError(http.StatusBadRequest, err)
		return
	}

	updatedSentence, err := sentenceDao.UpdateSentence(id, &sentence)

	if err == nil && updatedSentence == nil {
		response.WriteError(http.StatusNotFound, errors.New("Sentence not found"))
		return
	}

	if updatedSentence == nil {
		response.WriteError(http.StatusInternalServerError, errors.New("Error while saving sentence"))
		return
	}

	response.WriteEntity(updatedSentence)
}
