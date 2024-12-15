using FireboxGo.DAOs;
using FireboxGo.Models;
using FireboxGo.Services;
using Microsoft.AspNetCore.Mvc;

namespace FireboxGo.Services
{
    public class DataService
    {
        UserDAO userDAO = new UserDAO();
        ItemDAO itemDAO = new ItemDAO();
        DocDAO docDAO = new DocDAO();

        public DataService(UserDAO userDAO, ItemDAO itemDAO, DocDAO docDAO)
        {
            this.userDAO = userDAO;
            this.itemDAO = itemDAO;
            this.docDAO = docDAO;
        }

        public bool LoginService(UserModel user)
        {
            return userDAO.Login(user);
        }

        public bool RegisterService(UserModel user)
        {
            return userDAO.Register(user);
        }

        public bool GetItemsService(ItemModel item)
        {
            return itemDAO.GetItems(item);
        }

        public bool SearchItemsService(ItemModel item)
        {
            return itemDAO.SearchItems(item);
        }

        public bool CreateItemService(ItemModel item)
        {
            return itemDAO.CreateItem(item);
        }

        public bool UpdateItemService(ItemModel item)
        {
            return itemDAO.UpdateItem(item);
        }

        public bool DeleteItemService(ItemModel item)
        {
            return itemDAO.DeleteItem(item);
        }

        public List<DocModel> GetDocsService(int userID)
        {
            return docDAO.GetDocs(userID);
        }

        public bool SearchDocsService(DocModel doc)
        {
            return docDAO.SearchDocs(doc);
        }

        public bool CreateDocService(DocModel doc)
        {
            return docDAO.CreateDoc(doc);
        }

        public bool DeleteDocService(DocModel doc)
        {
            return docDAO.DeleteDoc(doc);
        }
    }
}