package translationservice

import (
	"errors"
	"github.com/allan-simon/sentence-aligner/dao"
	"github.com/allan-simon/sentence-aligner/model"
	"github.com/emicklei/go-restful"
	"log"
	"net/http"
)

var translationDao *dao.TranslationDao

//New  initialization
func New(dao *dao.TranslationDao) *restful.WebService {
	translationDao = dao
	service := new(restful.WebService)
	service.
		Path("/translations").
		Consumes(restful.MIME_JSON).
		Produces(restful.MIME_JSON)

	log.Println("Adding GET /translations/{translation-id}")
	log.Println("Adding POST /translations")
	log.Println("Adding GET /translations")
	log.Println("Adding PUT /translations/{translation-id}/alignments")

	service.Route(service.GET("/{translation-id}").To(FindTranslation))
	service.Route(service.POST("/").To(CreateTranslation))
	service.Route(service.GET("/").To(FindTranslations))
	service.Route(service.PUT("/{translation-id}/alignments").To(AddAlignments))

	return service
}

//FindTranslation load translation and return json representation
func FindTranslation(request *restful.Request, response *restful.Response) {

	log.Println("Received GET for translation by id")
	id := request.PathParameter("translation-id")
	translation := translationDao.GetTranslation(id)

	if translation == nil {
		response.WriteError(
			http.StatusNotFound,
			errors.New("Translation not found"),
		)
		return
	}
	response.WriteEntity(translation)
}

//FindTranslations load all translations and return json representation
func FindTranslations(request *restful.Request, response *restful.Response) {
	log.Println("Received GET for translations")
	translations := translationDao.GetTranslations()

	if translations == nil {
		response.WriteError(
			http.StatusNotFound,
			errors.New("Translations not found (?)"),
		)
		return
	}
	response.WriteEntity(translations)
}

// create translation
func CreateTranslation(request *restful.Request, response *restful.Response) {

	var translation model.Translation
	err := request.ReadEntity(&translation)

	if err != nil {
		response.WriteError(http.StatusBadRequest, err)
		return
	}

	createdTranslation := translationDao.CreateTranslation(&translation)

	if createdTranslation == nil {
		existingTranslation := translationDao.GetTranslationBySourceDestId(&translation)
		if existingTranslation == nil {
			response.WriteError(
				http.StatusInternalServerError,
				errors.New("Error while saving translation"),
			)
			return
		}
		response.WriteHeader(http.StatusSeeOther)
		response.ResponseWriter.Header().Set(
			"link",
			"/translations/"+existingTranslation.TranslationID,
		)
		response.WriteEntity(existingTranslation)
		return
	}
	response.WriteEntity(createdTranslation)
}

// Add alignments to a translation
func AddAlignments(request *restful.Request, response *restful.Response) {

	var translation model.Translation
	err := request.ReadEntity(&translation)

	if err != nil {
		response.WriteError(http.StatusBadRequest, err)
		return
	}
	id := request.PathParameter("translation-id")
	updatedTranslation, err := translationDao.AddAlignments(id, &translation)

	if err == nil && updatedTranslation == nil {
		response.WriteError(http.StatusNotFound, errors.New("Translation not found"))
		return
	}

	if updatedTranslation == nil {
		response.WriteError(
			http.StatusInternalServerError,
			errors.New("Error while adding alignments"),
		)
		return
	}

	response.WriteEntity(updatedTranslation)

}
