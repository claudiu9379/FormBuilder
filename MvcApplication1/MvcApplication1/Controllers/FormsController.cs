using MvcApplication1.Repo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ESB.Utils.Serializers;

namespace MvcApplication1.Controllers
{
    public class FormsController : Controller
    {
        //
        // GET: /Forms/

        public ActionResult Index()
        {
            return View();
        }

        public void SaveJson(string formName, string json)
        {
            FormsRepo formsRepo = new FormsRepo();
           var frm =  formsRepo.Find(it => it.FormName == formName).FirstOrDefault();

           if (frm != null)
           {
               frm.json = json;
               formsRepo.Update(frm);
           }
           else {

               frm = new GreatfulPatient.DAL.Entities.Forms() { FormName = formName,json= json};
               formsRepo.Insert(frm);
           }
        }

        public string GetForms()
        {
            FormsRepo formsRepo = new FormsRepo();
            var forms =  formsRepo.GetAll().Select(it => new { it.ID, it.FormName }).ToList();

            return forms.ToJSON();
        }

        public string GetFormById(string id)
        {
            if (id == null)
                return "";
            FormsRepo formsRepo = new FormsRepo();
            var frm = formsRepo.Find(it => it.ID == int.Parse(id)).FirstOrDefault();
            if (frm == null)
            {
                return "";
            }
            return frm.ToJSON();
        }
    }
}
