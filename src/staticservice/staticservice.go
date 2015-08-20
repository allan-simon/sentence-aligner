package staticservice

import (
	"github.com/emicklei/go-restful"
	"net/http"
	"path"
)

var rootdir = "static"

func New() *restful.WebService {

	service := new(restful.WebService)
	service.Route(service.GET("/static/{subpath:*}").To(staticFromPathParam))

	return service
}

func staticFromPathParam(req *restful.Request, resp *restful.Response) {
	actual := path.Join(rootdir, req.PathParameter("subpath"))

	http.ServeFile(
		resp.ResponseWriter,
		req.Request,
		actual,
	)
}
