using FireboxGo.DAOs;
using FireboxGo.Models;
using FireboxGo.Services;
using FireboxGo.Security;
using Microsoft.AspNetCore.Mvc;

namespace FireboxGo.Services
{
    public class DataService
    {
        UserDAO userDAO = new UserDAO();
        FolderDAO folderDAO = new FolderDAO();
        ItemDAO itemDAO = new ItemDAO();
        DocDAO docDAO = new DocDAO();

        SecurityHasher securityHasher = new SecurityHasher();

        // Data Access Object instantiations
        public DataService(UserDAO userDAO, FolderDAO folderDAO, ItemDAO itemDAO, DocDAO docDAO, SecurityHasher securityHasher)
        {
            this.userDAO = userDAO;
            this.folderDAO = folderDAO;
            this.itemDAO = itemDAO;
            this.docDAO = docDAO;
            this.securityHasher = securityHasher;
        }

        // Calls login service from the controller
        public int LoginService(UserModel user)
        {
            return userDAO.Login(user);
        }

        // Calls register service from the controller
        public int RegisterService(UserModel user)
        {
            user.password = securityHasher.Store(user.password);
            return userDAO.Register(user);
        }

        // Calls userID service from the controller
        public int GetUserIDService(UserModel user)
        {
            return userDAO.GetUserID(user);
        }

        // Calls account info service from the controller
        public UserModel GetAccountInfoService(int userID)
        {
            return userDAO.GetAccountInfo(userID);
        }

        // Calls household totals service from the controller
        public List<decimal> GetHouseholdTotalsService(int userID)
        {
            return userDAO.GetHouseholdTotals(userID);
        }

        // Calls name search all service from the controller
        public List<object> NameSearchAllService(string search, int userID)
        {
            return userDAO.NameSearchAll(search, userID);
        }

        // Calls tag search all service from the controller
        public List<object> TagSearchAllService(string search, int userID)
        {
            return userDAO.TagSearchAll(search, userID);
        }

        // Calls get folders service from the controller
        public List<FolderModel> GetFoldersService(int userID)
        {
            return folderDAO.GetFolders(userID);
        }

        // Calls create folders service from the controller
        public bool CreateFolderService(FolderModel folder, int userID)
        {
            return folderDAO.CreateFolder(folder, userID);
        }

        // Calls update folders service from the controller
        public bool UpdateFolderService(FolderModel folder, int userID, int folderID)
        {
            return folderDAO.UpdateFolder(folder, userID, folderID);
        }

        // Calls delete folders service from the controller
        public bool DeleteFolderService(int folderID)
        {
            return folderDAO.DeleteFolder(folderID);
        }

        // Calls get tags service from the controller
        public List<string> GetTagsService()
        {
            return folderDAO.GetTags();
        }

        // Calls get items service from the controller
        public List<ItemModel> GetItemsService(int userID, int folderID)
        {
            return itemDAO.GetItems(userID, folderID);
        }

        // Calls create items service from the controller
        public bool CreateItemService(ItemModel item, int userID)
        {
            return itemDAO.CreateItem(item, userID);
        }

        // Calls update items service from the controller
        public bool UpdateItemService(ItemModel item, int userID, int itemID)
        {
            return itemDAO.UpdateItem(item, userID, itemID);
        }

        // Calls delete items service from the controller
        public bool DeleteItemService(int itemID)
        {
            return itemDAO.DeleteItem(itemID);
        }

        // Calls get room value service from the controller
        public decimal GetRoomValueService(int folderID)
        {
            return itemDAO.GetRoomValue(folderID);
        }

        // Calls get files service from the controller
        public List<DocModel> GetFilesService(int userID)
        {
            return docDAO.GetFiles(userID);
        }

        // Calls upload file service from the controller
        public bool UploadFileService(DocModel newDoc, int userID)
        {
            return docDAO.UploadFile(newDoc, userID);
        }

        // Calls delete file service from the controller
        public bool DeleteFileService(int docID)
        {
            return docDAO.DeleteFile(docID);
        }
    }
}