package sentenceservice

import (
	"errors"
	"github.com/allan-simon/sentence-aligner/dao"
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
	service.Route(service.GET("/{sentence-id}").To(FindSentence))
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
