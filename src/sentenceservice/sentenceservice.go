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
	log.Println("Adding PUT /sentences/{sentence-id}/structure")
	log.Println("Adding GET /sentences")
	log.Println("Adding POST /sentences")
	log.Println("Adding GET /sentences/{sentence-id}/translations/sentences")

	service.Route(service.GET("/{sentence-id}").To(FindSentence))
	service.Route(service.GET("/{sentence-id}/translations/sentences").To(FindTranslationSentences))
	service.Route(service.PUT("/{sentence-id}/structure").To(SetStructure))
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

	if sentence == nil {
		response.WriteError(http.StatusNotFound, errors.New("Sentence not found"))
		return
	}

	response.WriteEntity(sentence)
}

//FindSentence load sentences and return json representation
func FindSentences(request *restful.Request, response *restful.Response) {
	log.Println("Received GET for sentences")

	var sentences *model.Sentences

	fromID := request.QueryParameter("from_id")

	xpath := request.QueryParameter("xpath")
	if xpath != "" {
		sentences = FindSentencesByXPath(xpath, fromID)
		writeSentencesResponse(sentences, response)
		return
	}

	if fromID == "" {
		sentences = sentenceDao.GetSentences()
	} else {
		sentences = sentenceDao.GetSentencesFrom(fromID)
	}
	writeSentencesResponse(sentences, response)
}

//
func FindSentencesByXPath(xpath string, fromID string) (sentences *model.Sentences) {
	if fromID == "" {
		return sentenceDao.GetSentencesByXPath(xpath)
	}

	sentences = sentenceDao.GetSentencesByXPathFrom(xpath, fromID)
	return
}

//
func writeSentencesResponse(sentences *model.Sentences, response *restful.Response) {
	if sentences == nil {
		response.WriteError(
			http.StatusNotFound,
			errors.New("Sentences not found (error ?)"),
		)
		return
	}

	response.WriteEntity(sentences)
}

//Find All translation sentences of a given pivot sentence
func FindTranslationSentences(request *restful.Request, response *restful.Response) {
	log.Println("Received GET for sentence's translation sentences")
	id := request.PathParameter("sentence-id")
	sentences := sentenceDao.GetTranslationSentences(id)

	response.WriteEntity(sentences)
}

// create sentence

func CreateSentence(request *restful.Request, response *restful.Response) {
	var sentence model.Sentence

	err := request.ReadEntity(&sentence)
	if err != nil {
		response.WriteError(http.StatusBadRequest, err)
		return
	}

	createdSentence := sentenceDao.CreateSentence(&sentence)

	if createdSentence == nil {
		existingSentence := sentenceDao.GetSentenceByContentLang(&sentence)
		if existingSentence == nil {
			response.WriteError(
				http.StatusInternalServerError,
				errors.New("Error while saving sentence"),
			)
			return
		}
		response.WriteHeader(http.StatusSeeOther)
		response.ResponseWriter.Header().Set(
			"link",
			"/sentences/"+existingSentence.SentenceID,
		)
		response.WriteEntity(existingSentence)
		return
	}
	response.WriteEntity(createdSentence)
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
		response.WriteError(
			http.StatusNotFound,
			errors.New("Sentence not found"),
		)
		return
	}

	if updatedSentence == nil {
		// TODO: duplicated code: factorize
		existingSentence := sentenceDao.GetSentenceByContentLang(&sentence)
		if existingSentence == nil {
			response.WriteError(
				http.StatusInternalServerError,
				errors.New("Error while saving sentence"),
			)
			return
		}
		response.WriteHeader(http.StatusSeeOther)
		response.ResponseWriter.Header().Set(
			"link",
			"/sentences/"+existingSentence.SentenceID,
		)
		response.WriteEntity(existingSentence)
		return
	}

	response.WriteEntity(updatedSentence)
}

//
func SetStructure(request *restful.Request, response *restful.Response) {
	var sentence model.Sentence
	err := request.ReadEntity(&sentence)
	id := request.PathParameter("sentence-id")

	if err != nil {
		response.WriteError(http.StatusBadRequest, err)
		return
	}

	updatedSentence, err := sentenceDao.SetStructure(id, &sentence)

	if err == nil && updatedSentence == nil {
		response.WriteError(
			http.StatusNotFound,
			errors.New("Sentence not found"),
		)
		return
	}

	existingSentence := sentenceDao.GetSentence(id)
	// TODO: duplicated code: factorize
	if existingSentence == nil {
		response.WriteError(
			http.StatusInternalServerError,
			errors.New("Error while saving sentence"),
		)
		return
	}
	response.WriteHeader(http.StatusSeeOther)
	response.ResponseWriter.Header().Set(
		"link",
		"/sentences/"+existingSentence.SentenceID,
	)
	response.WriteEntity(existingSentence)

}
