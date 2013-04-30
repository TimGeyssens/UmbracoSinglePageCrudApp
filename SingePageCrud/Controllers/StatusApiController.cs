using System.Collections.Generic;
using System.Linq;
using Umbraco.Web.WebApi;
using SingePageCrud.Models;
using Umbraco.Web;

namespace SingePageCrud.Controllers
{
    public class StatusApiController : UmbracoApiController
    {
        private const string StatusDocTypeAlias = "Status";
        private const string MessagePropertyAlias = "message";

        //Fetches all status docs under the specified parent
        public IEnumerable<Status> GetAllStatuses(int parentId)
        {
            UmbracoHelper help = new UmbracoHelper(UmbracoContext);
            return help.TypedContent(parentId)
                .Children
                .Where(c => c.DocumentTypeAlias == StatusDocTypeAlias)
                .Select(obj => new Status()
            {
                Title = obj.Name,
                Message = obj.GetPropertyValue<string>(MessagePropertyAlias),Id = obj.Id
            });
        }

        //Gets a single status doc based on the id
        public Status GetStatus(int id)
        {
            UmbracoHelper help = new UmbracoHelper(UmbracoContext);
            var content  = help.TypedContent(id);
            return new Status
            {
                Id = content.Id,
                Title = content.Name,
                Message = content.GetPropertyValue<string>(MessagePropertyAlias)
            };
        }

        //Creates a new status document under the specified parent 
        public Status PostStatus(Status status, int parentId)
        {
            var cs = Services.ContentService;
            var content = cs.CreateContent(status.Title, parentId, StatusDocTypeAlias);
            content.Name = status.Title;
            content.SetValue(MessagePropertyAlias, status.Message);
            cs.SaveAndPublish(content);
            status.Id = content.Id;
            return status;
        
        }

        //Updates a status document
        public Status PutStatus(Status status)
        {
            var cs = Services.ContentService;
            var content = cs.GetById(status.Id);
            content.Name = status.Title;
            content.SetValue(MessagePropertyAlias, status.Message);
            cs.SaveAndPublish(content);
            return status;

        }

        //Deletes a status document
        public void DeleteStatus(int statusId)
        {
            var cs = Services.ContentService;
            var content = cs.GetById(statusId);
            cs.Delete(content);
        }
    }
}
